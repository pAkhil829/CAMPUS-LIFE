export default function EmptyState({ icon = '📭', title, message, action, onAction }) {
    return (
        <div className="empty-state">
            <div className="empty-icon">{icon}</div>
            {title && <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>{title}</h3>}
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: action ? 16 : 0 }}>{message || 'Nothing to show here'}</p>
            {action && (
                <button className="btn btn-primary btn-sm" onClick={onAction}>{action}</button>
            )}
        </div>
    );
}
