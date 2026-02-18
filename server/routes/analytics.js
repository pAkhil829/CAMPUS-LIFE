const router = require('express').Router();
const { getCampusPulse, getDepartmentEngagement, getNotificationResponse, getTimeActivity, getEventEngagement } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/campus-pulse', getCampusPulse);
router.get('/department-engagement', getDepartmentEngagement);
router.get('/notification-response', getNotificationResponse);
router.get('/time-activity', getTimeActivity);
router.get('/event-engagement', getEventEngagement);

module.exports = router;
