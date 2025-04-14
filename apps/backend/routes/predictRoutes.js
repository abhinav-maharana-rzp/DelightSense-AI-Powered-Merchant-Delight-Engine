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
 *             example:
 *               txn_volume: 12000
 *               avg_resolution_time: 4.2
 *               complaint_count: 2
 *               nps_score: 8
 *               support_interactions: 3
 *               last_login_days: 7
 *     responses:
 *       200:
 *         description: Predicted delight score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, predictDelight);

export default router;
