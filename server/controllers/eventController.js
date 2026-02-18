const eventService = require('../services/eventService');

const create = async (req, res, next) => {
    try {
        const { title, description, event_date, end_date, location, capacity, category, department } = req.body;

        if (!title || !event_date || !location) {
            return res.status(400).json({ error: 'Title, event_date, and location are required.' });
        }

        const event = await eventService.create({
            title, description, event_date, end_date,
            location, capacity, category, department,
            created_by: req.user.id
        });

        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
};

const list = async (req, res, next) => {
    try {
        const { department, upcoming, limit, offset } = req.query;
        const result = await eventService.list({ department, upcoming: upcoming === 'true', limit, offset });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const rsvp = async (req, res, next) => {
    try {
        const registration = await eventService.rsvp(req.params.id, req.user.id);
        res.status(201).json(registration);
    } catch (error) {
        next(error);
    }
};

const cancelRsvp = async (req, res, next) => {
    try {
        const registration = await eventService.cancelRsvp(req.params.id, req.user.id);
        res.json(registration);
    } catch (error) {
        next(error);
    }
};

const getRegistrations = async (req, res, next) => {
    try {
        const registrations = await eventService.getRegistrations(req.params.id);
        res.json({ registrations });
    } catch (error) {
        next(error);
    }
};

const getMyRegistrations = async (req, res, next) => {
    try {
        const registrations = await eventService.getMyRegistrations(req.user.id);
        res.json({ registrations });
    } catch (error) {
        next(error);
    }
};

module.exports = { create, list, rsvp, cancelRsvp, getRegistrations, getMyRegistrations };
