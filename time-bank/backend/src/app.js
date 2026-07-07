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

