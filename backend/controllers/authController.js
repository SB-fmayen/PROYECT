const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// 📝 REGISTRO
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email no válido' });
    }

    const existingUser = await prisma.usuario.findUnique({ where: { correo: email } });
    if (existingUser) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const rolEncargado = await prisma.rol.findFirst({
      where: { nombre: 'Encargado' }
    });

    if (!rolEncargado) {
      return res.status(500).json({ error: 'Rol Encargado no encontrado en la base de datos' });
    }

    const newUser = await prisma.usuario.create({
      data: {
        nombre: name,
        correo: email,
        contrasena: hashedPassword,
        rol: {
          connect: { id: rolEncargado.id }
        }
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: {
          select: {
            nombre: true
          }
        }
      }
    });

    console.log('✅ Usuario registrado:', newUser.correo);
    res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
  } catch (error) {
    console.error('🔥 Error en registro:', error.message);
    res.status(500).json({ error: error.message || 'Error interno en registro' });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({
      where: { correo: email },
      include: { rol: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.correo,
        role: user.rol?.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.nombre,
        email: user.correo,
        role: user.rol?.nombre
      }
    });
  } catch (error) {
    console.error('🔥 Error en login:', error.message);
    res.status(500).json({ error: 'Error interno en login' });
  }
};
