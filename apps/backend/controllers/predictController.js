import axios from 'axios';
import Prediction from '../models/Prediction.js';

export const predictDelight = async (req, res) => {
  const { merchant_id, features, feedback } = req.body;

  try {
    const mlResponse = await axios.post('http://localhost:5000/predict', { features });
    const delight_score = mlResponse.data.delight_score;

    const prediction = new Prediction({ merchant_id, delight_score, feedback });
    await prediction.save();

    res.json({ merchant_id, delight_score });
  } catch (err) {
    res.status(500).json({ message: 'Prediction failed.', error: err.message });
  }
};