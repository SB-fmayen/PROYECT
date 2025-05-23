const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      roleId,
      isActive,
      createdFrom,
      createdTo,
    } = req.query;

    // ✅ Filtros corregidos (sin 'mode' y con sanitización)
    const filters = {
      name: name ? { 
        contains: name.trim().toLowerCase() // Convierte a minúsculas
      } : undefined,
      email: email ? { 
        contains: email.trim().toLowerCase() 
      } : undefined,
      roleId: roleId ? Number(roleId) : undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      createdAt: createdFrom && createdTo ? {
        gte: new Date(createdFrom + 'T00:00:00Z'),
        lte: new Date(createdTo + 'T23:59:59Z')
      } : undefined
    };

    // Limpia filtros undefined
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

    const users = await prisma.user.findMany({
      where: cleanFilters,
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};