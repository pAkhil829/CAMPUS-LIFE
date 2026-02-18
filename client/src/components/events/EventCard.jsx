import { Calendar, MapPin, Users } from 'lucide-react';

const CATEGORY_GRADIENTS = {
    cultural: 'var(--gradient-warm)',
    sports: 'var(--gradient-success)',
    placement: 'var(--gradient-accent)',
    academic: 'var(--gradient-primary)',
    general: 'var(--gradient-primary)'
};

export default function EventCard({
    event,
    onRsvp,
    canRsvp = false,
    showDept = true,
    dimPast = true
}) {
    const {
        id, title, description, event_date, location, category,
        capacity, registration_count, department, userRegistered, spots_left
    } = event;

    const isPast = dimPast && new Date(event_date) < new Date();
    const isFull = spots_left !== null && spots_left !== undefined && spots_left <= 0;
    const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.general;
    const date = new Date(event_date);

    return (
        <div className="event-card" style={isPast ? { opacity: 0.55, filter: 'saturate(0.5)' } : {}}>
            {/* Color Banner */}
            <div className="event-banner" style={{ background: gradient }}>
                <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {category}
                </div>
            </div>

            <div className="event-body">
                {/* Title */}
                <div className="event-title">{title}</div>

                {/* Description */}
                {description && (
                    <div className="event-desc">
                        {description.length > 100 ? description.substring(0, 100) + '...' : description}
                    </div>
                )}

                {/* Details */}
                <div className="event-details">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} />
                        {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={12} /> {location}
                        </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users size={12} />
                        {registration_count || 0}{capacity ? ` / ${capacity}` : ''} registered
                    </span>
                </div>

                {/* Capacity bar */}
                {capacity && (
                    <div style={{ marginTop: 6 }}>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                            <div style={{
                                height: '100%',
                                width: `${Math.min(((registration_count || 0) / capacity) * 100, 100)}%`,
                                background: isFull ? 'var(--gradient-warm)' : 'var(--gradient-success)',
                                borderRadius: 2,
                                transition: 'width 0.4s ease'
                            }} />
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="event-footer">
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {showDept && department && (
                            <span className="priority-tag priority-academic">{department}</span>
                        )}
                        {isPast && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Past Event</span>}
                    </div>

                    {canRsvp && !isPast && (
                        <button
                            className={`btn btn-sm ${userRegistered ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => !userRegistered && onRsvp?.(id)}
                            disabled={userRegistered || isFull}
                        >
                            {userRegistered ? '✓ Registered' : isFull ? 'Full' : 'RSVP'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export { CATEGORY_GRADIENTS };
