import { useState, useRef } from 'react';
import EmptyState from '../common/EmptyState';

const COLOR_SCHEMES = {
    purple: { low: [26, 32, 53], high: [99, 102, 241] },
    cyan: { low: [26, 32, 53], high: [6, 182, 212] },
    warm: { low: [26, 32, 53], high: [245, 158, 11] },
    green: { low: [26, 32, 53], high: [16, 185, 129] },
    red: { low: [26, 32, 53], high: [239, 68, 68] }
};

function interpolateColor(value, maxValue, scheme) {
    const ratio = maxValue > 0 ? Math.min(value / maxValue, 1) : 0;
    const r = Math.round(scheme.low[0] + (scheme.high[0] - scheme.low[0]) * ratio);
    const g = Math.round(scheme.low[1] + (scheme.high[1] - scheme.low[1]) * ratio);
    const b = Math.round(scheme.low[2] + (scheme.high[2] - scheme.low[2]) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
}

export default function HeatMap({
    title,
    subtitle,
    data,
    xLabels,
    yLabels,
    maxValue,
    valueLabel = 'Value',
    colorScheme = 'purple',
    cellSize = 36,
    showLegend = true
}) {
    const [tooltip, setTooltip] = useState(null);
    const containerRef = useRef(null);

    const scheme = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.purple;

    if (!data || data.length === 0 || !xLabels?.length || !yLabels?.length) {
        return (
            <div className="glass-card-static">
                <h3 className="section-title">{title}</h3>
                <EmptyState icon="📊" message="No data available for this heat map" />
            </div>
        );
    }

    const cols = xLabels.length;

    return (
        <div className="glass-card-static" style={{ position: 'relative' }}>
            <div className="section-header">
                <div>
                    <h3 className="section-title">{title}</h3>
                    {subtitle && <p className="section-subtitle">{subtitle}</p>}
                </div>
            </div>

            <div className="heatmap-container" ref={containerRef} style={{ overflowX: 'auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `100px repeat(${cols}, 1fr)`,
                    gap: 3,
                    minWidth: cols * 42 + 100
                }}>
                    {/* Column Headers */}
                    <div /> {/* empty corner */}
                    {xLabels.map((label, i) => (
                        <div
                            key={`col-${i}`}
                            className="heatmap-label"
                            style={{
                                fontSize: 10,
                                paddingBottom: 6,
                                textAlign: 'center',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                            title={label}
                        >
                            {label?.length > 10 ? label.substring(0, 10) + '…' : label}
                        </div>
                    ))}

                    {/* Rows */}
                    {yLabels.map((rowLabel, rowIdx) => (
                        <div key={`row-${rowIdx}`} style={{ display: 'contents' }}>
                            {/* Row Label */}
                            <div
                                className="heatmap-label"
                                style={{
                                    justifyContent: 'flex-end',
                                    paddingRight: 10,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap'
                                }}
                                title={rowLabel}
                            >
                                {rowLabel}
                            </div>

                            {/* Cells */}
                            {xLabels.map((colLabel, colIdx) => {
                                const cell = data.find(d => d.y === rowLabel && d.x === colLabel);
                                const value = cell?.value || 0;
                                return (
                                    <div
                                        key={`cell-${rowIdx}-${colIdx}`}
                                        className="heatmap-cell"
                                        style={{
                                            backgroundColor: interpolateColor(value, maxValue, scheme),
                                            border: '1px solid rgba(255,255,255,0.03)',
                                            minHeight: cellSize,
                                            borderRadius: 4,
                                            transition: 'transform 0.15s, box-shadow 0.15s',
                                            cursor: 'crosshair'
                                        }}
                                        onMouseEnter={(e) => {
                                            const rect = containerRef.current.getBoundingClientRect();
                                            setTooltip({
                                                x: e.clientX - rect.left + 12,
                                                y: e.clientY - rect.top - 40,
                                                row: rowLabel,
                                                col: colLabel,
                                                value
                                            });
                                        }}
                                        onMouseLeave={() => setTooltip(null)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Floating Tooltip */}
                {tooltip && (
                    <div className="tooltip" style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        pointerEvents: 'none'
                    }}>
                        <strong>{tooltip.row}</strong> × <strong>{tooltip.col}</strong><br />
                        {valueLabel}: <strong>{typeof tooltip.value === 'number' ? tooltip.value.toFixed(1) : tooltip.value}</strong>
                    </div>
                )}
            </div>

            {/* Legend */}
            {showLegend && (
                <div className="heatmap-legend">
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Low</span>
                    <div
                        className="heatmap-legend-bar"
                        style={{
                            background: `linear-gradient(90deg, rgb(${scheme.low.join(',')}), rgb(${scheme.high.join(',')}))`
                        }}
                    />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>High</span>
                    <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                        (Max: {typeof maxValue === 'number' ? maxValue.toFixed(1) : maxValue})
                    </span>
                </div>
            )}
        </div>
    );
}

export { COLOR_SCHEMES, interpolateColor };
