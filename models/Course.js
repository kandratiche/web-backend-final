const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true,
    maxlength: [200, 'Course title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a course category'],
    enum: [
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
    ]
  },
  level: {
    type: String,
    required: [true, 'Please specify course level'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide course duration in hours']
  },
  price: {
    type: Number,
    required: [true, 'Please provide course price'],
    min: [0, 'Price cannot be negative']
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  thumbnail: {
    type: String,
    default: 'default-course.jpg'
  },
  syllabus: [{
    module: {
      type: String,
      required: true
    },
    topics: [String],
    duration: Number
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  numberOfReviews: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedDate: {
    type: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  completionCertificate: {
    type: Boolean,
    default: true
  },
  prerequisites: [String],
  learningOutcomes: [String],
  language: {
    type: String,
    default: 'English'
  }
}, {
  timestamps: true
});

courseSchema.index({ title: 'text', description: 'text', category: 'text' });

courseSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numberOfReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = (sum / this.reviews.length).toFixed(1);
    this.numberOfReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Course', courseSchema);
