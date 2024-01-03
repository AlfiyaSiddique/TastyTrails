import jwt from "jsonwebtoken"


// Middleware to authenticate Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({success:false,  message: 'Token verification failed' });
    }
    req.user = decoded;
    next();
  });
};

export default authenticateToken;
