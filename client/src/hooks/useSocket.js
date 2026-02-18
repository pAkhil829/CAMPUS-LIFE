import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export function useSocket() {
    const { token } = useAuth();
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!token) return;

        const socket = io('/', {
            auth: { token },
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            setConnected(true);
            console.log('[Socket] Connected');
        });

        socket.on('disconnect', () => {
            setConnected(false);
            console.log('[Socket] Disconnected');
        });

        socket.on('new_notification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, [token]);

    const clearNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return { socket: socketRef.current, connected, notifications, clearNotification };
}
