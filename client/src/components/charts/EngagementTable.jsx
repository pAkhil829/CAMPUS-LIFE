export default function EngagementTable({ data = [], title, subtitle }) {
    if (data.length === 0) {
        return null;
    }

    return (
        <div className="glass-card-static">
            <div className="section-header">
                <div>
                    {title && <h3 className="section-title">{title}</h3>}
                    {subtitle && <p className="section-subtitle">{subtitle}</p>}
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                    <thead>
                        <tr style={{
                            fontSize: 11,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Event</th>
                            <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600 }}>Registrations</th>
                            <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600 }}>Attended</th>
                            <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600 }}>Cancelled</th>
                            <th style={{ textAlign: 'center', padding: '8px 12px', fontWeight: 600 }}>Fill Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((event, i) => (
                            <tr key={i} style={{
                                background: 'var(--bg-glass)',
                                transition: 'background 0.2s'
                            }}>
                                <td style={{ padding: '12px', borderRadius: '8px 0 0 8px', fontWeight: 600, fontSize: 13 }}>
                                    {event.title}
                                </td>
                                <td style={{ textAlign: 'center', padding: '12px', fontSize: 14 }}>
                                    {event.registrations}
                                </td>
                                <td style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#10b981' }}>
                                    {event.attended}
                                </td>
                                <td style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#ef4444' }}>
                                    {event.cancelled}
                                </td>
                                <td style={{ padding: '12px', borderRadius: '0 8px 8px 0', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                        <div style={{ flex: 1, maxWidth: 80, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${Math.min(event.fill_rate, 100)}%`,
                                                background: event.fill_rate > 75 ? 'var(--gradient-success)' :
                                                    event.fill_rate > 40 ? 'var(--gradient-accent)' : 'var(--gradient-warm)',
                                                borderRadius: 3,
                                                transition: 'width 0.5s ease'
                                            }} />
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 600, minWidth: 40 }}>
                                            {event.fill_rate}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
