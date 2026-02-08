# 🎓 Online Learning Platform (LearnHub)

A comprehensive full-stack online learning platform similar to Coursera, built with Node.js, Express, MongoDB, and vanilla JavaScript. Features include course management, user authentication, role-based access control, enrollment system, and email notifications.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Features Screenshots](#features-screenshots)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Advanced Features](#advanced-features)

## ✨ Features

### Core Features
- ✅ User authentication with JWT
- ✅ Role-based access control (User, Premium, Moderator, Admin)
- ✅ Course creation, browsing, and management
- ✅ Course enrollment and tracking system
- ✅ User profiles with course history
- ✅ Course reviews and ratings
- ✅ Email notifications (welcome, enrollment, completion)
- ✅ Responsive UI for mobile and desktop
- ✅ Search and filter courses
- ✅ Course completion certificates

### Advanced Features
- ✅ **RBAC (Role-Based Access Control)**: 4 user roles with hierarchical permissions
- ✅ **SMTP Email Integration**: SendGrid/Mailgun/Postmark support with HTML templates
- ✅ Premium content restrictions
- ✅ Form validation on both frontend and backend
- ✅ Global error handling middleware
- ✅ Rate limiting for API security
- ✅ Password hashing with bcrypt
- ✅ Secure HTTP-only cookies

## 🛠 Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB Atlas (Cloud Database)
- Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email services
- Express Validator for input validation

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- Responsive design (mobile-first)
- Fetch API for HTTP requests

**Security & Best Practices:**
- Environment variables (.env)
- Rate limiting
- Input validation
- XSS protection
- CORS configuration
- Secure password requirements

## 📁 Project Structure

```
online-learning-system/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── userController.js     # User management logic
│   └── courseController.js   # Course management logic
├── middleware/
│   ├── auth.js              # JWT authentication & RBAC middleware
│   ├── validation.js        # Input validation rules
│   └── errorHandler.js      # Global error handling
├── models/
│   ├── User.js              # User schema with roles
│   └── Course.js            # Course schema with reviews
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   ├── userRoutes.js        # User management endpoints
│   └── courseRoutes.js      # Course management endpoints
├── utils/
│   └── sendEmail.js         # Email service utility
├── public/
│   └── index.html           # Frontend application
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
├── package.json             # Dependencies
├── server.js                # Express server entry point
└── README.md                # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier available)
- Email service API key (SendGrid/Mailgun/Postmark) - optional for development

### Installation Steps

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB Atlas**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user
   - Whitelist your IP address (or use 0.0.0.0/0 for development)
   - Get your connection string

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learnhub?retryWrites=true&w=majority
   
   # JWT Secret (generate a random string)
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   
   # Email Configuration (optional for development)
   EMAIL_SERVICE=sendgrid
   EMAIL_API_KEY=your_api_key_here
   EMAIL_FROM=noreply@learnhub.com
   EMAIL_FROM_NAME=LearnHub
   
   FRONTEND_URL=http://localhost:3000
   ```

5. **Get Email Service API Key (Optional)**
   - **SendGrid**: Sign up at [sendgrid.com](https://sendgrid.com) → Get API key
   - **Mailgun**: Sign up at [mailgun.com](https://mailgun.com) → Get API key
   - **Postmark**: Sign up at [postmarkapp.com](https://postmarkapp.com) → Get API key
   - For development, the app will use Ethereal Email (test email service)

6. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

7. **Open the application**
   - Backend API: http://localhost:5000
   - Frontend: Open `public/index.html` in a browser or use a local server

8. **Update Frontend API URL (if needed)**
   - In `public/index.html`, change the `API_URL` variable if your backend runs on a different port:
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   ```

### First-Time Setup

After starting the server, you can:
1. Register a new account through the UI
2. The first user will have "user" role by default
3. To create an admin, you can use MongoDB Compass or Atlas to manually update a user's role to "admin"

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    ...
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}

Response: 200 OK
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": { user_object }
}
```

#### Logout
```http
GET /auth/logout
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset email sent"
}
```

### User Management Endpoints

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": { user_profile }
}
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "new_username",
  "email": "new@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "My bio"
}

Response: 200 OK
{
  "success": true,
  "data": { updated_user }
}
```

#### Get User's Enrolled Courses
```http
GET /users/my-courses
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "count": 5,
  "data": [ course_array ]
}
```

#### Get User Statistics
```http
GET /users/stats
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "totalEnrolled": 10,
    "totalCompleted": 3,
    "inProgress": 7,
    "role": "user",
    "memberSince": "2024-01-01"
  }
}
```

#### Get All Users (Admin/Moderator)
```http
GET /users
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "success": true,
  "count": 100,
  "data": [ users_array ]
}
```

#### Update User Role (Admin Only)
```http
PUT /users/:userId/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "premium"  // user, premium, moderator, admin
}

