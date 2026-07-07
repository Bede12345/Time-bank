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

    static async findById(id) {
        const result = await query(
            `SELECT id, username, email, full_name, bio, skills, time_credits, 
                    rating_average, rating_count, is_active, created_at
             FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async updateCredits(userId, amount) {
        const result = await query(
            `UPDATE users 
             SET time_credits = time_credits + $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING time_credits`,
            [amount, userId]
        );
        return result.rows[0];
    }

    static async updateRating(userId, newRating) {
        const result = await query(
            `UPDATE users 
             SET rating_average = (
                 SELECT AVG(rating) 
                 FROM ratings 
                 WHERE rated_user_id = $1
             ),
             rating_count = rating_count + 1,
             updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING rating_average, rating_count`,
            [userId]
        );
        return result.rows[0];
    }

    static async getStats(userId) {
        const result = await query(
            `SELECT 
                (SELECT COUNT(*) FROM offers WHERE user_id = $1 AND type = 'offer') as offers_count,
                (SELECT COUNT(*) FROM offers WHERE user_id = $1 AND type = 'request') as requests_count,
                (SELECT COUNT(*) FROM transactions 
                 WHERE (requester_id = $1 OR provider_id = $1) 
                 AND status = 'completed') as completed_trades,
                (SELECT COALESCE(AVG(rating), 0) FROM ratings WHERE rated_user_id = $1) as rating_avg
             FROM users WHERE id = $1`,
            [userId]
        );
        return result.rows[0];
    }
}

module.exports = User;