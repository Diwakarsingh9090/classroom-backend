import express from 'express';
import cors from 'cors';
import subjectsRouter from './routes/subjects';

const app = express();
const PORT = 8000;

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

app.use('/api/subjects', subjectsRouter);

// Root GET route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Classroom Backend API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
