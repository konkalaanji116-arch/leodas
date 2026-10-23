import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory backend database for quizzes and attempts
interface ServerQuiz {
  id: string;
  creatorName: string;
  title: string;
  createdAt: number;
  questions: any[];
}

interface ServerAttempt {
  id: string;
  quizId: string;
  friendName: string;
  score: number;
  total: number;
  answers: any[];
  completedAt: number;
}

const quizzesDb = new Map<string, ServerQuiz>();
const attemptsDb: ServerAttempt[] = [];

// Seed starter data so backend has ready quizzes
quizzesDb.set('starter-thalapathy', {
  id: 'starter-thalapathy',
  creatorName: 'Vijay Thalapathy Fan',
  title: 'Thalapathy & Puppy 2-Option Challenge 👑🐾',
  createdAt: Date.now(),
  questions: [
    {
      id: 'q1',
      question: 'Which drink kicks off the day better?',
      optionA: 'Masala Chai ☕',
      optionB: 'Filter Coffee ☕',
      correctOption: 0
    },
    {
      id: 'q2',
      question: 'Favorite movie vibe?',
      optionA: 'Raw Mass (Leo / Master) 🕶️🔥',
      optionB: 'Feel-Good (Nanban / Ghilli) 🕺🎉',
      correctOption: 0
    }
  ]
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'connected',
    service: 'Thalapathy Vijay Fan Club & Quiz Backend',
    version: '1.0.0',
    totalQuizzes: quizzesDb.size,
    totalAttempts: attemptsDb.length,
    timestamp: new Date().toISOString()
  });
});

// Get all quizzes
app.get('/api/quizzes', (req, res) => {
  res.json(Array.from(quizzesDb.values()));
});

// Get quiz by id
app.get('/api/quizzes/:id', (req, res) => {
  const quiz = quizzesDb.get(req.params.id);
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }
  res.json(quiz);
});

// Save or update quiz
app.post('/api/quizzes', (req, res) => {
  const quiz: ServerQuiz = req.body;
  if (!quiz || !quiz.id || !quiz.creatorName || !Array.isArray(quiz.questions)) {
    return res.status(400).json({ error: 'Invalid quiz payload' });
  }
  quizzesDb.set(quiz.id, quiz);
  res.status(201).json({ success: true, quiz });
});

// Get attempts for a quiz
app.get('/api/attempts', (req, res) => {
  const { quizId } = req.query;
  if (quizId && typeof quizId === 'string') {
    return res.json(attemptsDb.filter(a => a.quizId === quizId));
  }
  res.json(attemptsDb);
});

// Submit friend attempt
app.post('/api/attempts', (req, res) => {
  const attempt: ServerAttempt = req.body;
  if (!attempt || !attempt.quizId || !attempt.friendName) {
    return res.status(400).json({ error: 'Invalid attempt data' });
  }
  attemptsDb.unshift(attempt);
  res.status(201).json({ success: true, attempt });
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend Express server listening on port ${PORT}`);
  });
}

startServer();
