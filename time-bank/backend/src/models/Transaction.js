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

    static async updateStatus(id, status) {
        const result = await query(
            `UPDATE transactions 
             SET status = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    }

    static async confirmCompletion(id, userId) {
        // Check if user is part of the transaction
        const transaction = await this.findById(id);
        if (!transaction) return null;

        let field;
        if (transaction.requester_id === userId) {
            field = 'requester_confirmed';
        } else if (transaction.provider_id === userId) {
            field = 'provider_confirmed';
        } else {
            return null;
        }

        const result = await query(
            `UPDATE transactions 
             SET ${field} = true, updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        const updated = result.rows[0];
        
        // Check if both confirmed, complete the transaction
        if (updated.requester_confirmed && updated.provider_confirmed) {
            await this.completeTransaction(id);
        }

        return updated;
    }

    static async completeTransaction(id) {
        // Release credits and update status
        const result = await query(
            `UPDATE transactions 
             SET status = 'completed', 
                 completion_date = CURRENT_TIMESTAMP,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        const transaction = result.rows[0];
        
        // Transfer credits to provider
        await query(
            `UPDATE users 
             SET time_credits = time_credits + $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [transaction.credits_held, transaction.provider_id]
        );

        return transaction;
    }

    static async getStats() {
        const result = await query(
            `SELECT 
                COUNT(*) as total_transactions,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
                SUM(credits_held) as total_credits_held
             FROM transactions`
        );
        return result.rows[0];
    }
}

module.exports = Transaction;