import Merchant from '../models/Merchant.js';

export const createMerchant = async (req, res) => {
    try {
        const { merchant_id, avg_txn_value, failed_txns_last_7d, support_tickets_last_30d, csat_score, settlement_delay_avg, api_failure_rate, active_days_last_month } = req.body;

        // Validate required fields
        if (
            merchant_id == null ||
            avg_txn_value == null ||
            failed_txns_last_7d == null ||
            support_tickets_last_30d == null ||
            csat_score == null ||
            settlement_delay_avg == null ||
            api_failure_rate == null ||
            active_days_last_month == null
        ) {
            return res.status(400).json({ message: 'All fields are required and cannot be null or empty.' });
        }

        // Create a new merchant
        const newMerchant = new Merchant({
            merchant_id,
            avg_txn_value,
            failed_txns_last_7d,
            support_tickets_last_30d,
            csat_score,
            settlement_delay_avg,
            api_failure_rate,
            active_days_last_month,
        });

        // Save to database
        const savedMerchant = await newMerchant.save();
        res.status(201).json({ message: 'Merchant created successfully.', merchant: savedMerchant });
    } catch (err) {
        console.error('Error creating merchant:', err.message);
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

export const getMerchantById = async (req, res) => {
    const { merchant_id } = req.params;
    console.log("Fetching Merchant with ID:", merchant_id);
    try {
        // Fetch merchant data by merchant_id
        const merchant = await Merchant.findOne({ merchant_id });

        if (!merchant) {
            return res.status(404).json({ message: 'Merchant not found.' });
        }

        res.status(200).json(merchant);
    } catch (err) {
        console.error('Error fetching merchant data:', err.message);
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};