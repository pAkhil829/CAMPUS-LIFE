import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_ICONS = {
    success: <CheckCircle size={18} color="#10b981" />,
    error: <AlertTriangle size={18} color="#ef4444" />,
    info: <Info size={18} color="#06b6d4" />,
    notification: <AlertTriangle size={18} color="#f59e0b" />
};

const TOAST_BORDERS = {
    success: '1px solid rgba(16, 185, 129, 0.3)',
    error: '1px solid rgba(239, 68, 68, 0.3)',
    info: '1px solid rgba(6, 182, 212, 0.3)',
    notification: '1px solid rgba(245, 158, 11, 0.3)'
};

function Toast({ id, type = 'info', title, message, onDismiss }) {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onDismiss(id), 300);
        }, 5000);
        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    const handleClose = () => {
        setExiting(true);
        setTimeout(() => onDismiss(id), 300);
    };

    return (
        <div className={`toast ${exiting ? 'toast-exit' : ''}`} style={{ borderLeft: `3px solid`, borderColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'notification' ? '#f59e0b' : '#06b6d4' }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}>
                {TOAST_ICONS[type] || TOAST_ICONS.info}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                {title && <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{title}</div>}
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{message}</div>
            </div>
            <button
                onClick={handleClose}
                style={{
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    padding: 4, flexShrink: 0
                }}
            >
                <X size={14} />
            </button>
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ type = 'info', title, message }) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, type, title, message }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} onDismiss={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
}
