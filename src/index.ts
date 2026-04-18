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

app.use(cors({
    origin: process.env.FRONTEND_URL,
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
