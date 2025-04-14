import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'fsjgehjfdnghsjfnbvhecbb74359345nfhenvehrnvc';

export function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, SECRET, {
    expiresIn: '7d'
  });
}

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token || typeof token !== 'string') {
    return res.status(401).json({ error: 'Token missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};