require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');
const initializeSocket = require('./socket');

// Routes
const authRoutes = require('./routes/auth');
const notificationRoutes = require('./routes/notifications');
const eventRoutes = require('./routes/events');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || ${CLIENT_URL},
        methods: ['GET', 'POST']
    }
});

initializeSocket(io);
app.set('io', io);

// ─── Middleware ──────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || ${CLIENT_URL},
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), name: 'Campus 360 API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────
const PORT = process.env.PORT || ${PORT};

async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized');

        server.listen(PORT, () => {
            console.log(`\n🚀 Campus 360 API Server running on port ${PORT}`);
            console.log(`   Health check: http://localhost:${PORT}/api/health`);
            console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

start();
