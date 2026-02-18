import { AlertTriangle, BookOpen, Calendar, Home, CheckCircle } from 'lucide-react';

const priorityConfig = {
    critical: {
        icon: <AlertTriangle size={18} />,
        color: 'var(--priority-critical)',
        bg: 'rgba(239, 68, 68, 0.04)',
        label: '🚨 Critical'
    },
    academic: {
        icon: <BookOpen size={18} />,
        color: 'var(--priority-academic)',
        bg: 'transparent',
        label: '📚 Academic'
    },
    event: {
        icon: <Calendar size={18} />,
        color: 'var(--priority-event)',
        bg: 'transparent',
        label: '🎉 Event'
    },
    hostel: {
        icon: <Home size={18} />,
        color: 'var(--priority-hostel)',
        bg: 'transparent',
        label: '🏠 Hostel'
    }
};

export default function NotificationCard({
    notification,
    onAcknowledge,
    onRead,
    showStats = false,
    compact = false
}) {
    const { id, title, message, priority, category, creator, created_at, acknowledgements, target_department } = notification;
    const config = priorityConfig[priority] || priorityConfig.academic;
    const isAcked = acknowledgements?.[0]?.acknowledged_at;
    const isRead = acknowledgements?.[0]?.read_at;

    const handleClick = () => {
        if (!isAcked && onAcknowledge) onAcknowledge(id);
        else if (!isRead && onRead) onRead(id);
    };

    // Stats mode — for staff/admin viewing their created notifications
    const ackCount = showStats ? (acknowledgements?.filter(a => a.acknowledged_at)?.length || 0) : 0;
    const readCount = showStats ? (acknowledgements?.filter(a => a.read_at)?.length || 0) : 0;
    const totalReach = showStats ? (acknowledgements?.length || 0) : 0;

    return (
        <div
            className={`notification-card ${!isRead ? 'unread' : ''} ${priority === 'critical' && !isAcked ? 'priority-critical-border' : ''}`}
            onClick={handleClick}
            style={{ background: priority === 'critical' && !isAcked ? config.bg : undefined }}
        >
            {/* Priority Icon */}
            <div style={{ color: config.color, flexShrink: 0, marginTop: 2 }}>
                {config.icon}
            </div>

            {/* Content */}
            <div className="notif-content" style={{ flex: 1 }}>
                <div className="notif-title">{title}</div>
                {!compact && <div className="notif-message">{message?.substring(0, 160)}{message?.length > 160 ? '...' : ''}</div>}

                <div className="notif-meta">
                    <span className={`priority-tag priority-${priority}`}>{priority}</span>
                    {category && category !== 'general' && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{category}</span>
                    )}
                    {creator?.name && <span>by {creator.name}</span>}
                    <span>{new Date(created_at).toLocaleDateString()}</span>
                    {target_department && <span>📎 {target_department}</span>}
                    {isAcked && (
                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <CheckCircle size={12} /> Acknowledged
                        </span>
                    )}
                </div>

                {/* Stats row for staff/admin */}
                {showStats && (
                    <div style={{ marginTop: 8 }}>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                            <span>👁 {readCount} reads</span>
                            <span>✅ {ackCount} acknowledged</span>
                            <span>📨 {totalReach} reached</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                            <div style={{
                                height: '100%',
                                width: `${totalReach > 0 ? (ackCount / totalReach * 100) : 0}%`,
                                background: 'var(--gradient-success)',
                                borderRadius: 2,
                                transition: 'width 0.5s ease'
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Acknowledge Button */}
            {!showStats && !isAcked && onAcknowledge && (
                <button
                    className="btn btn-sm btn-primary"
                    style={{ flexShrink: 0, alignSelf: 'center' }}
                    onClick={(e) => { e.stopPropagation(); onAcknowledge(id); }}
                >
                    <CheckCircle size={14} /> Ack
                </button>
            )}
        </div>
    );
}

export { priorityConfig };