Response: 200 OK
```

### Course Management Endpoints

#### Get All Courses (Public)
```http
GET /courses?category=Web Development&level=Beginner&sort=-rating&page=1&limit=10

Query Parameters:
- category: Filter by category
- level: Beginner, Intermediate, Advanced
- minPrice, maxPrice: Price range
- search: Search in title and description
- sort: -createdAt, price, -price, -rating
- page: Page number
- limit: Items per page

Response: 200 OK
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [ courses_array ]
}
```

#### Get Single Course (Public)
```http
GET /courses/:courseId

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "course_id",
    "title": "Complete Web Development",
    "description": "...",
    "instructor": { instructor_details },
    "category": "Web Development",
    "level": "Beginner",
    "duration": 40,
    "price": 49.99,
    "rating": 4.7,
    "reviews": [ reviews_array ],
    ...
  }
}
```

#### Create Course (Premium/Moderator/Admin)
```http
POST /courses
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete Web Development Bootcamp",
  "description": "Learn web development from scratch",
  "category": "Web Development",
  "level": "Beginner",
  "duration": 40,
  "price": 49.99,
  "isPremium": false,
  "learningOutcomes": ["HTML", "CSS", "JavaScript"],
  "prerequisites": ["Basic computer knowledge"]
}

Response: 201 Created
{
  "success": true,
  "data": { created_course }
}
```

#### Update Course (Instructor/Admin/Moderator)
```http
PUT /courses/:courseId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "price": 59.99,
  ...
}

Response: 200 OK
```

#### Delete Course (Instructor/Admin)
```http
DELETE /courses/:courseId
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Course deleted successfully"
}
```

#### Enroll in Course
```http
POST /courses/:courseId/enroll
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Successfully enrolled in course",
  "data": { course_details }
}
```

#### Unenroll from Course
```http
DELETE /courses/:courseId/enroll
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Successfully unenrolled from course"
}
```

#### Mark Course as Complete
```http
POST /courses/:courseId/complete
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Course marked as completed",
  "certificateAvailable": true
}
```

#### Add Review to Course
```http
POST /courses/:courseId/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent course!"
}

Response: 201 Created
{
  "success": true,
  "message": "Review added successfully"
}
```

#### Publish/Unpublish Course
```http
PUT /courses/:courseId/publish
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Course published successfully"
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (not logged in)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## 📸 Features Screenshots

### 1. Home Page
**Description:** Clean, modern landing page with hero section showcasing the platform's value proposition. Features statistics dashboard showing total courses, instructors, and enrolled students. Displays featured/popular courses in an attractive grid layout with course thumbnails, ratings, and pricing.

**Key Elements:**
- Gradient hero section with call-to-action button
- Real-time statistics (courses, instructors, students)
- Featured courses carousel
- Responsive grid layout

### 2. User Registration
**Description:** Comprehensive registration form with real-time validation. Requires username (alphanumeric), valid email, and strong password (6+ characters with uppercase, lowercase, and number). Optional fields for first and last name. Shows inline validation errors and success messages.

