require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { requestLogger } = require('./utils/logger');

const authRoutes = require('./routes/authRoutes');
const offerRoutes = require('./routes/offerRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;