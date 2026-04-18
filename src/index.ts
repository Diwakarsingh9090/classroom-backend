import AgentAPI from 'apminsight';
AgentAPI.config()

import express from 'express';
import cors from 'cors';
import subjectsRouter from './routes/subjects.js';
// import securityMiddleware from './middleware/security.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';

const app = express();
// 🔥 REQUIRED for Railway
app.set("trust proxy", 1);
const PORT = 8000;


// if (!process.env.FRONTEND_URL) {
    //   throw new Error('FRONTEND_URL is required');
    // }
    
//Cors configuration
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware
// app.use(securityMiddleware)
app.all('/api/auth/{*splat}', toNodeHandler(auth));

app.use(express.json());

app.use('/api/subjects', subjectsRouter);

// Root GET route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
