const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Acceso denegado: rol no autorizado' });
    }

    next();
  };
};

module.exports = checkRole;
