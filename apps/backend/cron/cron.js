import cron from 'node-cron';
import { processMerchantData } from '../scripts/merchantPredictionScript.js';


// Schedule the function to run every 10 seconds
cron.schedule('*/10 * * * * *', async () => {
    const currentTime = new Date().toISOString();
    console.log(`Cron job running at: ${currentTime}`);
    await processMerchantData();
});