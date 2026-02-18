export default function StatCard({ icon, iconBg, value, label, trend, trendUp, onClick }) {
    return (
        <div className="stat-card" onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
            {icon && (
                <div className="stat-icon" style={{ background: iconBg || 'rgba(99,102,241,0.12)' }}>
                    {icon}
                </div>
            )}
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
            {trend !== undefined && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: trendUp ? '#10b981' : '#ef4444'
                }}>
                    <span>{trendUp ? '↑' : '↓'}</span>
                    <span>{trend}%</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs last week</span>
                </div>
            )}
        </div>
    );
}
