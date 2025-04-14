import express from 'express';
import { predictDelight } from '../controllers/predictController.js';
import { verifyToken } from '../utils/jwt.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Predict
 *   description: Delight score prediction
 */

/**
 * @swagger
 * /api/predict:
 *   post:
 *     summary: Predict merchant delight score
 *     tags: [Predict]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchant_id:
 *                 type: string
 *                 description: Unique identifier for the merchant
 *               features:
 *                 type: object
 *                 description: Features used for prediction
 *                 properties:
 *                   avg_txn_value:
 *                     type: number
 *                     description: Average transaction value of the merchant
 *                   failed_txns_last_7d:
 *                     type: integer
 *                     description: Number of failed transactions in the last 7 days
 *                   support_tickets_last_30d:
 *                     type: integer
 *                     description: Number of support tickets raised in the last 30 days
 *                   csat_score:
 *                     type: number
 *                     description: Customer satisfaction score
 *                   settlement_delay_avg:
 *                     type: number
 *                     description: Average settlement delay in days
 *                   api_failure_rate:
 *                     type: number
 *                     description: API failure rate (percentage)
 *                   active_days_last_month:
 *                     type: integer
 *                     description: Number of active days the merchant had in the last month
 *     responses:
 *       200:
 *         description: Predicted delight score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 merchant_id:
 *                   type: string
 *                 delight_score:
 *                   type: number
 *       400:
 *         description: Bad request (Missing required fields or invalid data)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', predictDelight);

export default router;
