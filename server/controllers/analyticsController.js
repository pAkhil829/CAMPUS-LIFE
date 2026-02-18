const analyticsService = require('../services/analyticsService');

const getCampusPulse = async (req, res, next) => {
    try {
        const pulse = await analyticsService.getCampusPulse();
        res.json(pulse);
    } catch (error) {
        next(error);
    }
};

const getDepartmentEngagement = async (req, res, next) => {
    try {
        const data = await analyticsService.getDepartmentEngagement();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const getNotificationResponse = async (req, res, next) => {
    try {
        const data = await analyticsService.getNotificationResponse();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const getTimeActivity = async (req, res, next) => {
    try {
        const data = await analyticsService.getTimeActivity();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const getEventEngagement = async (req, res, next) => {
    try {
        const data = await analyticsService.getEventEngagement();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = { getCampusPulse, getDepartmentEngagement, getNotificationResponse, getTimeActivity, getEventEngagement };
