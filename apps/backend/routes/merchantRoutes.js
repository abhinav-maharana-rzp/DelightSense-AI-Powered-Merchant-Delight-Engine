import express from 'express';
import {processMerchantData} from '../scripts/merchantPredictionScript.js';
import {createMerchant, getMerchantById} from "../controllers/merchantController.js"; // Ensure the script is correctly imported

const router = express.Router();

router.post('/run-prediction', async (req, res) => {
    try {
        await processMerchantData(); // Run the prediction script
        res.status(200).json({ message: 'Merchant prediction script executed successfully.' });
    } catch (err) {
        console.error('Error running merchant prediction script:', err.message);
        res.status(500).json({ message: 'Error running merchant prediction script.', error: err.message });
    }
});

router.post('/create', createMerchant);

router.get('/get/:merchant_id', getMerchantById);

export default router;