**Key Features:**
- Client-side and server-side validation
- Password strength requirements
- Unique username/email check
- Welcome email sent upon registration
- Smooth modal interface

### 3. User Login
**Description:** Simple, secure login interface with email and password fields. Includes "Forgot Password" functionality and link to registration. Returns JWT token stored in localStorage and HTTP-only cookie for security.

**Key Features:**
- Secure authentication with JWT
- Remember me functionality via localStorage
- Password recovery option
- Error handling for invalid credentials

### 4. Course Catalog
**Description:** Comprehensive course browsing interface with advanced filtering and search. Shows all published courses with thumbnails, ratings, instructor names, categories, difficulty levels, and pricing. Supports pagination for large course lists.

**Filters Available:**
- Text search (title/description)
- Category dropdown
- Difficulty level (Beginner/Intermediate/Advanced)
- Price range
- Sort options (newest, price, rating, popularity)

### 5. Course Details Page
**Description:** Detailed course view showing complete information including description, instructor bio, syllabus, learning outcomes, prerequisites, student reviews, and enrollment statistics. Displays enrollment/unenrollment buttons based on user status.

**Information Displayed:**
- Course thumbnail and title
- Instructor details with bio
- Category, level, duration, price
- Rating and review count
- Detailed description
- Learning outcomes list
- Prerequisites
- Student reviews with ratings
- Enrollment button (or unenroll if enrolled)

### 6. Enrolled Courses / My Learning
**Description:** Personal dashboard showing all enrolled courses with progress tracking. Displays learning statistics including total enrolled, in-progress, and completed courses. Each course card shows progress status and action buttons.

**Features:**
- Progress statistics dashboard
- Enrolled courses grid view
- Mark as complete functionality
- Certificate availability indicator
- Unenroll option
- Filter by completion status

### 7. User Profile Page
**Description:** Comprehensive user profile management interface showing user information and editable profile form. Displays role badge, member since date, and enrollment statistics. Allows users to update username, email, name, and bio.

**Sections:**
- User information display (username, email, role, join date)
- Editable profile form
- Role badge with color coding
- Course creation section (for premium+ users)
- Account statistics

### 8. Create Course Form (Premium+ Users)
**Description:** Advanced course creation interface available to premium users, moderators, and admins. Multi-field form with validation for creating new courses. Includes all necessary course information fields.

**Fields:**
- Course title (max 200 chars)
- Description (max 2000 chars)
- Category dropdown (12 categories)
- Difficulty level
- Duration in hours
- Price (USD)
- Premium course checkbox
- Learning outcomes (optional)
- Prerequisites (optional)

### 9. Role-Based Access Control
**Description:** Demonstration of the 4-tier role system with different permissions and capabilities for each role type. Visual indicators (badges) show user roles throughout the interface.

**Role Hierarchy:**
1. **User (Blue badge):** Can browse and enroll in free courses, view profile
2. **Premium (Yellow badge):** All user features + create courses, access premium content
3. **Moderator (Purple badge):** All premium features + manage users, publish/unpublish any course
4. **Admin (Red badge):** Full system access, manage all users and courses, change user roles

### 10. Email Notifications
**Description:** Automated email system sending HTML-formatted emails for various events. Uses SendGrid/Mailgun/Postmark APIs with fallback to Ethereal Email for development.

**Email Types:**
- **Welcome Email:** Sent upon registration with platform introduction
- **Enrollment Confirmation:** Sent when enrolling in a course
- **Course Completion:** Sent with congratulations and certificate info
- **Password Reset:** Sent with secure reset token link (1-hour expiration)

**Email Features:**
- HTML templates with styling
- Platform branding
- Secure token-based password reset
- Environment-based configuration
- Error handling (app continues if email fails)

### 11. Responsive Mobile Design
**Description:** Fully responsive interface that adapts seamlessly to mobile devices, tablets, and desktops. Uses mobile-first CSS approach with breakpoints for optimal viewing on all screen sizes.

