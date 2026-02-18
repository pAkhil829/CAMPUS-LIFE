export default function SectionHeader({ title, subtitle, icon, children }) {
    return (
        <div className="section-header">
            <div>
                <h3 className="section-title">
                    {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
                    {title}
                </h3>
                {subtitle && <p className="section-subtitle">{subtitle}</p>}
            </div>
            {children && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{children}</div>}
        </div>
    );
}
