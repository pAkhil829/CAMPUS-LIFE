const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActivityLog = sequelize.define('ActivityLog', {
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
    action: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {}
    }
}, {
    tableName: 'activity_logs',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['action'] },
        { fields: ['created_at'] }
    ]
});

module.exports = ActivityLog;
