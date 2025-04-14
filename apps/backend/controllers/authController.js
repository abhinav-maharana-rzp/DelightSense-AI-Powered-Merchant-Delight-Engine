import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user);
  res.json({ token });
};

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ message: "User registered successfully." });
  } catch (err) {
    res.status(400).json({ message: "User already exists." });
  }
};