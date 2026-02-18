const notificationService = require('../services/notificationService');

const create = async (req, res, next) => {
    try {
        const { title, message, priority, category, target_department, target_year, expires_at } = req.body;

        if (!title || !message) {
            return res.status(400).json({ error: 'Title and message are required.' });
        }

        const notification = await notificationService.create({
            title, message, priority, category,
            target_department, target_year, expires_at,
            created_by: req.user.id
        });

        // Emit via socket if available
        if (req.app.get('io')) {
            const io = req.app.get('io');
            const room = target_department || 'all';
            io.to(room).emit('new_notification', notification);
        }

        res.status(201).json(notification);
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const notifications = await notificationService.getForUser(req.user);
        res.json({ notifications });
    } catch (error) {
        next(error);
    }
};

const acknowledge = async (req, res, next) => {
    try {
        const ack = await notificationService.acknowledge(req.params.id, req.user.id);
        res.json({ acknowledgement: ack });
    } catch (error) {
        next(error);
    }
};

const markRead = async (req, res, next) => {
    try {
        const ack = await notificationService.markRead(req.params.id, req.user.id);
        res.json({ acknowledgement: ack });
    } catch (error) {
        next(error);
    }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await notificationService.getStats(req.params.id);
        if (!stats) return res.status(404).json({ error: 'Notification not found.' });
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

const getMyCreated = async (req, res, next) => {
    try {
        const notifications = await notificationService.getCreatedBy(req.user.id);
        res.json({ notifications });
    } catch (error) {
        next(error);
    }
};

module.exports = { create, getAll, acknowledge, markRead, getStats, getMyCreated };
