const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NotificationAck = sequelize.define('NotificationAck', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    notification_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'notifications', key: 'id' }
    },
    read_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    acknowledged_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'notification_acknowledgements',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['notification_id'] },
        { unique: true, fields: ['user_id', 'notification_id'] }
    ]
});

module.exports = NotificationAck;
