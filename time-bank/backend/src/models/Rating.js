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

        await this.updateUserRating(rated_user_id);

        return result.rows[0];
    }

    static async updateUserRating(userId) {
        const result = await query(
            `UPDATE users 
             SET rating_average = (
                 SELECT COALESCE(AVG(rating), 0)
                 FROM ratings
                 WHERE rated_user_id = $1
             ),
             rating_count = (
                 SELECT COUNT(*)
                 FROM ratings
                 WHERE rated_user_id = $1
             ),
             updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING rating_average, rating_count`,
            [userId]
        );
        return result.rows[0];
    }

    static async findByUser(userId) {
        const result = await query(
            `SELECT r.*, 
                    t.offer_id, o.title as offer_title,
                    u.username as rater_username, u.full_name as rater_name
             FROM ratings r
             JOIN transactions t ON r.transaction_id = t.id
             JOIN offers o ON t.offer_id = o.id
             JOIN users u ON r.rater_id = u.id
             WHERE r.rated_user_id = $1
             ORDER BY r.created_at DESC`,
            [userId]
        );
        return result.rows;
    }

    static async findByTransaction(transactionId) {
        const result = await query(
            `SELECT r.*, 
                    u.username as rater_username, u.full_name as rater_name
             FROM ratings r
             JOIN users u ON r.rater_id = u.id
             WHERE r.transaction_id = $1
             ORDER BY r.created_at DESC`,
            [transactionId]
        );
        return result.rows;
    }

    static async getAverage(userId) {
        const result = await query(
            `SELECT COALESCE(AVG(rating), 0) as average, 
                    COUNT(*) as total
             FROM ratings
             WHERE rated_user_id = $1`,
            [userId]
        );
        return result.rows[0];
    }

    static async delete(ratingId, userId) {

        const result = await query(
            'DELETE FROM ratings WHERE id = $1 AND rater_id = $2 RETURNING *',
            [ratingId, userId]
        );
        
        if (result.rows.length > 0) {

            const rating = result.rows[0];
            await this.updateUserRating(rating.rated_user_id);
        }
        
        return result.rows[0];
    }
}

module.exports = Rating;