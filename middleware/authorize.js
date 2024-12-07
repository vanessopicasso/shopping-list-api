const authorizeListOwner = (req, res, next) => {
    // Check if the user's role is 'ListOwner' or an 'Admin' role
    const allowedRoles = ["ListOwner", "Admin"]; 
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Only the following roles can perform this action: ${allowedRoles.join(", ")}.`
      });
    }
    next(); // Proceed to the next middleware or route handler
  };
  
  module.exports = authorizeListOwner;