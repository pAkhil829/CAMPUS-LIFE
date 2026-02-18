import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common';
import { NotificationFeed } from '../components/notifications';
import { useToast } from '../components/common/Toast';

export default function Notifications({ showCreated = false }) {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadNotifications(); }, [showCreated]);

    const loadNotifications = async () => {
        try {
            const endpoint = showCreated ? '/notifications/my-created' : '/notifications';
            const res = await api.get(endpoint);
            setNotifications(res.data.notifications || []);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const acknowledge = async (id) => {
        try {
            await api.put(`/notifications/${id}/acknowledge`);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, acknowledgements: [{ acknowledged_at: new Date(), read_at: new Date() }] } : n
            ));
            addToast({ type: 'success', title: 'Acknowledged', message: 'Notification acknowledged successfully' });
        } catch (err) {
            addToast({ type: 'error', title: 'Error', message: 'Failed to acknowledge notification' });
        }
    };

    if (loading) return <Loader fullPage text="Loading notifications..." />;

    return (
        <NotificationFeed
            notifications={notifications}
            onAcknowledge={showCreated ? undefined : acknowledge}
            showStats={showCreated}
            showFilter
            emptyIcon="📭"
            emptyMessage={showCreated ? 'No announcements published yet' : 'No notifications found'}
        />
    );
}
