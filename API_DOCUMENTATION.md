# Prince Music App API Documentation

## Authentication Endpoints

### 1. User Signup
**POST** `/api/v1/users/signup`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "countryCode": "+1",
  "phoneNumber": "1234567890",
  "dob": "1990-01-01",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "deviceType": "android",
  "deviceToken": "device_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully. Please verify your email with the OTP sent.",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isEmailVerified": false,
      "isOtpVerified": false
    },

"otp": {
      "expiresAt": "2024-01-01T10:10:00Z",
      "expiresIn": "10 minutes"
    }
  }
}
```

### 2. User Login
**POST** `/api/v1/users/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "deviceType": "android",
  "deviceToken": "device_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isEmailVerified": true,
      "isOtpVerified": true
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
}
```

### 3. Account Verification
**POST** `/api/v1/users/verify-account`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account verified successfully",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isEmailVerified": true,
      "isOtpVerified": true
    }
  }
}
```

### 4. Forgot Password
**POST** `/api/v1/users/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset OTP sent successfully",
  "data": {
    "email": "john@example.com",
    "expiresAt": "2024-01-01T10:10:00Z",
    "expiresIn": "10 minutes"
  }
}
```

### 5. Verify Password Reset OTP
**POST** `/api/v1/users/verify-password-reset`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully. You can now reset your password.",
  "data": {
    "email": "john@example.com",
    "verified": true
  }
}
```

### 6. Reset Password
**POST** `/api/v1/users/reset-password`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully. Please login with your new password."
}
```

## Protected Endpoints (Require Authentication)

### 7. Get User Profile
**GET** `/api/v1/users/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "countryCode": "+1",
      "phoneNumber": "1234567890",
      "dob": "1990-01-01T00:00:00Z",
      "deviceType": "android",
      "isEmailVerified": true,
      "isOtpVerified": true
    }
  }
}
```

### 8. Update User Profile
**PUT** `/api/v1/users/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "deviceType": "ios",
  "deviceToken": "new_device_token"
}
```

### 9. Logout
**POST** `/api/v1/users/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 10. Delete Account
**DELETE** `/api/v1/users/account`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "password": "SecurePass123!"
}
```

## Additional Endpoints

