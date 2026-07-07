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

    