const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteAccount,
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getMyCourses,
  getUserStats
} = require('../controllers/userController');
const { protect, authorize, hasMinimumRole } = require('../middleware/auth');
const { profileUpdateValidation, validate } = require('../middleware/validation');

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, profileUpdateValidation, validate, updateProfile)
  .delete(protect, deleteAccount);

router.get('/my-courses', protect, getMyCourses);
router.get('/stats', protect, getUserStats);

router.get('/', protect, hasMinimumRole('moderator'), getAllUsers);
router.get('/:id', protect, hasMinimumRole('moderator'), getUser);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
