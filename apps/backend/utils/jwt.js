import jwt from 'jsonwebtoken';

const SECRET = 'fsjgehjfdnghsjfnbvhecbb74359345nfhenvehrnvc'; // Replace with env var in prod

export function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, SECRET, {
    expiresIn: '7d'
  });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
