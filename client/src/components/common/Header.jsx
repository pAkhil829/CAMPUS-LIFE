import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title, unreadCount = 0 }) {
    const { user } = useAuth();

    return (
        <header className="header">
            <div className="header-left">
                <h2>{title || `Welcome, ${user?.name?.split(' ')[0]}`}</h2>
            </div>
            <div className="header-right">
                <button className="notification-bell" id="notification-bell">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                </button>
                <div className="user-avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                </div>
            </div>
        </header>
    );
}
