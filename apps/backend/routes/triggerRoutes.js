import express from 'express';
import { verifyToken } from '../utils/jwt.js';
import { getRecentTriggers, triggerDelightAction } from '../controllers/triggerController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trigger
 *   description: Trigger email or webhook actions based on delight score
 */

/**
 * @swagger
 * /api/trigger:
 *   post:
 *     summary: Trigger delight action (email/webhook) based on merchant score
 *     tags: [Trigger]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               merchantId: "M12345"
 *               score: 8.7
 *               action: "email"
 *               email: "merchant@example.com"
 *     responses:
 *       200:
 *         description: Trigger action successfully sent
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, triggerDelightAction);

/**
 * @swagger
 * /api/trigger/recent:
 *   get:
 *     summary: Check if there are recent triggers
 *     tags: [Trigger]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent trigger status
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get('/recent', getRecentTriggers);

export default router;
