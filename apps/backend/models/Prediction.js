import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  merchant_id: String,
  delight_score: Number,
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Prediction', predictionSchema);