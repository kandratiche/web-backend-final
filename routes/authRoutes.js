const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  forgotPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  validate
} = require('../middleware/validation');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/forgot-password', forgotPassword);

router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;
