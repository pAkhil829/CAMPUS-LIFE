import { useState, useEffect } from 'react';
import api from '../services/api';
import { Activity, Users, Bell, Calendar, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard, PageHeader, Loader } from '../components/common';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [pulse, setPulse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadPulse(); }, []);

    const loadPulse = async () => {
        try {
            const res = await api.get('/analytics/campus-pulse');
            setPulse(res.data);
        } catch (err) {
            console.error('Failed to load campus pulse:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullPage text="Loading Campus Pulse..." />;

    const analyticsCards = [
        { title: 'Department Engagement', desc: 'Notification acknowledgement rates across departments', icon: '🏛️', color: 'rgba(99,102,241,0.08)' },
        { title: 'Notification Response', desc: 'Average response times by priority level', icon: '⚡', color: 'rgba(245,158,11,0.08)' },
        { title: 'Time-Based Activity', desc: '24×7 activity heat map — when is campus most active?', icon: '🕐', color: 'rgba(6,182,212,0.08)' },
        { title: 'Event Engagement', desc: 'Registration and attendance rates per event', icon: '🎯', color: 'rgba(16,185,129,0.08)' }
    ];

    return (
        <div>
            <PageHeader
                icon={<Zap size={24} color="white" />}
                title="Campus Pulse"
                subtitle="Real-time campus intelligence overview"
                gradient="linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05), rgba(6,182,212,0.05))"
            />

            {/* Pulse Stats */}
            <div className="stats-grid">
                <StatCard icon={<Users size={22} color="#818cf8" />} iconBg="rgba(99,102,241,0.12)" value={pulse?.total_users || 0} label="Total Users" />
                <StatCard icon={<Activity size={22} color="#10b981" />} iconBg="rgba(16,185,129,0.12)" value={pulse?.active_today || 0} label="Active Today" />
                <StatCard icon={<Bell size={22} color="#f59e0b" />} iconBg="rgba(245,158,11,0.12)" value={pulse?.unread_notifications || 0} label="Unread Notifications" />
                <StatCard icon={<Calendar size={22} color="#06b6d4" />} iconBg="rgba(6,182,212,0.12)" value={pulse?.upcoming_events || 0} label="Upcoming Events" />
            </div>

            {/* Quick Links to Analytics */}
            <div className="glass-card-static" style={{ marginTop: 24 }}>
                <div className="section-header">
                    <div>
                        <h3 className="section-title">📊 Intelligence Hub</h3>
                        <p className="section-subtitle">Deep-dive into campus analytics</p>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {analyticsCards.map((card, i) => (
                        <div
                            key={i}
                            onClick={() => navigate('/analytics')}
                            style={{
                                padding: 20,
                                background: card.color,
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            className="glass-card"
                        >
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
                            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{card.title}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{card.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
