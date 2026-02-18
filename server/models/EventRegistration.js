const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EventRegistration = sequelize.define('EventRegistration', {
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
    event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'events', key: 'id' }
    },
    status: {
        type: DataTypes.ENUM('registered', 'attended', 'cancelled'),
        defaultValue: 'registered'
    }
}, {
    tableName: 'event_registrations',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['event_id'] },
        { unique: true, fields: ['user_id', 'event_id'] }
    ]
});

module.exports = EventRegistration;
