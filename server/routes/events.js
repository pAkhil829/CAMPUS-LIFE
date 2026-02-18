const router = require('express').Router();
const { create, list, rsvp, cancelRsvp, getRegistrations, getMyRegistrations } = require('../controllers/eventController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.post('/', authorize('staff', 'admin'), create);
router.get('/', list);
router.get('/my-registrations', getMyRegistrations);
router.post('/:id/rsvp', rsvp);
router.delete('/:id/rsvp', cancelRsvp);
router.get('/:id/registrations', authorize('staff', 'admin'), getRegistrations);

module.exports = router;
