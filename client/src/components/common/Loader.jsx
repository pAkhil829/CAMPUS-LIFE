export default function Loader({ text = 'Loading...', fullPage = false }) {
    if (fullPage) {
        return (
            <div className="loading-page">
                <div className="spinner" />
                <p>{text}</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 }}>
            <div className="spinner" style={{ width: 24, height: 24 }} />
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{text}</span>
        </div>
    );
}
