import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Send, Bell, BarChart3, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard, PageHeader, SectionHeader, EmptyState, Loader } from '../components/common';
import { NotificationCard } from '../components/notifications';

export default function StaffDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myNotifications, setMyNotifications] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [notifRes, eventRes] = await Promise.all([
                api.get('/notifications/my-created'),
                api.get('/events?upcoming=true&limit=5')
            ]);
            setMyNotifications(notifRes.data.notifications || []);
            setEvents(eventRes.data.events || []);
        } catch (err) {
            console.error('Failed to load staff data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullPage text="Loading dashboard..." />;

    const totalSent = myNotifications.length;
    const totalAcked = myNotifications.reduce((acc, n) =>
        acc + (n.acknowledgements?.filter(a => a.acknowledged_at)?.length || 0), 0
    );
    const totalRead = myNotifications.reduce((acc, n) =>
        acc + (n.acknowledgements?.filter(a => a.read_at)?.length || 0), 0
    );

    return (
        <div>
            {/* Welcome */}
            <PageHeader
                title={`Staff Dashboard — ${user?.name} 📋`}
                subtitle="Manage announcements, events, and track engagement"
                gradient="linear-gradient(135deg, rgba(6,182,212,0.08), rgba(99,102,241,0.05))"
            />

            {/* Stats */}
            <div className="stats-grid">
                <StatCard icon={<Send size={22} color="#818cf8" />} iconBg="rgba(99,102,241,0.12)" value={totalSent} label="Announcements Sent" />
                <StatCard icon={<Bell size={22} color="#06b6d4" />} iconBg="rgba(6,182,212,0.12)" value={totalRead} label="Total Reads" />
                <StatCard icon={<BarChart3 size={22} color="#10b981" />} iconBg="rgba(16,185,129,0.12)" value={totalAcked} label="Acknowledged" />
                <StatCard icon={<Calendar size={22} color="#f59e0b" />} iconBg="rgba(245,158,11,0.12)" value={events.length} label="Upcoming Events" />
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => navigate('/publish')}>
                    <Send size={16} /> Publish Announcement
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/events')}>
                    <Calendar size={16} /> Create Event
                </button>
            </div>

            <div className="dashboard-grid">
                {/* My Announcements + Delivery Stats */}
                <div className="glass-card-static">
                    <SectionHeader title="My Announcements" subtitle="Delivery analytics" icon="📢" />
                    {myNotifications.length === 0 ? (
                        <EmptyState icon="📢" message="No announcements yet. Publish your first one!" action="Publish" onAction={() => navigate('/publish')} />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {myNotifications.slice(0, 8).map(n => (
                                <NotificationCard key={n.id} notification={n} showStats />
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Events */}
                <div className="glass-card-static">
                    <SectionHeader title="Upcoming Events" subtitle="Events & registrations" icon="📅" />
                    {events.length === 0 ? (
                        <EmptyState icon="📅" message="No upcoming events" action="Create Event" onAction={() => navigate('/events')} />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {events.map(event => (
                                <div key={event.id} style={{ padding: 14, background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{event.title}</div>
                                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                                        <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>
                                        <span>📍 {event.location}</span>
                                        <span>👥 {event.registration_count || 0}{event.capacity ? `/${event.capacity}` : ''} registered</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
