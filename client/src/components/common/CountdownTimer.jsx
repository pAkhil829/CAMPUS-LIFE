import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate, size = 'md' }) {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const update = () => {
            const diff = new Date(targetDate) - new Date();
            if (diff <= 0) {
                setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setExpired(true);
                return;
            }
            setExpired(false);
            setTime({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000)
            });
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const units = [
        { value: time.days, label: 'Days' },
        { value: time.hours, label: 'Hrs' },
        { value: time.minutes, label: 'Min' },
        { value: time.seconds, label: 'Sec' }
    ];

    const sizeStyles = {
        sm: { padding: '4px 8px', fontSize: 14, labelSize: 8, minWidth: 40, gap: 4 },
        md: { padding: '8px 12px', fontSize: 22, labelSize: 9, minWidth: 56, gap: 8 },
        lg: { padding: '12px 16px', fontSize: 30, labelSize: 10, minWidth: 70, gap: 10 }
    };

    const s = sizeStyles[size] || sizeStyles.md;

    return (
        <div className="countdown" style={{ gap: s.gap, opacity: expired ? 0.4 : 1 }}>
            {units.map(({ value, label }) => (
                <div className="countdown-unit" key={label} style={{ padding: s.padding, minWidth: s.minWidth }}>
                    <span className="countdown-value" style={{ fontSize: s.fontSize }}>
                        {String(value).padStart(2, '0')}
                    </span>
                    <span className="countdown-label" style={{ fontSize: s.labelSize }}>{label}</span>
                </div>
            ))}
            {expired && (
                <span style={{ fontSize: 12, color: 'var(--priority-critical)', fontWeight: 600, marginLeft: 4 }}>
                    EXPIRED
                </span>
            )}
        </div>
    );
}
