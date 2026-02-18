const { Op } = require('sequelize');
const { Event, EventRegistration, User, ActivityLog } = require('../models');

class EventService {
    async create({ title, description, event_date, end_date, location, capacity, category, department, created_by }) {
        const event = await Event.create({
            title, description, event_date, end_date,
            location, capacity, category, department, created_by
        });

        await ActivityLog.create({
            user_id: created_by,
            action: 'event_created',
            metadata: { event_id: event.id, title, category }
        });

        return event;
    }

    async list({ department, upcoming, limit = 20, offset = 0 }) {
        const where = {};
        if (department) where.department = department;
        if (upcoming) where.event_date = { [Op.gte]: new Date() };

        const events = await Event.findAndCountAll({
            where,
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'department'] },
                { model: EventRegistration, as: 'registrations' }
            ],
            order: [['event_date', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return {
            events: events.rows.map(event => ({
                ...event.toJSON(),
                registration_count: event.registrations?.length || 0,
                spots_left: event.capacity ? event.capacity - (event.registrations?.length || 0) : null
            })),
            total: events.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };
    }

    async rsvp(eventId, userId) {
        const event = await Event.findByPk(eventId, {
            include: [{ model: EventRegistration, as: 'registrations' }]
        });

        if (!event) {
            const error = new Error('Event not found.');
            error.statusCode = 404;
            throw error;
        }

        if (event.capacity && event.registrations.length >= event.capacity) {
            const error = new Error('Event is full.');
            error.statusCode = 400;
            throw error;
        }

        const existing = await EventRegistration.findOne({
            where: { user_id: userId, event_id: eventId }
        });

        if (existing) {
            if (existing.status === 'cancelled') {
                existing.status = 'registered';
                await existing.save();
                return existing;
            }
            const error = new Error('Already registered for this event.');
            error.statusCode = 409;
            throw error;
        }

        const registration = await EventRegistration.create({
            user_id: userId, event_id: eventId, status: 'registered'
        });

        await ActivityLog.create({
            user_id: userId,
            action: 'event_rsvp',
            metadata: { event_id: eventId, event_title: event.title }
        });

        return registration;
    }

    async cancelRsvp(eventId, userId) {
        const registration = await EventRegistration.findOne({
            where: { user_id: userId, event_id: eventId }
        });

        if (!registration) {
            const error = new Error('Registration not found.');
            error.statusCode = 404;
            throw error;
        }

        registration.status = 'cancelled';
        await registration.save();
        return registration;
    }

    async getRegistrations(eventId) {
        return EventRegistration.findAll({
            where: { event_id: eventId, status: { [Op.ne]: 'cancelled' } },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'department', 'year'] }],
            order: [['created_at', 'ASC']]
        });
    }

    async getMyRegistrations(userId) {
        return EventRegistration.findAll({
            where: { user_id: userId, status: { [Op.ne]: 'cancelled' } },
            include: [{ model: Event, as: 'event' }],
            order: [[{ model: Event, as: 'event' }, 'event_date', 'ASC']]
        });
    }
}

module.exports = new EventService();
