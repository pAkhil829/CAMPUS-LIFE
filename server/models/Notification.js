const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('critical', 'academic', 'event', 'hostel'),
        allowNull: false,
        defaultValue: 'academic'
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'general'
    },
    target_department: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    target_year: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    }
}, {
    tableName: 'notifications',
    indexes: [
        { fields: ['priority'] },
        { fields: ['target_department'] },
        { fields: ['target_year'] },
        { fields: ['expires_at'] },
        { fields: ['created_by'] }
    ]
});

module.exports = Notification;
