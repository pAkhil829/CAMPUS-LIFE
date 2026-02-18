export default function ProgressBar({
    value = 0,
    max = 100,
    height = 6,
    gradient = 'var(--gradient-primary)',
    showLabel = false,
    label,
    animated = true
}) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

    return (
        <div>
            {(showLabel || label) && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    marginBottom: 4,
                    color: 'var(--text-muted)'
                }}>
                    <span>{label || ''}</span>
                    <span style={{ fontWeight: 600 }}>{Math.round(pct)}%</span>
                </div>
            )}
            <div style={{
                height,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: height / 2,
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: gradient,
                    borderRadius: height / 2,
                    transition: animated ? 'width 0.5s ease' : 'none'
                }} />
            </div>
        </div>
    );
}
