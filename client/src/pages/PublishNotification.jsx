import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Send, CheckCircle } from 'lucide-react';
import { useToast } from '../components/common/Toast';

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];

export default function PublishNotification() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [form, setForm] = useState({
        title: '', message: '', priority: 'academic', category: 'general',
        target_department: '', target_year: '', expires_at: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/notifications', {
                ...form,
                target_department: form.target_department || null,
                target_year: form.target_year ? parseInt(form.target_year) : null,
                expires_at: form.expires_at || null
            });
            setSuccess(true);
            addToast({ type: 'success', title: 'Published!', message: `"${form.title}" sent successfully` });
            setTimeout(() => navigate('/my-announcements'), 2000);
        } catch (err) {
            addToast({ type: 'error', title: 'Error', message: err.response?.data?.error || 'Failed to publish' });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="glass-card-static" style={{ textAlign: 'center', padding: 48 }}>
                <CheckCircle size={48} color="#10b981" style={{ marginBottom: 16 }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Notification Published!</h3>
                <p style={{ color: 'var(--text-muted)' }}>Redirecting to your announcements...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="glass-card-static">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <Send size={22} color="#818cf8" />
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Publish Notification</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Notification title" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Message *</label>
                        <textarea className="form-textarea" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required placeholder="Detailed notification message..." rows={5} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label className="form-label">Priority *</label>
                            <select className="form-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                                <option value="critical">🚨 Critical</option>
                                <option value="academic">📚 Academic</option>
                                <option value="event">🎉 Event</option>
                                <option value="hostel">🏠 Hostel</option>
                            </select>
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
                    </div>

                    <div style={{ padding: 16, background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>🎯 TARGET AUDIENCE</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Department</label>
                                <select className="form-select" value={form.target_department} onChange={e => setForm(f => ({ ...f, target_department: e.target.value }))}>
                                    <option value="">All Departments</option>
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Year</label>
                                <select className="form-select" value={form.target_year} onChange={e => setForm(f => ({ ...f, target_year: e.target.value }))}>
                                    <option value="">All Years</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Expiry Date (Optional)</label>
                        <input type="datetime-local" className="form-input" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Publishing...' : 'Publish Notification'}
                    </button>
                </form>
            </div>
        </div>
    );
}
