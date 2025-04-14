import mongoose from 'mongoose';

const merchantSchema = new mongoose.Schema({
    _id: { type: String }, // Use merchant_id as the _id field
    merchant_id: { type: String, required: true, unique: true },
    avg_txn_value: { type: Number, required: true },
    failed_txns_last_7d: { type: Number, required: true },
    support_tickets_last_30d: { type: Number, required: true },
    csat_score: { type: Number, required: true },
    settlement_delay_avg: { type: Number, required: true },
    api_failure_rate: { type: Number, required: true },
    active_days_last_month: { type: Number, required: true },
});

// Ensure _id is set to merchant_id before saving
merchantSchema.pre('save', function (next) {
    this._id = this.merchant_id;
    next();
});

export default mongoose.model('merchant', merchantSchema);