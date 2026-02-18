import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import Events from './pages/Events';
import PublishNotification from './pages/PublishNotification';
import Analytics from './pages/Analytics';

function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-page">
                <div className="spinner" />
                <p>Loading Campus 360...</p>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
    return children;
}

function DashboardRouter() {
    const { user } = useAuth();
    switch (user?.role) {
        case 'admin': return <AdminDashboard />;
        case 'staff': return <StaffDashboard />;
        default: return <StudentDashboard />;
    }
}

function AppLayout({ children, title }) {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Header title={title} />
                <div className="page-container">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-page" style={{ minHeight: '100vh' }}>
                <div className="spinner" />
                <p>Initializing Campus 360...</p>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

            <Route path="/dashboard" element={
                <ProtectedRoute><AppLayout><DashboardRouter /></AppLayout></ProtectedRoute>
            } />
            <Route path="/notifications" element={
                <ProtectedRoute><AppLayout title="Notifications"><Notifications /></AppLayout></ProtectedRoute>
            } />
            <Route path="/events" element={
                <ProtectedRoute><AppLayout title="Events"><Events /></AppLayout></ProtectedRoute>
            } />
            <Route path="/publish" element={
                <ProtectedRoute roles={['staff', 'admin']}><AppLayout title="Publish Notification"><PublishNotification /></AppLayout></ProtectedRoute>
            } />
            <Route path="/my-announcements" element={
                <ProtectedRoute roles={['staff', 'admin']}><AppLayout title="My Announcements"><Notifications showCreated /></AppLayout></ProtectedRoute>
            } />
            <Route path="/analytics" element={
                <ProtectedRoute roles={['admin']}><AppLayout title="Analytics & Heat Maps"><Analytics /></AppLayout></ProtectedRoute>
            } />
            <Route path="/users" element={
                <ProtectedRoute roles={['admin']}><AppLayout title="Users"><div className="empty-state"><div className="empty-icon">👥</div><p>User management coming soon</p></div></AppLayout></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
    );
}
