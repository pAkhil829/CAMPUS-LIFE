import { useState } from 'react';
import NotificationCard from './NotificationCard';
import EmptyState from '../common/EmptyState';

const PRIORITY_FILTERS = [
    { id: 'all', label: '📋 All' },
    { id: 'critical', label: '🚨 Critical' },
    { id: 'academic', label: '📚 Academic' },
    { id: 'event', label: '🎉 Event' },
    { id: 'hostel', label: '🏠 Hostel' }
];

export default function NotificationFeed({
    notifications = [],
    onAcknowledge,
    onRead,
    showStats = false,
    showFilter = true,
    maxItems = 0,
    compact = false,
    emptyIcon = '📭',
    emptyMessage = 'No notifications found'
}) {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all'
        ? notifications
        : notifications.filter(n => n.priority === filter);

    const display = maxItems > 0 ? filtered.slice(0, maxItems) : filtered;

    return (
        <div>
            {showFilter && (
                <div className="tabs" style={{ marginBottom: 16 }}>
                    {PRIORITY_FILTERS.map(f => (
                        <button
                            key={f.id}
                            className={`tab-btn ${filter === f.id ? 'active' : ''}`}
                            onClick={() => setFilter(f.id)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            )}

            {display.length === 0 ? (
                <EmptyState icon={emptyIcon} message={emptyMessage} />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {display.map(n => (
                        <NotificationCard
                            key={n.id}
                            notification={n}
                            onAcknowledge={onAcknowledge}
                            onRead={onRead}
                            showStats={showStats}
                            compact={compact}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
