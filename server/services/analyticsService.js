const { QueryTypes } = require('sequelize');
const { sequelize, User, Notification, NotificationAck, Event, EventRegistration, ActivityLog } = require('../models');

class AnalyticsService {

    // ─── Campus Pulse Overview ─────────────────────────────
    async getCampusPulse() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalUsers, activeToday, totalNotifications, unreadNotifications, upcomingEvents] = await Promise.all([
            User.count(),
            ActivityLog.count({
                where: sequelize.where(
                    sequelize.fn('DATE', sequelize.col('created_at')),
                    sequelize.fn('DATE', new Date())
                )
            }),
            Notification.count(),
            sequelize.query(`
        SELECT COUNT(DISTINCT n.id) as count
        FROM notifications n
        LEFT JOIN notification_acknowledgements na ON n.id = na.notification_id
        WHERE na.acknowledged_at IS NULL
        AND (n.expires_at IS NULL OR n.expires_at > NOW())
      `, { type: QueryTypes.SELECT }),
            Event.count({ where: { event_date: { [require('sequelize').Op.gte]: new Date() } } })
        ]);

        return {
            total_users: totalUsers,
            active_today: activeToday,
            total_notifications: totalNotifications,
            unread_notifications: parseInt(unreadNotifications[0]?.count || 0),
            upcoming_events: upcomingEvents
        };
    }

    // ─── Heat Map: Department Engagement ───────────────────
    // Grid: departments × notification categories, value = ack rate
    async getDepartmentEngagement() {
        const data = await sequelize.query(`
      SELECT 
        u.department,
        n.category,
        COUNT(DISTINCT n.id) as total_notifications,
        COUNT(DISTINCT na.id) as acknowledged_count,
        ROUND(
          CASE WHEN COUNT(DISTINCT n.id) > 0 
          THEN (COUNT(DISTINCT na.id)::decimal / COUNT(DISTINCT n.id) * 100) 
          ELSE 0 END, 1
        ) as engagement_rate
      FROM users u
      CROSS JOIN notifications n
      LEFT JOIN notification_acknowledgements na 
        ON na.notification_id = n.id AND na.user_id = u.id AND na.acknowledged_at IS NOT NULL
      WHERE u.role = 'student'
        AND (n.target_department IS NULL OR n.target_department = u.department)
        AND (n.target_year IS NULL OR n.target_year = u.year)
      GROUP BY u.department, n.category
      ORDER BY u.department, n.category
    `, { type: QueryTypes.SELECT });

        return this.formatHeatMapData(data, 'department', 'category', 'engagement_rate');
    }

    // ─── Heat Map: Notification Response ───────────────────
    // Grid: departments × priority, value = avg response time (minutes)
    async getNotificationResponse() {
        const data = await sequelize.query(`
      SELECT 
        u.department,
        n.priority,
        ROUND(AVG(
          EXTRACT(EPOCH FROM (na.acknowledged_at - n.created_at)) / 60
        )::decimal, 1) as avg_response_minutes,
        COUNT(na.id) as response_count
      FROM notification_acknowledgements na
      JOIN users u ON u.id = na.user_id
      JOIN notifications n ON n.id = na.notification_id
      WHERE na.acknowledged_at IS NOT NULL
      GROUP BY u.department, n.priority
      ORDER BY u.department, n.priority
    `, { type: QueryTypes.SELECT });

        return this.formatHeatMapData(data, 'department', 'priority', 'avg_response_minutes');
    }

    // ─── Heat Map: Time-Based Activity ─────────────────────
    // Grid: 24 hours × 7 days, value = activity count
    async getTimeActivity() {
        const data = await sequelize.query(`
      SELECT 
        EXTRACT(DOW FROM created_at) as day_of_week,
        EXTRACT(HOUR FROM created_at) as hour_of_day,
        COUNT(*) as activity_count
      FROM activity_logs
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY day_of_week, hour_of_day
      ORDER BY day_of_week, hour_of_day
    `, { type: QueryTypes.SELECT });

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

        // Build full 7x24 matrix
        const matrix = [];
        for (let day = 0; day < 7; day++) {
            for (let hour = 0; hour < 24; hour++) {
                const match = data.find(d => parseInt(d.day_of_week) === day && parseInt(d.hour_of_day) === hour);
                matrix.push({
                    x: hours[hour],
                    y: dayNames[day],
                    value: match ? parseInt(match.activity_count) : 0
                });
            }
        }

        return {
            data: matrix,
            xLabels: hours,
            yLabels: dayNames,
            maxValue: Math.max(...matrix.map(m => m.value), 1)
        };
    }

    // ─── Heat Map: Event Engagement ────────────────────────
    // Grid: events × metrics
    async getEventEngagement() {
        const data = await sequelize.query(`
      SELECT 
        e.id,
        e.title,
        e.department,
        e.capacity,
        COUNT(er.id) FILTER (WHERE er.status = 'registered') as registrations,
        COUNT(er.id) FILTER (WHERE er.status = 'attended') as attended,
        COUNT(er.id) FILTER (WHERE er.status = 'cancelled') as cancelled,
        ROUND(
          CASE WHEN e.capacity > 0 
          THEN (COUNT(er.id) FILTER (WHERE er.status != 'cancelled')::decimal / e.capacity * 100)
          ELSE 0 END, 1
        ) as fill_rate
      FROM events e
      LEFT JOIN event_registrations er ON er.event_id = e.id
      GROUP BY e.id, e.title, e.department, e.capacity
      ORDER BY e.event_date DESC
      LIMIT 20
    `, { type: QueryTypes.SELECT });

        return data.map(row => ({
            ...row,
            registrations: parseInt(row.registrations),
            attended: parseInt(row.attended),
            cancelled: parseInt(row.cancelled),
            fill_rate: parseFloat(row.fill_rate)
        }));
    }

    // ─── Utility: Format data for heat map grids ──────────
    formatHeatMapData(data, rowKey, colKey, valueKey) {
        const rows = [...new Set(data.map(d => d[rowKey]))];
        const cols = [...new Set(data.map(d => d[colKey]))];

        const matrix = [];
        for (const row of rows) {
            for (const col of cols) {
                const match = data.find(d => d[rowKey] === row && d[colKey] === col);
                matrix.push({
                    x: col,
                    y: row,
                    value: match ? parseFloat(match[valueKey]) : 0
                });
            }
        }

        const maxValue = Math.max(...matrix.map(m => m.value), 1);

        return { data: matrix, xLabels: cols, yLabels: rows, maxValue };
    }
}

module.exports = new AnalyticsService();
