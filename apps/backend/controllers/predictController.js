import axios from 'axios';  // Ensure axios is imported
import Prediction from '../models/Prediction.js';

export const predictDelight = async (req, res) => {
  const { merchant_id, features, feedback } = req.body;

  // Log the request body to check if it contains the 'features' object
  console.log('Request Body:', req.body);

  const requiredFields = [
    'avg_txn_value',
    'failed_txns_last_7d',
    'support_tickets_last_30d',
    'csat_score',
    'settlement_delay_avg',
    'api_failure_rate',
    'active_days_last_month'
  ];

  if (!features) {
    return res.status(400).json({ message: 'Features object is missing from the request.' });
  }

  // Check if all required fields are in the features object
  for (let field of requiredFields) {
    if (!features.hasOwnProperty(field)) {
      return res.status(400).json({ message: `Missing field: ${field}` });
    }
  }

  try {
    console.log("Features being sent to the ML API:", features);

    // Send the request to the ML API for prediction
    const mlResponse = await axios.post('http://localhost:5000/predict', features);
    
    console.log("ML API Response:", mlResponse.data);

    if (mlResponse.data && mlResponse.data.delight_score) {
      const delight_score = mlResponse.data.delight_score;

      const prediction = new Prediction({ merchant_id, delight_score, feedback });
      await prediction.save();

      res.json({ merchant_id, delight_score });
    } else {
      res.status(500).json({ message: 'Prediction failed, no score returned.' });
    }
  } catch (err) {
    console.error("Error in prediction:", err.message);
    res.status(500).json({ message: 'Prediction failed.', error: err.message });
  }
};

export const getPredictionByMerchantId = async (req, res) => {
  const { merchant_id } = req.params;

  try {
    const prediction = await Prediction.findOne({ merchant_id });

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found.' });
    }

    res.json(prediction);
  } catch (err) {
    console.error('Error fetching prediction:', err.message);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
