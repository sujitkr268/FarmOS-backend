const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    // Check whether the user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission."
      });
    }

    // User has permission
    next();
  };
};

module.exports = authorizeRoles;
