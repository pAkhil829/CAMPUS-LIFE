import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { AlertTriangle, BookOpen, Calendar, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard, CountdownTimer, SectionHeader, EmptyState, Loader } from '../components/common';
import { NotificationCard } from '../components/notifications';
import { EventCard } from '../components/events';
import { useToast } from '../components/common/Toast';
import { CheckCircle } from 'lucide-react';

export default function StudentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [notifRes, eventRes] = await Promise.all([
                api.get('/notifications'),
                api.get('/events?upcoming=true&limit=6')
            ]);
            setNotifications(notifRes.data.notifications || []);
            setEvents(eventRes.data.events || []);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const acknowledgeNotif = async (id) => {
        try {
            await api.put(`/notifications/${id}/acknowledge`);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, acknowledgements: [{ acknowledged_at: new Date() }] } : n
            ));
            addToast({ type: 'success', title: 'Acknowledged', message: 'Notification marked as acknowledged' });
        } catch (err) {
            addToast({ type: 'error', title: 'Error', message: 'Failed to acknowledge notification' });
        }
    };

    const handleRsvp = async (eventId) => {
        try {
            await api.post(`/events/${eventId}/rsvp`);
            setEvents(prev => prev.map(e =>
                e.id === eventId ? { ...e, registration_count: (e.registration_count || 0) + 1, userRegistered: true } : e
            ));
            addToast({ type: 'success', title: 'RSVP Confirmed!', message: 'You are registered for this event' });
        } catch (err) {
            addToast({ type: 'error', title: 'RSVP Failed', message: err.response?.data?.error || 'Could not register' });
        }
    };

    if (loading) return <Loader fullPage text="Loading your dashboard..." />;

    const criticalNotifs = notifications.filter(n => n.priority === 'critical' && !n.acknowledgements?.[0]?.acknowledged_at);
    const upcomingDeadlines = notifications
        .filter(n => n.expires_at && new Date(n.expires_at) > new Date())
        .sort((a, b) => new Date(a.expires_at) - new Date(b.expires_at))
        .slice(0, 3);
    const unreadCount = notifications.filter(n => !n.acknowledgements?.[0]?.read_at).length;

    return (
        <div>
            {/* What's Important Today */}
            <div className="glass-card-static" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 800 }}>
                            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}! 👋
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Here's what needs your attention today</p>
                    </div>
                </div>

                <div className="stats-grid">
                    <StatCard icon={<AlertTriangle size={22} color="#ef4444" />} iconBg="rgba(239,68,68,0.12)" value={criticalNotifs.length} label="Critical Alerts" />
                    <StatCard icon={<BookOpen size={22} color="#818cf8" />} iconBg="rgba(99,102,241,0.12)" value={unreadCount} label="Unread Notifications" />
                    <StatCard icon={<Calendar size={22} color="#06b6d4" />} iconBg="rgba(6,182,212,0.12)" value={events.length} label="Upcoming Events" />
                    <StatCard icon={<Clock size={22} color="#10b981" />} iconBg="rgba(16,185,129,0.12)" value={upcomingDeadlines.length} label="Deadlines Soon" />
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Critical Notifications */}
                <div className="glass-card-static">
                    <SectionHeader title="Critical Alerts" subtitle="Pinned until acknowledged" icon="🚨" />
                    {criticalNotifs.length === 0 ? (
                        <EmptyState icon={<CheckCircle size={32} style={{ opacity: 0.4 }} />} message="All clear! No critical alerts." />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {criticalNotifs.slice(0, 5).map(n => (
                                <NotificationCard key={n.id} notification={n} onAcknowledge={acknowledgeNotif} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Deadlines with Countdown */}
                <div className="glass-card-static">
                    <SectionHeader title="Upcoming Deadlines" subtitle="Live countdown" icon="⏰" />
                    {upcomingDeadlines.length === 0 ? (
                        <EmptyState icon="🎉" message="No upcoming deadlines!" />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {upcomingDeadlines.map(n => (
                                <div key={n.id} style={{ padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <span className={`priority-tag priority-${n.priority}`}>{n.priority}</span>
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>{n.title}</span>
                                    </div>
                                    <CountdownTimer targetDate={n.expires_at} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Notifications */}
            <div className="glass-card-static" style={{ marginBottom: 24 }}>
                <SectionHeader title="Recent Notifications" subtitle="All updates for your department" icon="📢">
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/notifications')}>
                        View All <ChevronRight size={14} />
                    </button>
                </SectionHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {notifications.slice(0, 6).map(n => (
                        <NotificationCard key={n.id} notification={n} onAcknowledge={acknowledgeNotif} compact />
                    ))}
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="glass-card-static">
                <SectionHeader title="Discover Events" subtitle="Upcoming campus events" icon="🎉">
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/events')}>
                        View All <ChevronRight size={14} />
                    </button>
                </SectionHeader>
                <div className="events-grid">
                    {events.slice(0, 6).map(event => (
                        <EventCard key={event.id} event={event} canRsvp onRsvp={handleRsvp} />
                    ))}
                </div>
            </div>
        </div>
    );
}
