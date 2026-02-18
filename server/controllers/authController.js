const authService = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const { name, email, password, role, department, year } = req.body;

        if (!name || !email || !password || !department) {
            return res.status(400).json({ error: 'Name, email, password, and department are required.' });
        }

        const result = await authService.register({ name, email, password, role, department, year });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const result = await authService.login({ email, password });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res) => {
    res.json({ user: req.user });
};

module.exports = { register, login, getProfile };
