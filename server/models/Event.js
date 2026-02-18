const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    event_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING(50),
        defaultValue: 'general'
    },
    department: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    }
}, {
    tableName: 'events',
    indexes: [
        { fields: ['event_date'] },
        { fields: ['department'] },
        { fields: ['created_by'] }
    ]
});

module.exports = Event;