**Mobile Optimizations:**
- Collapsible navigation menu
- Stacked form layouts
- Touch-friendly buttons (minimum 44px)
- Optimized font sizes
- Single-column course grid on small screens
- Modal dialogs fit mobile viewports

### 12. Course Reviews and Ratings
**Description:** Interactive review system allowing enrolled students to rate courses (1-5 stars) and leave comments. Displays average rating and review count. Reviews include username, star rating, and comment text.

**Features:**
- 5-star rating system
- Text comments (max 500 chars)
- Average rating calculation
- Review count display
- One review per user per course
- Chronological review display

## 🌍 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learnhub?retryWrites=true&w=majority

# JWT Configuration (REQUIRED)
JWT_SECRET=generate_a_random_secure_string_here
JWT_EXPIRE=7d

# Email Service Configuration (OPTIONAL - uses Ethereal in development if not set)
EMAIL_SERVICE=sendgrid              # Options: sendgrid, mailgun, postmark
EMAIL_API_KEY=your_api_key_here
EMAIL_FROM=noreply@yourplatform.com
EMAIL_FROM_NAME=Learning Platform

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000         # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Required Variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Random secure string for JWT signing

### Optional Variables:
- Email configuration (uses test email service in development if not provided)
- Rate limiting (uses defaults if not provided)

## 🚀 Deployment

### Deploy to Render

1. **Create account on Render.com**

2. **Create new Web Service**
   - Connect your GitHub repository
   - Or upload your code

3. **Configure Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables**
   - Add all required variables from `.env`
   - Set `NODE_ENV=production`

5. **Deploy**
   - Render will automatically deploy your app
   - Get your deployment URL

### Deploy to Railway

1. **Create account on Railway.app**

2. **New Project from GitHub**
   - Connect repository
   - Railway auto-detects Node.js

3. **Add Environment Variables**
   - Go to Variables tab
   - Add all required variables

4. **Deploy**
   - Railway automatically deploys
   - Get your deployment URL

### Deploy to Replit

1. **Import from GitHub**
   - Create new Repl
   - Import from GitHub repository

2. **Configure Secrets**
   - Use Secrets tab (padlock icon)
   - Add environment variables

3. **Run**
   - Click Run button
   - Replit provides a URL

### Post-Deployment Steps

1. **Update Frontend API URL**
   - In `public/index.html`, update `API_URL` to your backend URL
   - Example: `const API_URL = 'https://your-app.onrender.com/api';`

2. **Update CORS Settings**
   - In `server.js`, update CORS origin to your frontend URL

3. **Test All Features**
   - Registration and login
   - Course creation and enrollment
   - Email notifications
   - Profile updates

4. **Create Admin User**
   - Register a user
   - Use MongoDB Atlas to manually set role to "admin"

## 🎯 Advanced Features Details

### Role-Based Access Control (RBAC)

The system implements a hierarchical 4-tier role system:

```javascript
// Role Hierarchy (higher number = more permissions)
{
  'user': 1,      // Basic access
  'premium': 2,   // Can create courses
  'moderator': 3, // Can manage content
  'admin': 4      // Full access
}
```

**Permissions Matrix:**

| Feature | User | Premium | Moderator | Admin |
|---------|------|---------|-----------|-------|
| Browse Courses | ✅ | ✅ | ✅ | ✅ |
| Enroll in Free Courses | ✅ | ✅ | ✅ | ✅ |
| Enroll in Premium Courses | ❌ | ✅ | ✅ | ✅ |
| Create Courses | ❌ | ✅ | ✅ | ✅ |
| Edit Own Courses | ❌ | ✅ | ✅ | ✅ |
| Edit Any Course | ❌ | ❌ | ✅ | ✅ |
| Delete Own Courses | ❌ | ✅ | ✅ | ✅ |
| Delete Any Course | ❌ | ❌ | ❌ | ✅ |
| View All Users | ❌ | ❌ | ✅ | ✅ |
| Change User Roles | ❌ | ❌ | ❌ | ✅ |
| Publish/Unpublish Courses | ❌ | Own | Any | Any |

