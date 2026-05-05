const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const onboardingRoutes = require('./routes/onboarding');
const dashboardRoutes = require('./routes/dashboard');
const votesRoutes = require('./routes/votes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'AI Crypto Advisor API is running', health: '/api/health' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/votes', votesRoutes);

module.exports = app;
