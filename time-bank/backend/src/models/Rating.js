const { query } = require('../config/database');

class Rating {
    static async create(ratingData) {
        const { transaction_id, rater_id, rated_user_id, rating, comment } = ratingData;

        const existing = await query(
            'SELECT id FROM ratings WHERE transaction_id = $1 AND rater_id = $2',
            [transaction_id, rater_id]
        );

        if (existing.rows.length > 0) {
            throw new Error('You have already rated this transaction');
        }

        const result = await query(
            `INSERT INTO ratings (transaction_id, rater_id, rated_user_id, rating, comment)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [transaction_id, rater_id, rated_user_id, rating, comment]
        );

        