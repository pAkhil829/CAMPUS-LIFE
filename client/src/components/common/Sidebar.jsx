import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Bell, Calendar, BarChart3,
    Send, Users, LogOut, Activity, PieChart
} from 'lucide-react';

const navConfig = {
    student: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Events', path: '/events', icon: Calendar },
    ],
    staff: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Publish', path: '/publish', icon: Send },
        { label: 'My Announcements', path: '/my-announcements', icon: Bell },
        { label: 'Events', path: '/events', icon: Calendar },
    ],
    admin: [
        { label: 'Campus Pulse', path: '/dashboard', icon: Activity },
        { label: 'Heat Maps', path: '/analytics', icon: BarChart3 },
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Events', path: '/events', icon: Calendar },
        { label: 'Users', path: '/users', icon: Users },
    ]
};

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const items = navConfig[user?.role] || navConfig.student;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="logo-icon">C3</div>
                <div>
                    <h1>Campus 360</h1>
                    <div className="tagline">Where Information Finds You</div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section-title">Navigation</div>
                {items.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon className="nav-icon" size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-card">
                    <div className="user-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="user-info" style={{ flex: 1 }}>
                        <div className="user-name">{user?.name}</div>
                        <div className="user-role">{user?.role} • {user?.department}</div>
                    </div>
                </div>
                <button className="nav-item" onClick={handleLogout} style={{ marginTop: 8 }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
