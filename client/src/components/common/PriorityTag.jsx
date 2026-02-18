export default function PriorityTag({ priority, size = 'sm' }) {
    const paddings = {
        xs: '2px 6px',
        sm: '3px 8px',
        md: '4px 12px'
    };

    return (
        <span
            className={`priority-tag priority-${priority}`}
            style={{ padding: paddings[size] || paddings.sm }}
        >
            {priority}
        </span>
    );
}
