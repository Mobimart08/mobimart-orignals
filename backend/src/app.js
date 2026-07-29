/* ==========================================================================
   src/app.js
   Express application factory.
   Configures all global middleware in the correct order, mounts routes,
   and registers the error handlers.

   This file exports the app — it does NOT call app.listen().
   server.js handles the actual server binding (separation of concerns).
   ========================================================================== */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';

import env from './config/env.js';
import { globalLimiter } from './middlewares/rateLimiter.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import apiRouter from './routes/index.js';

const app = express();

// Trust the reverse proxy (e.g., Render, Heroku, Nginx) to ensure req.ip and req.secure work correctly
app.set('trust proxy', 1);

/* ==========================================================================
   SECTION 1 — Security Headers (Helmet)
   Must be first — sets HTTP headers before anything else.
   ========================================================================== */
app.use(helmet());

/* ==========================================================================
   SECTION 2 — CORS
   Allows only the configured frontend origin.
   credentials: true is required for HttpOnly cookies (refresh token).
   ========================================================================== */
app.use(
  cors({
    origin: env.IS_PRODUCTION ? env.FRONTEND_URL : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* ==========================================================================
   SECTION 3 — Request Logging (Morgan)
   Development: compact colorized output.
   Production: Apache combined format for log aggregators.
   ========================================================================== */
app.use(morgan(env.IS_PRODUCTION ? 'combined' : 'dev'));

/* ==========================================================================
   SECTION 4 — Response Compression
   Gzip compresses responses larger than 1KB.
   Typically achieves 60–80% reduction on JSON list responses.
   ========================================================================== */
app.use(compression());

/* ==========================================================================
   SECTION 5 — Body Parsers
   ========================================================================== */
// Parse JSON bodies (Content-Type: application/json)
// Limit: 1mb for standard API payloads. Image uploads use multipart/form-data.
app.use(express.json({ limit: '1mb' }));

// Parse URL-encoded bodies (Content-Type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Parse cookies — required for reading the HttpOnly refresh token cookie
app.use(cookieParser());

/* ==========================================================================
   SECTION 6 — Input Sanitization
   Order matters: sanitize AFTER body parsing, BEFORE routes.
   ========================================================================== */

// NoSQL Injection Protection:
// Strips MongoDB operators ($, .) from req.body, req.params, req.query.
// Prevents attacks like: { "email": { "$gt": "" } }
app.use(mongoSanitize());

// XSS Protection:
// Custom middleware using the 'xss' package to escape HTML characters
// in all string values of the request body.
// Prevents stored XSS: <script>...</script> injected into DB fields.
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') return xss(obj);
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, val]) => [key, sanitize(val)])
      );
    }
    return obj;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitize(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitize(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitize(req.params);
  }
  
  next();
});

/* ==========================================================================
   SECTION 7 — Global Rate Limiting
   200 requests per minute per IP across all API routes.
   Specific route groups have stricter limits via route-level limiters.
   ========================================================================== */
app.use('/api', globalLimiter);

/* ==========================================================================
   SECTION 8 — API Routes
   All routes are versioned under /api/v1
   ========================================================================== */
app.use('/api/v1', apiRouter);

/* ==========================================================================
   SECTION 9 — Root Route
   Simple response for hitting the root URL.
   ========================================================================== */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome to MobiMart API`,
    version: 'v1',
    docs: `${env.APP_URL}/api/v1/health`,
  });
});

/* ==========================================================================
   SECTION 10 — Error Handlers
   Must be registered LAST — after all routes.
   ========================================================================== */

// 404 — Handles requests to routes that don't exist
app.use(notFoundMiddleware);

// Global error handler — catches all errors forwarded via next(err)
app.use(errorMiddleware);

export default app;
