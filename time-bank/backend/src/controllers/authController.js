const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { logger } = require('../utils/logger');
const { validationResult } = require('express-validator');

