import MerchantData from '../models/Merchant.js'; // Ensure the MerchantData model is correctly imported
import Prediction from '../models/Prediction.js'; // Ensure the Prediction model is correctly imported
import axios from 'axios';

export const processMerchantData = async () => {
    try {

        // List of possible descriptions for ticket creation
        const descriptions = [
            "Low delight score detected",
            "High API failure rate observed",
            "Frequent transaction failures reported",
            "Customer dissatisfaction reported",
            "Settlement delays exceeding threshold"
        ];

        // Randomly select a description
        const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];


        // Fetch all merchants from the merchantData collection
        const merchants = await MerchantData.find();
        // console.log("Merchant List", merchants);

        for (const merchant of merchants) {
            console.log(`Processing merchant_id: ${merchant.merchant_id}`);
            const merchant_id = merchant.merchant_id;
            const features = {
                avg_txn_value: merchant.avg_txn_value,
                failed_txns_last_7d: merchant.failed_txns_last_7d,
                support_tickets_last_30d: merchant.support_tickets_last_30d,
                csat_score: merchant.csat_score,
                settlement_delay_avg: merchant.settlement_delay_avg,
                api_failure_rate: merchant.api_failure_rate,
                active_days_last_month: merchant.active_days_last_month,
            };

            try {
                // Call the prediction API
                const response = await axios.post('http://localhost:5000/predict', features);

                if (response.data && response.data.delight_score) {
                    const delight_score = response.data.delight_score;

                    // Check if a prediction already exists for the merchant_id
                    const existingPrediction = await Prediction.findOne({ merchant_id });

                    if (existingPrediction) {
                        // Update the existing prediction
                        existingPrediction.delight_score = delight_score;
                        await existingPrediction.save();
                        console.log(`Updated prediction for merchant_id: ${merchant_id}`);
                    } else {
                        // Create a new prediction
                        const newPrediction = new Prediction({ merchant_id, delight_score });
                        await newPrediction.save();
                        console.log(`Created prediction for merchant_id: ${merchant_id}`);
                    }
                    // If the delight_score is below 0.4, call the createTicket route
                    if (delight_score < 0.4) {
                        try {
                            const ticketResponse = await axios.post('http://localhost:3001/api/tickets/create', {
                                merchant_id,
                                description: `${randomDescription}`,
                            });
                            console.log(`Ticket created for merchant_id: ${merchant_id}`, ticketResponse.data);
                        } catch (ticketError) {
                            if (ticketError.response && ticketError.response.data && ticketError.response.data.message) {
                                console.error(`Ticket creation failed for merchant_id: ${merchant_id} - ${ticketError.response.data.message}`);
                            } else {
                                console.error(`Error creating ticket for merchant_id: ${merchant_id}`, ticketError.message);
                            }
                        }
                    }
                } else {
                    console.error(`No delight_score returned for merchant_id: ${merchant_id}`);
                }
            } catch (err) {
                console.error(`Error processing merchant_id: ${merchant_id}`, err.message);
            }
        }

        console.log('Processing complete.');
    } catch (err) {
        console.error('Error fetching merchant data:', err.message);
    }
};
