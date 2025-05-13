const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUsers = async (req, res) => {
  try {
    console.log("🔍 Entró a /users");
    const users = await prisma.user.findMany({
      include: { role: true }
    });
    console.log("📦 Usuarios encontrados:", users);
    res.json(users);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};
