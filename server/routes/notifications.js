const router = require('express').Router();
const { create, getAll, acknowledge, markRead, getStats, getMyCreated } = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.post('/', authorize('staff', 'admin'), create);
router.get('/', getAll);
router.get('/my-created', authorize('staff', 'admin'), getMyCreated);
router.put('/:id/acknowledge', acknowledge);
router.put('/:id/read', markRead);
router.get('/:id/stats', authorize('staff', 'admin'), getStats);

module.exports = router;
