const { query } = require('../config/database');

class Offer {
    static async create(offerData) {
        const { 
            user_id, title, description, category, type, 
            credits_per_hour, location, is_remote, expires_at 
        } = offerData;

        const result = await query(
            `INSERT INTO offers 
             (user_id, title, description, category, type, credits_per_hour, location, is_remote, expires_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [user_id, title, description, category, type, credits_per_hour, location, is_remote, expires_at]
        );
        
        return result.rows[0];
    }

    static async findById(id) {
        const result = await query(
            `SELECT o.*, u.username, u.full_name, u.rating_average
             FROM offers o
             JOIN users u ON o.user_id = u.id
             WHERE o.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    