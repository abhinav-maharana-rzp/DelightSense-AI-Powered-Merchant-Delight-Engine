import express from 'express';
import cors from 'cors';
import './db.js'; // MongoDB connection

import authRoutes from './routes/authRoutes.js';
import predictRoutes from './routes/predictRoutes.js';
import triggerRoutes from './routes/triggerRoutes.js';
import nlpRoutes from './routes/nlpRoutes.js';

// Swagger Setup
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());

// ====== ROUTES ======
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/trigger', triggerRoutes);
app.use('/api/nlp', nlpRoutes);

// ====== SWAGGER CONFIG ======
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DelightSense API',
      version: '1.0.0',
      description: 'Merchant Delight Engine API for prediction, NLP & triggers'
    },
    servers: [
      {
        url: 'http://localhost:3001'
      }
    ]
  },
  apis: ['./routes/*.js'] // Auto-docs from route comments
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.get('/', (req, res) => {
    res.send('🎯 Merchant Delight Backend is running. Visit /api-docs for Swagger UI.');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ====== START SERVER ======
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`📘 Swagger docs available at http://localhost:${PORT}/api-docs`);
});