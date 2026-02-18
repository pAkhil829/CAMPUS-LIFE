import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus } from 'lucide-react';
import { Modal, Loader, EmptyState } from '../components/common';
import { EventCard } from '../components/events';
import { useToast } from '../components/common/Toast';

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];

export default function Events() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [filter, setFilter] = useState('upcoming');
    const [form, setForm] = useState({
        title: '', description: '', event_date: '', location: '', capacity: '', category: 'general', department: ''
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => { loadEvents(); }, [filter]);

    const loadEvents = async () => {
        try {
            const res = await api.get(`/events?upcoming=${filter === 'upcoming'}&limit=50`);
            setEvents(res.data.events || []);
        } catch (err) {
            console.error('Failed to load events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await api.post('/events', {
                ...form,
                capacity: form.capacity ? parseInt(form.capacity) : null,
                department: form.department || null
            });
            setShowCreate(false);
            setForm({ title: '', description: '', event_date: '', location: '', capacity: '', category: 'general', department: '' });
            addToast({ type: 'success', title: 'Event Created!', message: `"${form.title}" has been published` });
            loadEvents();
        } catch (err) {
            addToast({ type: 'error', title: 'Error', message: err.response?.data?.error || 'Failed to create event' });
        } finally {
            setCreating(false);
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

    if (loading) return <Loader fullPage text="Loading events..." />;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div className="tabs" style={{ marginBottom: 0 }}>
                    <button className={`tab-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>Upcoming</button>
                    <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Events</button>
                </div>
                {(user?.role === 'staff' || user?.role === 'admin') && (
                    <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                        <Plus size={16} /> Create Event
                    </button>
                )}
            </div>

            {/* Create Event Modal */}
            <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Event" size="lg">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label className="form-label">Date & Time *</label>
                            <input type="datetime-local" className="form-input" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location *</label>
                            <input className="form-input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label className="form-label">Capacity</label>
                            <input type="number" className="form-input" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="Unlimited" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                <option value="general">General</option>
                                <option value="academic">Academic</option>
                                <option value="cultural">Cultural</option>
                                <option value="sports">Sports</option>
                                <option value="placement">Placement</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select className="form-select" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                                <option value="">All Departments</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Create Event'}</button>
                    </div>
                </form>
            </Modal>

            {/* Event Grid */}
            {events.length === 0 ? (
                <EmptyState
                    icon="🎉"
                    title="No Events"
                    message={filter === 'upcoming' ? 'No upcoming events scheduled' : 'No events found'}
                    action={(user?.role === 'staff' || user?.role === 'admin') ? 'Create Event' : undefined}
                    onAction={() => setShowCreate(true)}
                />
            ) : (
                <div className="events-grid">
                    {events.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            canRsvp={user?.role === 'student'}
                            onRsvp={handleRsvp}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
