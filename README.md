# Campus 360 – Where Information Finds You 🎓

A unified, intelligent campus notification and event platform built with **React**, **Node.js**, **Express**, and **PostgreSQL**. Features real-time notifications, event management, role-based dashboards, and visual analytics with interactive heat maps.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql) ![Socket.io](https://img.shields.io/badge/Socket.io-4-black?logo=socket.io)

---

## ✨ Features

### 🔔 Smart Notification System
- **Priority-based** notifications (Critical, Academic, Event, Hostel)
- **Targeted delivery** by department and year
- **Critical alerts** pinned until acknowledged
- **Countdown timers** for expiring notifications
- Real-time delivery via **Socket.io**

### 📅 Event Management
- Create, discover, and RSVP to campus events
- Capacity tracking with visual fill-rate indicators
- Category-based filtering (Academic, Cultural, Sports, Placement)

### 📊 Admin Analytics & Heat Maps
- **Department Engagement** – Acknowledgement rates by department × category
- **Notification Response** – Average response time by department × priority
- **Time-Based Activity** – 24×7 campus activity heat map
- **Event Engagement** – Registration, attendance, and fill-rate metrics

### 👥 Role-Based Dashboards
| Role | Features |
|------|----------|
| **Student** | Personal notification feed, critical alerts, event discovery, countdown timers |
| **Staff** | Publish announcements, delivery analytics, event creation |
| **Admin** | Campus Pulse overview, heat map analytics, system-wide insights |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, React Router v6, Lucide Icons |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | PostgreSQL, Sequelize ORM |
| **Auth** | JWT + bcrypt, Role-Based Access Control |
| **Design** | Dark Glassmorphism, CSS Variables, Custom Design System |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **PostgreSQL** v15+

### 1. Clone the Repository

```bash
git clone https://github.com/sanjeevpdsnm/CAMPUS-LIFE.git
cd CAMPUS-LIFE
```

### 2. Create the Database

```sql
-- Using psql or pgAdmin
CREATE DATABASE campus360;
```

### 3. Configure Environment

Edit `server/.env` with your PostgreSQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campus360
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=campus360_super_secret_key_2026
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

### 4. Install & Start Backend

```bash
cd server
npm install
npm run dev
```

### 5. Seed Demo Data

```bash
cd server
node seeders/seed.js
```

### 6. Install & Start Frontend

```bash
cd client
npm install
npm run dev
```

### 7. Open the App

Navigate to **http://localhost:5173** 🎉

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin1@campus360.edu | password123 |
| **Staff** | staff1@campus360.edu | password123 |
| **Student** | student1@campus360.edu | password123 |

Quick login buttons are also available on the login page.

---

## 📁 Project Structure

```
Campus 360/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # StatCard, Modal, Loader, Toast, Badge...
│   │   │   ├── notifications/ # NotificationCard, NotificationFeed
│   │   │   ├── events/        # EventCard
│   │   │   └── charts/        # HeatMap, EngagementTable
│   │   ├── pages/             # Dashboard, Notifications, Events, Analytics...
│   │   ├── context/           # AuthContext
│   │   ├── services/          # API client, Socket.io hook
│   │   └── styles/            # Design system (CSS variables, glassmorphism)
│   └── vite.config.js
│
├── server/                    # Express Backend
│   ├── config/                # Database configuration
│   ├── middleware/             # Auth (JWT + RBAC), Error handler
│   ├── models/                # Sequelize models (User, Notification, Event...)
│   ├── routes/                # API routes
│   ├── services/              # Business logic layer
│   ├── seeders/               # Database seeder
│   └── server.js              # Entry point
│
└── README.md
```

---

## 🗄️ Database Schema

```
users ──────────────────── 1:N ──── notifications
  │                                      │
  │── N:M (via notification_acks) ───────┘
  │
  │── N:M (via event_registrations) ─── events
  │
  └── 1:N ──── activity_logs
```

### Models
| Model | Purpose |
|-------|---------|
| `User` | Students, Staff, Admins with department & year |
| `Notification` | Priority-based announcements with targeting |
| `NotificationAck` | Read/acknowledge tracking per user |
| `Event` | Campus events with capacity management |
| `EventRegistration` | RSVP with status (registered/attended/cancelled) |
| `ActivityLog` | User action tracking for analytics |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT token |
| GET | `/api/auth/profile` | Get current user profile |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications for current user |
| POST | `/api/notifications` | Create notification (staff/admin) |
| PUT | `/api/notifications/:id/acknowledge` | Acknowledge a notification |
| GET | `/api/notifications/my-created` | Get notifications created by user |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List events (filter: upcoming) |
| POST | `/api/events` | Create event (staff/admin) |
| POST | `/api/events/:id/rsvp` | RSVP to an event |

### Analytics (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/campus-pulse` | Overview metrics |
| GET | `/api/analytics/department-engagement` | Department × Category heat map |
| GET | `/api/analytics/notification-response` | Department × Priority heat map |
| GET | `/api/analytics/time-activity` | 24h × 7d activity heat map |
| GET | `/api/analytics/event-engagement` | Event metrics table |

---

## 🎨 Component Library

17 reusable React components across 4 modules:

| Module | Components |
|--------|-----------|
| `common/` | StatCard, CountdownTimer, Modal, Loader, EmptyState, PageHeader, SectionHeader, ProgressBar, PriorityTag, Badge, Toast |
| `notifications/` | NotificationCard, NotificationFeed |
| `events/` | EventCard |
| `charts/` | HeatMap, EngagementTable |

---

## 📄 License

This project is for educational purposes.

---

**Built with ❤️ for Campus 360**
