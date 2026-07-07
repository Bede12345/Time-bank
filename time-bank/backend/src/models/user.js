const { query } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(userData) {
        const { username, email, password, full_name, bio, skills } = userData;
        const password_hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));
        
        const result = await query(
            `INSERT INTO users (username, email, password_hash, full_name, bio, skills)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, username, email, full_name, bio, skills, time_credits, rating_average, created_at`,
            [username, email, password_hash, full_name, bio, skills || []]
        );
        
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    static async findByUsername(username) {
        const result = await query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    }

    