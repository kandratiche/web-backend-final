const { body, validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

exports.registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

exports.loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

exports.profileUpdateValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters')
];

exports.courseValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ max: 200 })
    .withMessage('Course title cannot exceed 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Course category is required')
    .isIn([
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Business',
      'Design',
      'Marketing',
      'Photography',
      'Music',
      'Language Learning',
      'Personal Development',
      'Other'
    ])
    .withMessage('Invalid course category'),
  
  body('level')
    .notEmpty()
    .withMessage('Course level is required')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Course level must be Beginner, Intermediate, or Advanced'),
  
  body('duration')
    .isFloat({ min: 0.5, max: 1000 })
    .withMessage('Duration must be between 0.5 and 1000 hours'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
];

exports.courseUpdateValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Course title cannot exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course description cannot be empty')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('category')
    .optional()
    .isIn([
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Business',
      'Design',
      'Marketing',
      'Photography',
      'Music',
      'Language Learning',
      'Personal Development',
      'Other'
    ])
    .withMessage('Invalid course category'),
  
  body('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Course level must be Beginner, Intermediate, or Advanced'),
  
  body('duration')
    .optional()
    .isFloat({ min: 0.5, max: 1000 })
    .withMessage('Duration must be between 0.5 and 1000 hours'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
];

exports.reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];
