const { query } = require('../config/database');

class Transaction {
    static async create(transactionData) {
        const { 
            offer_id, requester_id, provider_id, credits_held, hours_estimated 
        } = transactionData;

        const result = await query(
            `INSERT INTO transactions 
             (offer_id, requester_id, provider_id, credits_held, hours_estimated, status)
             VALUES ($1, $2, $3, $4, $5, 'pending')
             RETURNING *`,
            [offer_id, requester_id, provider_id, credits_held, hours_estimated]
        );
        
        return result.rows[0];
    }

    static async findById(id) {
        const result = await query(
            `SELECT t.*, 
                    o.title as offer_title, o.type as offer_type,
                    r.username as requester_username, r.full_name as requester_name,
                    p.username as provider_username, p.full_name as provider_name
             FROM transactions t
             JOIN offers o ON t.offer_id = o.id
             JOIN users r ON t.requester_id = r.id
             JOIN users p ON t.provider_id = p.id
             WHERE t.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async findByUser(userId) {
        const result = await query(
            `SELECT t.*, 
                    o.title as offer_title, o.type as offer_type,
                    r.username as requester_username,
                    p.username as provider_username
             FROM transactions t
             JOIN offers o ON t.offer_id = o.id
             JOIN users r ON t.requester_id = r.id
             JOIN users p ON t.provider_id = p.id
             WHERE t.requester_id = $1 OR t.provider_id = $1
             ORDER BY t.created_at DESC`,
            [userId]
        );
        return result.rows;
    }

    