### 11. Refresh Token
**POST** `/api/v1/users/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

### 12. Social Login
**POST** `/api/v1/users/social-login`

**Request Body:**
```json
{
  "socialType": "google",
  "socialId": "google_user_id",
  "email": "user@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "deviceType": "android",
  "deviceToken": "device_token"
}
```

## Course Management Endpoints

### 1. Create Course
**POST** `/api/v1/courses`
**Authentication Required:** Yes

**Request Body:**
```json
{
  "title": "Introduction to Music Theory",
  "description": "Learn the fundamentals of music theory including scales, chords, and harmony.",
  "courseType": 1,
  "price": 49.99,
  "benefits": [
    "Understand musical scales and modes",
    "Learn chord progressions",
    "Master rhythm and timing",
    "Apply theory to practical music"
  ],
  "category": "Music Theory",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "instructor": "instructor_id_here",
  "duration": "4 weeks",
  "level": "beginner",
  "tags": ["music", "theory", "beginner"],
  "courseContent": [
    {
      "title": "Introduction to Notes",
      "description": "Understanding musical notes and their relationships",
      "videoUrl": "https://example.com/video1.mp4",
      "duration": "15 minutes",
      "order": 1,
      "isPreview": true
    }
  ],
  "prerequisites": ["Basic understanding of music"],
  "learningOutcomes": [
    "Identify different musical scales",
    "Understand chord construction",
    "Apply music theory to composition"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "course": {
      "id": "course_id",
      "title": "Introduction to Music Theory",
      "description": "Learn the fundamentals of music theory...",
      "courseType": 1,
      "courseTypeName": "paid",
      "price": 49.99,
      "benefits": ["Understand musical scales..."],
      "category": "Music Theory",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "instructor": {
        "id": "instructor_id",
        "name": "John Doe",
        "profilePhoto": "https://example.com/profile.jpg"
      },
      "duration": "4 weeks",
      "level": "beginner",
      "tags": ["music", "theory", "beginner"],
      "enrollmentCount": 0,
      "rating": {
        "average": 0,
        "count": 0
      },
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  }
}
```

### 2. Get All Courses (Unified API with All Filters)
**GET** `/api/v1/courses`
**Authentication Required:** No

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Regex search term for title, description, category, or tags (case-insensitive)
- `courseType` (optional): Filter by course type (1 = paid, 2 = free)
- `category` (optional): Filter by category
- `level` (optional): Filter by level (beginner, intermediate, advanced)
- `sortBy` (optional): Sort field (createdAt, title, price, enrollmentCount, rating)
- `sortOrder` (optional): Sort order (asc, desc)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `tags` (optional): Comma-separated tags to filter by
- `isActive` (optional): Filter by active status (true/false)

**Examples:**
- Basic: `/api/v1/courses?page=1&limit=10`
- Regex search: `/api/v1/courses?search=guitar&page=1&limit=10`
- Partial search: `/api/v1/courses?search=^begin&page=1&limit=10` (courses starting with "begin")
- Pattern search: `/api/v1/courses?search=.*theory.*&page=1&limit=10` (courses containing "theory")
- Filter paid courses: `/api/v1/courses?courseType=1&page=1&limit=10`
- Filter by category: `/api/v1/courses?category=Guitar&page=1&limit=10`
- Filter by level: `/api/v1/courses?level=beginner&page=1&limit=10`
- Price range: `/api/v1/courses?minPrice=20&maxPrice=50&page=1&limit=10`
- Multiple filters: `/api/v1/courses?search=guitar&courseType=1&level=beginner&minPrice=20&maxPrice=100&page=1&limit=10`
- Sort by price: `/api/v1/courses?sortBy=price&sortOrder=asc&page=1&limit=10`
- Filter by tags: `/api/v1/courses?tags=music,theory,beginner&page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "allCourses": {
      "courses": [
        {
          "id": "course_id",
          "title": "Beginner Guitar Course",
          "description": "Learn guitar from scratch...",
          "courseType": 1,
          "courseTypeName": "paid",
          "price": 29.99,
          "category": "Guitar",
          "thumbnail": "https://example.com/guitar.jpg",
          "duration": "6 weeks",
          "level": "beginner",
          "enrollmentCount": 150,
          "rating": {
            "average": 4.5,
            "count": 25
          }
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalCourses": 50,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    },
    "paidCourses": [
      {
        "id": "paid_course_1",
        "title": "Advanced Music Theory",
        "courseType": 1,
        "courseTypeName": "paid",
        "price": 49.99,
        "category": "Music Theory",
        "thumbnail": "https://example.com/theory.jpg",
        "enrollmentCount": 75,
        "rating": {
          "average": 4.2,
          "count": 12
        }
      },
      {
        "id": "paid_course_2",
        "title": "Professional Guitar Course",
        "courseType": 1,
        "courseTypeName": "paid",
        "price": 79.99,
        "category": "Guitar",
        "thumbnail": "https://example.com/guitar.jpg",
        "enrollmentCount": 120,
        "rating": {
          "average": 4.7,
          "count": 18
        }
      }
    ],
    "freeCourses": [
      {
        "id": "free_course_1",
        "title": "Free Piano Basics",
        "courseType": 2,
        "courseTypeName": "free",
        "price": 0,
        "category": "Piano",
        "thumbnail": "https://example.com/piano.jpg",
        "enrollmentCount": 200,
        "rating": {
          "average": 4.0,
          "count": 35
        }
      },
      {
        "id": "free_course_2",
        "title": "Music Theory Introduction",
        "courseType": 2,
        "courseTypeName": "free",
        "price": 0,
        "category": "Music Theory",
        "thumbnail": "https://example.com/theory-free.jpg",
        "enrollmentCount": 150,
        "rating": {
          "average": 4.3,
          "count": 22
        }
      }
    ]
  }
}
```

**Note:** 
- `allCourses`: Applies all filters including search, pagination, category, level, etc.
- `paidCourses`: Returns ALL paid courses (no search, no pagination) but respects other filters like category, level
- `freeCourses`: Returns ALL free courses (no search, no pagination) but respects other filters like category, level

### 3. Get Course by ID
**GET** `/api/v1/courses/:courseId`
**Authentication Required:** No

**Response:**
```json
{
  "success": true,
  "message": "Course retrieved successfully",
  "data": {
    "course": {
      "id": "course_id",
      "title": "Introduction to Music Theory",
      "description": "Learn the fundamentals...",
      "courseType": 1,
      "courseTypeName": "paid",
      "price": 49.99,
      "benefits": ["Understand musical scales..."],
      "category": "Music Theory",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "duration": "4 weeks",
      "level": "beginner",
      "tags": ["music", "theory", "beginner"],
      "courseContent": [
        {
          "title": "Introduction to Notes",
          "description": "Understanding musical notes...",
          "videoUrl": "https://example.com/video1.mp4",
          "duration": "15 minutes",
          "order": 1,
          "isPreview": true
        }
      ],
      "prerequisites": ["Basic understanding of music"],
      "learningOutcomes": ["Identify different musical scales..."],
      "enrollmentCount": 75,
      "rating": {
        "average": 4.2,
        "count": 12
      }
    },
    "similarCourses": [
      {
        "id": "similar_course_id",
        "title": "Advanced Music Theory",
        "category": "Music Theory",
        "price": 79.99,
        "thumbnail": "https://example.com/advanced.jpg",
        "enrollmentCount": 45,
        "rating": {
          "average": 4.7,
          "count": 8
        }
      }
    ]
  }
}
```

### 4. Update Course
**PUT** `/api/v1/courses/:courseId`
**Authentication Required:** Yes

**Request Body:** (Same as create course, all fields optional)

**Response:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "course": {
      "id": "course_id",
      "title": "Updated Course Title",
      "description": "Updated description...",
      "courseType": 1,
      "price": 59.99,
      "updatedAt": "2024-01-01T11:00:00Z"
    }
  }
}
```

### 5. Delete Course
**DELETE** `/api/v1/courses/:courseId`
**Authentication Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

### 6. Get Course Categories
**GET** `/api/v1/courses/categories`
**Authentication Required:** No

**Response:**
```json
{
  "success": true,
  "message": "Course categories retrieved successfully",
  "data": {
    "categories": [
      "Music Theory",
      "Guitar",
      "Piano",
      "Drums",
      "Vocals",
      "Songwriting",
      "Production"
    ]
  }
}
```

## Error Responses

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"],
  "timestamp": "2024-01-01T10:00:00Z"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (Email/Phone already exists)
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Login/OTP endpoints**: 5 requests per 15 minutes
- **Password reset**: 3 requests per 15 minutes

## Environment Variables Required

```env
# Database
MONGO_URI=mongodb://localhost:27017/prince-music-app

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# SMTP (Optional - for email OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```
