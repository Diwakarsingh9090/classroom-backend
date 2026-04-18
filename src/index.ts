import AgentAPI from 'apminsight';
AgentAPI.config()

import express from 'express';
import cors from 'cors';
import subjectsRouter from './routes/subjects.js';
import securityMiddleware from './middleware/security.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';

const app = express();
// 🔥 REQUIRED for Railway
app.set("trust proxy", 1);
const PORT = Number(process.env.PORT ?? 8000);
const HOST = process.env.HOST ?? '0.0.0.0';

//Cors configuration

if (!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL is required');
}

const LOCALHOST_ORIGIN_PATTERN = /^https?:\/\/localhost(:\d+)?$/;
const isDevelopment = process.env.NODE_ENV !== 'production';

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Postman, server-to-server)
        if (!origin) return callback(null, true);

        // Always allow the configured frontend URL
        if (origin === process.env.FRONTEND_URL) return callback(null, true);

        // Allow any localhost origin in development
        if (isDevelopment && LOCALHOST_ORIGIN_PATTERN.test(origin)) return callback(null, true);

        callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))


// Middleware
app.use(express.json());
// app.use(securityMiddleware)
app.all('/api/auth/{*splat}', toNodeHandler(auth));

app.use('/api/subjects', subjectsRouter);

// Root GET route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Classroom Backend API' });
});

// Start server
app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});
