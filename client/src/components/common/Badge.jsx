export default function Badge({ count, variant = 'primary', dot = false, children }) {
    if (!count && count !== 0 && !dot) return children || null;

    const colors = {
        primary: { bg: '#6366f1', text: '#fff' },
        danger: { bg: '#ef4444', text: '#fff' },
        success: { bg: '#10b981', text: '#fff' },
        warning: { bg: '#f59e0b', text: '#fff' },
        muted: { bg: 'rgba(255,255,255,0.1)', text: 'var(--text-muted)' }
    };

    const c = colors[variant] || colors.primary;

    if (dot) {
        return (
            <div style={{ position: 'relative', display: 'inline-flex' }}>
                {children}
                <span style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: c.bg,
                    border: '2px solid var(--bg-primary)'
                }} />
            </div>
        );
    }

    if (children) {
        return (
            <div style={{ position: 'relative', display: 'inline-flex' }}>
                {children}
                <span style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    background: c.bg,
                    color: c.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '0 5px',
                    border: '2px solid var(--bg-primary)'
                }}>
                    {count > 99 ? '99+' : count}
                </span>
            </div>
        );
    }

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            background: c.bg,
            color: c.text,
            fontSize: 11,
            fontWeight: 700,
            padding: '0 6px'
        }}>
            {count > 99 ? '99+' : count}
        </span>
    );
}
