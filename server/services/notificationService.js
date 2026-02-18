const { Op } = require('sequelize');
const { Notification, NotificationAck, User, ActivityLog } = require('../models');

class NotificationService {
    async create({ title, message, priority, category, target_department, target_year, expires_at, created_by }) {
        const notification = await Notification.create({
            title, message, priority, category,
            target_department, target_year, expires_at, created_by
        });

        await ActivityLog.create({
            user_id: created_by,
            action: 'notification_created',
            metadata: { notification_id: notification.id, priority, category, target_department, target_year }
        });

        return notification;
    }

    async getForUser(user) {
        const where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { target_department: null, target_year: null },
                        { target_department: user.department, target_year: null },
                        { target_department: null, target_year: user.year },
                        { target_department: user.department, target_year: user.year }
                    ]
                },
                {
                    [Op.or]: [
                        { expires_at: null },
                        { expires_at: { [Op.gt]: new Date() } }
                    ]
                }
            ]
        };

        const notifications = await Notification.findAll({
            where,
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'role', 'department'] },
                {
                    model: NotificationAck, as: 'acknowledgements',
                    where: { user_id: user.id },
                    required: false
                }
            ],
            order: [
                [this.priorityOrder(), 'ASC'],
                ['created_at', 'DESC']
            ],
            limit: 50
        });

        return notifications;
    }

    async acknowledge(notificationId, userId) {
        const [ack, created] = await NotificationAck.findOrCreate({
            where: { user_id: userId, notification_id: notificationId },
            defaults: { read_at: new Date(), acknowledged_at: new Date() }
        });

        if (!created && !ack.acknowledged_at) {
            ack.acknowledged_at = new Date();
            await ack.save();
        }

        await ActivityLog.create({
            user_id: userId,
            action: 'notification_acknowledged',
            metadata: { notification_id: notificationId }
        });

        return ack;
    }

    async markRead(notificationId, userId) {
        const [ack, created] = await NotificationAck.findOrCreate({
            where: { user_id: userId, notification_id: notificationId },
            defaults: { read_at: new Date() }
        });

        if (!created && !ack.read_at) {
            ack.read_at = new Date();
            await ack.save();
        }

        return ack;
    }

    async getStats(notificationId) {
        const notification = await Notification.findByPk(notificationId);
        if (!notification) return null;

        const targetWhere = {};
        if (notification.target_department) targetWhere.department = notification.target_department;
        if (notification.target_year) targetWhere.year = notification.target_year;

        const totalTargeted = await User.count({ where: { ...targetWhere, role: 'student' } });
        const readCount = await NotificationAck.count({
            where: { notification_id: notificationId, read_at: { [Op.not]: null } }
        });
        const ackCount = await NotificationAck.count({
            where: { notification_id: notificationId, acknowledged_at: { [Op.not]: null } }
        });

        return {
            notification_id: notificationId,
            total_targeted: totalTargeted,
            read_count: readCount,
            acknowledged_count: ackCount,
            read_rate: totalTargeted ? (readCount / totalTargeted * 100).toFixed(1) : 0,
            ack_rate: totalTargeted ? (ackCount / totalTargeted * 100).toFixed(1) : 0
        };
    }

    async getCreatedBy(userId) {
        return Notification.findAll({
            where: { created_by: userId },
            include: [
                { model: NotificationAck, as: 'acknowledgements' }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    priorityOrder() {
        return Notification.sequelize.literal(
            `CASE WHEN "Notification"."priority" = 'critical' THEN 0 ` +
            `WHEN "Notification"."priority" = 'academic' THEN 1 ` +
            `WHEN "Notification"."priority" = 'event' THEN 2 ` +
            `WHEN "Notification"."priority" = 'hostel' THEN 3 END`
        );
    }
}

module.exports = new NotificationService();
