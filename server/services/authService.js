const jwt = require('jsonwebtoken');
const { User, ActivityLog } = require('../models');

class AuthService {
    async register({ name, email, password, role, department, year }) {
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            const error = new Error('Email already registered.');
            error.statusCode = 409;
            throw error;
        }

        const user = await User.create({ name, email, password, role, department, year });

        await ActivityLog.create({
            user_id: user.id,
            action: 'user_registered',
            metadata: { role, department }
        });

        const token = this.generateToken(user);
        return { user: user.toSafeJSON(), token };
    }

    async login({ email, password }) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            const error = new Error('Invalid email or password.');
            error.statusCode = 401;
            throw error;
        }

        const isValid = await user.validatePassword(password);
        if (!isValid) {
            const error = new Error('Invalid email or password.');
            error.statusCode = 401;
            throw error;
        }

        await ActivityLog.create({
            user_id: user.id,
            action: 'user_login',
            metadata: { timestamp: new Date() }
        });

        const token = this.generateToken(user);
        return { user: user.toSafeJSON(), token };
    }

    generateToken(user) {
        return jwt.sign(
            { id: user.id, role: user.role, department: user.department },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
    }
}

module.exports = new AuthService();
