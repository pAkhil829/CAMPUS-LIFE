require('dotenv').config();
const { sequelize, User, Notification, NotificationAck, Event, EventRegistration, ActivityLog } = require('../models');
const bcrypt = require('bcryptjs');

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
const CATEGORIES = ['general', 'academic', 'cultural', 'sports', 'placement'];
const PRIORITIES = ['critical', 'academic', 'event', 'hostel'];
const ACTIONS = ['user_login', 'notification_created', 'notification_acknowledged', 'event_rsvp', 'event_created', 'page_view'];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomDate(daysBack, daysForward = 0) {
    const now = Date.now();
    const start = now - daysBack * 86400000;
    const end = now + daysForward * 86400000;
    return new Date(start + Math.random() * (end - start));
}

async function seed() {
    try {
        console.log('🌱 Starting seed...');
        await sequelize.sync({ force: true });
        console.log('✅ Database synced (tables recreated)');

        // ─── Users ──────────────────────────────────────
        const hashedPassword = await bcrypt.hash('password123', 12);
        const usersData = [];

        // Admin users
        for (let i = 0; i < 3; i++) {
            usersData.push({
                name: `Admin ${i + 1}`,
                email: `admin${i + 1}@campus360.edu`,
                password: hashedPassword,
                role: 'admin',
                department: randomItem(DEPARTMENTS),
                year: null
            });
        }

        // Staff users
        for (let i = 0; i < 10; i++) {
            usersData.push({
                name: `Prof. Staff ${i + 1}`,
                email: `staff${i + 1}@campus360.edu`,
                password: hashedPassword,
                role: 'staff',
                department: DEPARTMENTS[i % DEPARTMENTS.length],
                year: null
            });
        }

        // Student users
        for (let i = 0; i < 40; i++) {
            usersData.push({
                name: `Student ${i + 1}`,
                email: `student${i + 1}@campus360.edu`,
                password: hashedPassword,
                role: 'student',
                department: DEPARTMENTS[i % DEPARTMENTS.length],
                year: (i % 4) + 1
            });
        }

        const users = await User.bulkCreate(usersData);
        console.log(`✅ Created ${users.length} users`);

        const admins = users.filter(u => u.role === 'admin');
        const staff = users.filter(u => u.role === 'staff');
        const students = users.filter(u => u.role === 'student');

        // ─── Notifications ──────────────────────────────
        const notificationTemplates = [
            { title: 'URGENT: Campus Evacuation Drill', priority: 'critical', category: 'general' },
            { title: 'Mid-Semester Exam Schedule Released', priority: 'academic', category: 'academic' },
            { title: 'Annual Cultural Fest Registrations Open', priority: 'event', category: 'cultural' },
            { title: 'Hostel Maintenance: Water Supply Disruption', priority: 'hostel', category: 'general' },
            { title: 'Placement Drive: TechCorp Visiting Campus', priority: 'critical', category: 'placement' },
            { title: 'Library Hours Extended During Exams', priority: 'academic', category: 'academic' },
            { title: 'Sports Day Registration Deadline Tomorrow', priority: 'event', category: 'sports' },
            { title: 'Hostel Room Allocation Results', priority: 'hostel', category: 'general' },
            { title: 'Guest Lecture: AI in Healthcare', priority: 'academic', category: 'academic' },
            { title: 'Internship Fair Next Week', priority: 'event', category: 'placement' },
        ];

        const notifications = [];
        for (let i = 0; i < 25; i++) {
            const template = notificationTemplates[i % notificationTemplates.length];
            const creator = randomItem([...staff, ...admins]);
            const n = await Notification.create({
                title: `${template.title}${i > 9 ? ` (#${i + 1})` : ''}`,
                message: `Detailed message for: ${template.title}. Please review and take necessary action.`,
                priority: template.priority,
                category: template.category,
                target_department: Math.random() > 0.4 ? randomItem(DEPARTMENTS) : null,
                target_year: Math.random() > 0.6 ? randomInt(1, 4) : null,
                expires_at: Math.random() > 0.3 ? randomDate(0, 30) : null,
                created_by: creator.id,
            });
            notifications.push(n);
        }
        console.log(`✅ Created ${notifications.length} notifications`);

        // ─── Notification Acknowledgements ──────────────
        const ackKeys = new Set();
        let ackCount = 0;
        for (const notification of notifications) {
            const targetStudents = students.filter(s => {
                if (notification.target_department && s.department !== notification.target_department) return false;
                if (notification.target_year && s.year !== notification.target_year) return false;
                return true;
            });

            for (const student of targetStudents) {
                const key = `${student.id}_${notification.id}`;
                if (ackKeys.has(key)) continue;
                if (Math.random() > 0.4) {
                    ackKeys.add(key);
                    const createdAt = new Date(notification.createdAt);
                    const readDelay = randomInt(5, 1440);
                    const ackDelay = randomInt(readDelay, readDelay + 720);

                    await NotificationAck.create({
                        user_id: student.id,
                        notification_id: notification.id,
                        read_at: new Date(createdAt.getTime() + readDelay * 60000),
                        acknowledged_at: Math.random() > 0.3
                            ? new Date(createdAt.getTime() + ackDelay * 60000)
                            : null
                    });
                    ackCount++;
                }
            }
        }
        console.log(`✅ Created ${ackCount} notification acknowledgements`);

        // ─── Events ─────────────────────────────────────
        const eventsData = [
            { title: 'Annual Tech Symposium', description: 'A day of innovation and technology showcases', location: 'Main Auditorium', capacity: 200, category: 'academic' },
            { title: 'Cultural Fest: Rhythms 2026', description: 'Music, dance, and art competitions', location: 'Open Air Theatre', capacity: 500, category: 'cultural' },
            { title: 'Inter-Department Cricket Tournament', description: 'Annual cricket championship', location: 'Sports Complex', capacity: 100, category: 'sports' },
            { title: 'Hackathon: Code for Change', description: '24-hour coding marathon for social impact', location: 'CS Lab Block', capacity: 150, category: 'academic' },
            { title: 'Career Fair 2026', description: 'Top companies recruiting on campus', location: 'Convention Centre', capacity: 300, category: 'placement' },
            { title: 'Workshop: ML Bootcamp', description: '3-day intensive ML workshop', location: 'Seminar Hall A', capacity: 80, category: 'academic' },
            { title: 'Alumni Meetup', description: 'Connect with distinguished alumni', location: 'Board Room', capacity: 50, category: 'general' },
            { title: 'Photography Exhibition', description: 'Student photography showcase', location: 'Art Gallery', capacity: null, category: 'cultural' },
            { title: 'Blood Donation Camp', description: 'Annual blood donation drive', location: 'Health Centre', capacity: 200, category: 'general' },
            { title: 'Startup Pitch Night', description: 'Student entrepreneurs pitch their ideas', location: 'Innovation Hub', capacity: 100, category: 'placement' },
        ];

        const events = [];
        for (const data of eventsData) {
            const creator = randomItem([...staff, ...admins]);
            events.push(await Event.create({
                ...data,
                event_date: randomDate(-5, 30),
                end_date: null,
                department: Math.random() > 0.5 ? randomItem(DEPARTMENTS) : null,
                created_by: creator.id
            }));
        }
        console.log(`✅ Created ${events.length} events`);

        // ─── Event Registrations ────────────────────────
        let regCount = 0;
        for (const event of events) {
            const numRegs = randomInt(5, Math.min(20, event.capacity || 20));
            const shuffled = [...students].sort(() => Math.random() - 0.5).slice(0, numRegs);
            for (const student of shuffled) {
                const statuses = ['registered', 'registered', 'attended', 'cancelled'];
                await EventRegistration.create({
                    user_id: student.id,
                    event_id: event.id,
                    status: randomItem(statuses)
                });
                regCount++;
            }
        }
        console.log(`✅ Created ${regCount} event registrations`);

        // ─── Activity Logs ──────────────────────────────
        const logsData = [];
        for (let i = 0; i < 300; i++) {
            const user = randomItem(users);
            logsData.push({
                user_id: user.id,
                action: randomItem(ACTIONS),
                metadata: { source: 'seeder', random: randomInt(1, 100) },
                created_at: randomDate(30)
            });
        }

        // Insert logs in batches of 30
        for (let i = 0; i < logsData.length; i += 30) {
            await ActivityLog.bulkCreate(logsData.slice(i, i + 30));
        }
        console.log(`✅ Created ${logsData.length} activity logs`);

        console.log('\n🎉 Seed completed successfully!');
        console.log('──────────────────────────────────');
        console.log('Demo Accounts:');
        console.log('  Admin:   admin1@campus360.edu / password123');
        console.log('  Staff:   staff1@campus360.edu / password123');
        console.log('  Student: student1@campus360.edu / password123');
        console.log('──────────────────────────────────');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
