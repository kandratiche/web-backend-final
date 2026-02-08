const Course = require('../models/Course');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.createCourse = async (req, res, next) => {
  try {
    req.body.instructor = req.user._id;
    req.body.instructorName = req.user.username;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    let query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.level) {
      query.level = req.query.level;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
      query.isPublished = true;
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    
    let sortBy = '-createdAt';
    if (req.query.sort === 'price-low') sortBy = 'price';
    if (req.query.sort === 'price-high') sortBy = '-price';
    if (req.query.sort === 'rating') sortBy = '-rating';
    if (req.query.sort === 'popular') sortBy = '-enrolledStudents';

    const courses = await Course.find(query)
      .populate('instructor', 'username firstName lastName profileImage')
      .sort(sortBy)
      .limit(limit)
      .skip(startIndex);

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'username firstName lastName profileImage bio')
      .populate('reviews.user', 'username profileImage');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isPublished) {
      if (!req.user || 
          (req.user.role !== 'admin' && 
           req.user.role !== 'moderator' && 
           course.instructor._id.toString() !== req.user._id.toString())) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'moderator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    req.body.lastUpdated = Date.now();

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'Cannot enroll in unpublished course'
      });
    }

    const user = await User.findById(req.user._id);
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    if (course.isPremium && req.user.role === 'user') {
      return res.status(403).json({
        success: false,
        message: 'Premium membership required to enroll in this course'
      });
    }

    user.enrolledCourses.push(course._id);
    await user.save();

    course.enrolledStudents.push(user._id);
    await course.save();

    try {
      await sendEmail({
        email: user.email,
        subject: `Successfully Enrolled in ${course.title}`,
        message: `Congratulations! You have successfully enrolled in "${course.title}".\n\nStart learning today and achieve your goals!\n\nBest regards,\nThe Learning Platform Team`,
        html: `
          <h2>Enrollment Confirmation</h2>
          <p>Congratulations! You have successfully enrolled in <strong>${course.title}</strong>.</p>
          <p>Start learning today and achieve your goals!</p>
          <p>Best regards,<br>The Learning Platform Team</p>
        `
      });
    } catch (emailError) {
      console.error('Enrollment email failed:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

exports.unenrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    user.enrolledCourses = user.enrolledCourses.filter(
      courseId => courseId.toString() !== course._id.toString()
    );
    await user.save();

    course.enrolledStudents = course.enrolledStudents.filter(
      userId => userId.toString() !== user._id.toString()
    );
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    next(error);
  }
};

exports.completeCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: 'Must be enrolled to complete course'
      });
    }

    if (user.completedCourses.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: 'Course already completed'
      });
    }

    user.completedCourses.push(course._id);
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: `Congratulations on Completing ${course.title}!`,
        message: `Congratulations ${user.firstName || user.username}!\n\nYou have successfully completed "${course.title}".\n\n${course.completionCertificate ? 'Your certificate is now available in your profile.' : ''}\n\nKeep up the great work!\n\nBest regards,\nThe Learning Platform Team`,
        html: `
          <h2>Course Completion</h2>
          <p>Congratulations ${user.firstName || user.username}!</p>
          <p>You have successfully completed <strong>${course.title}</strong>.</p>
          ${course.completionCertificate ? '<p>Your certificate is now available in your profile.</p>' : ''}
          <p>Keep up the great work!</p>
          <p>Best regards,<br>The Learning Platform Team</p>
        `
      });
    } catch (emailError) {
      console.error('Completion email failed:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Course marked as completed',
      certificateAvailable: course.completionCertificate
    });
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: 'Must be enrolled to review course'
      });
    }

    const alreadyReviewed = course.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }

    const review = {
      user: req.user._id,
      username: req.user.username,
      rating: Number(rating),
      comment
    };

    course.reviews.push(review);
    course.calculateAverageRating();
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

exports.togglePublish = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'moderator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish/unpublish this course'
      });
    }

    course.isPublished = !course.isPublished;
    if (course.isPublished && !course.publishedDate) {
      course.publishedDate = Date.now();
    }
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      data: course
    });
  } catch (error) {
    next(error);
  }
};
