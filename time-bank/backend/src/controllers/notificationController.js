const Notification = require('../models/Notification');
const { logger } = require('../utils/logger');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findByUser(req.userId);
        res.json({ success: true, count: notifications.length, notifications });
    } catch (error) {
        logger.error('Get notifications error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const notifications = await Notification.findUnread(req.userId);
        res.json({ success: true, count: notifications.length });
    } catch (error) {
        logger.error('Get unread count error:', error);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.markAsRead(req.params.id, req.userId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json({ success: true, notification });
    } catch (error) {
        logger.error('Mark as read error:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const notifications = await Notification.markAllAsRead(req.userId);
        res.json({ success: true, count: notifications.length, message: 'All notifications marked as read' });
    } catch (error) {
        logger.error('Mark all as read error:', error);
        res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.delete(req.params.id, req.userId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        logger.error('Delete notification error:', error);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};
