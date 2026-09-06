const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
    }

    // If token does not exist
    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Token missing."
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user and attach to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    // Continue to next controller
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid token."
    });
  }
};

module.exports = protect;
