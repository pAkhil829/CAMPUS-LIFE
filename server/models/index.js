const sequelize = require('../config/database');
const User = require('./User');
const Notification = require('./Notification');
const NotificationAck = require('./NotificationAck');
const Event = require('./Event');
const EventRegistration = require('./EventRegistration');
const ActivityLog = require('./ActivityLog');

// ─── Associations ──────────────────────────────────────

// User → Notifications (created by)
User.hasMany(Notification, { foreignKey: 'created_by', as: 'createdNotifications' });
Notification.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// User → NotificationAck
User.hasMany(NotificationAck, { foreignKey: 'user_id', as: 'acknowledgements' });
NotificationAck.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Notification → NotificationAck
Notification.hasMany(NotificationAck, { foreignKey: 'notification_id', as: 'acknowledgements' });
NotificationAck.belongsTo(Notification, { foreignKey: 'notification_id', as: 'notification' });

// User → Events (created by)
User.hasMany(Event, { foreignKey: 'created_by', as: 'createdEvents' });
Event.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// User → EventRegistration
User.hasMany(EventRegistration, { foreignKey: 'user_id', as: 'registrations' });
EventRegistration.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Event → EventRegistration
Event.hasMany(EventRegistration, { foreignKey: 'event_id', as: 'registrations' });
EventRegistration.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

// User → ActivityLog
User.hasMany(ActivityLog, { foreignKey: 'user_id', as: 'activityLogs' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
    sequelize,
    User,
    Notification,
    NotificationAck,
    Event,
    EventRegistration,
    ActivityLog
};
