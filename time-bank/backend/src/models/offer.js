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

    static async findAll(filters = {}) {
        let queryText = `
            SELECT o.*, u.username, u.full_name, u.rating_average
            FROM offers o
            JOIN users u ON o.user_id = u.id
            WHERE o.status = 'open'
        `;
        const params = [];
        let paramCount = 1;

        if (filters.category) {
            queryText += ` AND o.category = $${paramCount}`;
            params.push(filters.category);
            paramCount++;
        }

        if (filters.type) {
            queryText += ` AND o.type = $${paramCount}`;
            params.push(filters.type);
            paramCount++;
        }

        if (filters.user_id) {
            queryText += ` AND o.user_id = $${paramCount}`;
            params.push(filters.user_id);
            paramCount++;
        }

        queryText += ` ORDER BY o.created_at DESC`;
        
        if (filters.limit) {
            queryText += ` LIMIT $${paramCount}`;
            params.push(filters.limit);
            paramCount++;
        }

        const result = await query(queryText, params);
        return result.rows;
    }

    static async updateStatus(id, status) {
        const result = await query(
            `UPDATE offers 
             SET status = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    }

    