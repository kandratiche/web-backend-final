const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
  completeCourse,
  addReview,
  togglePublish
} = require('../controllers/courseController');
const { protect, hasMinimumRole } = require('../middleware/auth');
const {
  courseValidation,
  courseUpdateValidation,
  reviewValidation,
  validate
} = require('../middleware/validation');

router.get('/', getCourses);
router.get('/:id', getCourse);

router.post('/', protect, hasMinimumRole('premium'), courseValidation, validate, createCourse);

router.route('/:id')
  .put(protect, courseUpdateValidation, validate, updateCourse)
  .delete(protect, deleteCourse);

router.post('/:id/enroll', protect, enrollCourse);
router.delete('/:id/enroll', protect, unenrollCourse);

router.post('/:id/complete', protect, completeCourse);

router.post('/:id/reviews', protect, reviewValidation, validate, addReview);

router.put('/:id/publish', protect, togglePublish);

module.exports = router;
