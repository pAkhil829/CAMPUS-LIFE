import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart3 } from 'lucide-react';
import { Loader, PageHeader } from '../components/common';
import { HeatMap } from '../components/charts';
import { EngagementTable } from '../components/charts';

export default function Analytics() {
    const [tab, setTab] = useState('department');
    const [deptData, setDeptData] = useState(null);
    const [notifData, setNotifData] = useState(null);
    const [timeData, setTimeData] = useState(null);
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        try {
            const [dept, notif, time, event] = await Promise.all([
                api.get('/analytics/department-engagement'),
                api.get('/analytics/notification-response'),
                api.get('/analytics/time-activity'),
                api.get('/analytics/event-engagement')
            ]);
            setDeptData(dept.data);
            setNotifData(notif.data);
            setTimeData(time.data);
            setEventData(event.data);
        } catch (err) {
            console.error('Failed to load analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullPage text="Loading analytics..." />;

    const tabs = [
        { id: 'department', label: '🏛️ Department' },
        { id: 'notification', label: '⚡ Response' },
        { id: 'time', label: '🕐 Activity' },
        { id: 'events', label: '🎯 Events' }
    ];

    return (
        <div>
            <PageHeader
                icon={<BarChart3 size={24} color="white" />}
                title="Heat Map Analytics"
                subtitle="Visual intelligence — engagement patterns across campus"
            />

            <div className="tabs">
                {tabs.map(t => (
                    <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'department' && deptData && (
                <HeatMap
                    title="🏛️ Department Engagement Heat Map"
                    subtitle="Notification acknowledgement rate (%) by department and category"
                    data={deptData.data}
                    xLabels={deptData.xLabels}
                    yLabels={deptData.yLabels}
                    maxValue={deptData.maxValue}
                    valueLabel="Engagement Rate %"
                    colorScheme="purple"
                />
            )}

            {tab === 'notification' && notifData && (
                <HeatMap
                    title="⚡ Notification Response Heat Map"
                    subtitle="Average response time (minutes) by department and priority"
                    data={notifData.data}
                    xLabels={notifData.xLabels}
                    yLabels={notifData.yLabels}
                    maxValue={notifData.maxValue}
                    valueLabel="Avg Response (min)"
                    colorScheme="warm"
                />
            )}

            {tab === 'time' && timeData && (
                <HeatMap
                    title="🕐 Time-Based Activity Heat Map"
                    subtitle="Campus activity intensity — 24 hours × 7 days (last 30 days)"
                    data={timeData.data}
                    xLabels={timeData.xLabels}
                    yLabels={timeData.yLabels}
                    maxValue={timeData.maxValue}
                    valueLabel="Activities"
                    colorScheme="cyan"
                />
            )}

            {tab === 'events' && (
                <EngagementTable
                    title="🎯 Event Engagement"
                    subtitle="Registration and attendance metrics per event"
                    data={eventData}
                />
            )}
        </div>
    );
}
