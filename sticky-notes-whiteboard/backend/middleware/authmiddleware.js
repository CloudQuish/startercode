const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied, no token provided" });
    }
  
  const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded)
      req.user = decoded; // Attach user info from token to the request
      next();
    } catch (err) {
      console.error("Invalid token:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = authMiddleware;