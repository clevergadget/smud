import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import chatRoute from './routes/chat.js';
import introRoute from './routes/intro.js';

dotenv.config();

const app = express();


app.use((req, res, next) => {
  console.log('Incoming origin:', req.headers.origin);
  next();
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],  methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use('/api', chatRoute);
app.use('/api', introRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SMUD API running on port ${PORT}`);
});
