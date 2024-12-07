const jwt = require("jsonwebtoken");

// A helper function to verify token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        reject("Invalid or expired token.");
      }
      resolve(decoded);
    });
  });
};

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract JWT token from Authorization header

  if (!token) {
    return res.status(403).json({ error: "No token provided." });
  }

  try {
    const decoded = await verifyToken(token);
    req.user = decoded; // Attach the user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: error });
  }
};

module.exports = authenticate;