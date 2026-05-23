const express = require('express');
const cors = require('cors');
const path = require('path');
const candidateRoutes = require('./routes/candidateRoutes');
const jobRoutes = require('./routes/jobRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
  }
}));

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Intelligent Talent Matching Platform backend is running.'
  });
});

app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error.'
  });
});

module.exports = app;