### Email Service Integration

Supports multiple SMTP providers:

**SendGrid Setup:**
```env
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

**Mailgun Setup:**
```env
EMAIL_SERVICE=mailgun
EMAIL_API_KEY=your-mailgun-api-key
EMAIL_USERNAME=postmaster@yourdomain.com
EMAIL_FROM=noreply@yourdomain.com
```

**Postmark Setup:**
```env
EMAIL_SERVICE=postmark
EMAIL_API_KEY=your-postmark-server-token
EMAIL_FROM=noreply@yourdomain.com
```

**Email Templates Included:**
- Welcome email (HTML formatted)
- Enrollment confirmation
- Course completion with certificate notification
- Password reset with secure token

**Development Mode:**
- Automatically uses Ethereal Email (fake SMTP)
- Logs preview URLs to console
- No actual emails sent

### Security Features

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Minimum 6 characters
   - Requires uppercase, lowercase, and number
   - Never stored in plain text

2. **JWT Authentication**
   - Secure token generation
   - 7-day expiration
   - Stored in HTTP-only cookies
   - Also available in localStorage for frontend

3. **Input Validation**
   - Express Validator on all inputs
   - Client-side validation
   - XSS protection
   - SQL injection prevention (NoSQL)

4. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Prevents brute force attacks
   - Configurable limits

5. **CORS Configuration**
   - Whitelist specific origins
   - Credentials support
   - Secure headers

## 🧪 Testing the Application

### Manual Testing Checklist

**Authentication:**
- ✅ Register new user with valid data
- ✅ Register with invalid data (check validation)
- ✅ Login with correct credentials
- ✅ Login with incorrect credentials
- ✅ Access protected routes without token
- ✅ Logout functionality

**User Management:**
- ✅ View profile
- ✅ Update profile information
- ✅ Update with invalid data
- ✅ View enrolled courses
- ✅ View user statistics

**Course Management:**
- ✅ Browse all courses
- ✅ Filter by category
- ✅ Filter by level
- ✅ Search courses
- ✅ View course details
- ✅ Create course (as premium user)
- ✅ Create course (as regular user - should fail)
- ✅ Update own course
- ✅ Delete own course
- ✅ Enroll in course
- ✅ Unenroll from course
- ✅ Mark course as complete
- ✅ Add course review
- ✅ Publish/unpublish course

**Role-Based Access:**
- ✅ Regular user accessing premium content
- ✅ Premium user creating courses
- ✅ Moderator managing content
- ✅ Admin changing user roles
- ✅ Admin viewing all users

**Email Notifications:**
- ✅ Welcome email on registration
- ✅ Enrollment confirmation email
- ✅ Course completion email
- ✅ Password reset email

## 📝 Development Notes

### Database Collections

**Users Collection:**
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (user/premium/moderator/admin),
  firstName: String,
  lastName: String,
  bio: String,
  enrolledCourses: [ObjectId],
  completedCourses: [ObjectId],
  createdAt: Date
}
```

**Courses Collection:**
```javascript
{
  title: String,
  description: String,
  instructor: ObjectId (ref: User),
  instructorName: String,
  category: String,
  level: String (Beginner/Intermediate/Advanced),
  duration: Number,
  price: Number,
  isPremium: Boolean,
  enrolledStudents: [ObjectId],
  rating: Number,
  reviews: [{
    user: ObjectId,
    username: String,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  isPublished: Boolean,
  createdAt: Date
}
```

### API Response Format

All API responses follow this consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]  // Optional validation errors
}
```

## 🤝 Contributing

This is an educational project. Feel free to fork and modify for your learning purposes.

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 👨‍💻 Support

For issues or questions:
1. Check the API documentation above
2. Review the error messages in the console
3. Ensure all environment variables are set correctly
4. Verify MongoDB Atlas connection string is correct
5. Check that the frontend API_URL matches your backend URL

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Built with ❤️ for learning and education**

Last Updated: February 2026
