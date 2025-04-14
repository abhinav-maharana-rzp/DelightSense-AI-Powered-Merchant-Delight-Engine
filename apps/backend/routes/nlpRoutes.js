import express from 'express';
import multer from 'multer';
import { handleNLPRequest } from '../controllers/nlpController.js';

const router = express.Router();
const upload = multer(); // In-memory file handler

/**
 * @swagger
 * tags:
 *   name: NLP
 *   description: GPT/Claude NLP services (sentiment, summarization, voice)

 * /api/nlp/{type}:
 *   post:
 *     summary: Process text or audio input using GPT/Claude
 *     tags: [NLP]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [sentiment, summary, voice]
 *         description: The type of NLP operation to perform
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   text:
 *                     type: string
 *                     description: Text to process
 *               - type: object
 *                 properties:
 *                   audio:
 *                     type: string
 *                     format: binary
 *                     description: Audio file for transcription and response
 *     responses:
 *       200:
 *         description: NLP result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 type: sentiment
 *                 result: Positive
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

router.post('/:type', upload.single('audio'), handleNLPRequest);

export default router;