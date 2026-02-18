export default function PageHeader({ icon, title, subtitle, gradient, children }) {
    return (
        <div
            className="glass-card-static"
            style={{
                marginBottom: 24,
                background: gradient || 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {icon && (
                        <div style={{
                            width: 44,
                            height: 44,
                            background: 'var(--gradient-primary)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {icon}
                        </div>
                    )}
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 800 }}>{title}</h2>
                        {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>{subtitle}</p>}
                    </div>
                </div>
                {children && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{children}</div>}
            </div>
        </div>
    );
}
