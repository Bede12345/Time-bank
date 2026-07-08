const { query } = require('../config/database');

class Notification {
    static async create(data) {
        const { user_id, type, message, link } = data;
        const result = await query(
            'INSERT INTO notifications (user_id, type, message, link) VALUES (, , , ) RETURNING *',
            [user_id, type, message, link]
        );
        return result.rows[0];
    }

    static async findByUser(userId) {
        const result = await query(
            'SELECT * FROM notifications WHERE user_id =  ORDER BY created_at DESC',
            [userId]
        );
        return result.rows;
    }

    static async findUnread(userId) {
        const result = await query(
            'SELECT * FROM notifications WHERE user_id =  AND is_read = false ORDER BY created_at DESC',
            [userId]
        );
        return result.rows;
    }

    static async markAsRead(id, userId) {
        const result = await query(
            'UPDATE notifications SET is_read = true WHERE id =  AND user_id =  RETURNING *',
            [id, userId]
        );
        return result.rows[0];
    }

    static async markAllAsRead(userId) {
        const result = await query(
            'UPDATE notifications SET is_read = true WHERE user_id =  AND is_read = false RETURNING *',
            [userId]
        );
        return result.rows;
    }

    static async delete(id, userId) {
        const result = await query(
            'DELETE FROM notifications WHERE id =  AND user_id =  RETURNING *',
            [id, userId]
        );
        return result.rows[0];
    }
}

module.exports = Notification;
