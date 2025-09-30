import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { stream as morganStream } from './config/logger.js';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({ origin: '*', credentials: true }));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization removed to avoid Express query getter conflict

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);

// HTTP logging
app.use(morgan('combined', { stream: morganStream }));

// Swagger setup (basic, will refine in docs task)
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Project API', version: '1.0.0' },
    servers: [{ url: '/api' }],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js', './src/models/*.js'],
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', routes);

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;


