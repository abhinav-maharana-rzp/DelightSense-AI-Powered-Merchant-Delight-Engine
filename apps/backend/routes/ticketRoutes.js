import express from 'express';
import {createTicket, getTicketsByMerchantId} from '../controllers/ticketController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management routes
 */

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - merchant_id
 *               - description
 *             properties:
 *               merchant_id:
 *                 type: string
 *                 example: merchant123
 *               description:
 *                 type: string
 *                 example: "Issue with payment processing"
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/create', createTicket);
router.get('/get/:merchant_id',getTicketsByMerchantId);

export default router;