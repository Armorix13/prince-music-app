# Enrollment System API Documentation

## Overview
The enrollment system allows users to enroll in both free and paid courses. Enrollments automatically expire after 3 months and are removed from the user's course list.

## Key Features
- ✅ **Auto-expiration**: Courses automatically removed after 3 months
- ✅ **Both Free & Paid**: Support for both course types
- ✅ **Progress Tracking**: Track course completion and progress
- ✅ **No Pagination**: All enrolled courses returned at once
- ✅ **Automatic Cleanup**: Expired enrollments automatically removed

---

## API Endpoints

### 1. Enroll in Course
**POST** `/api/v1/enrollments/enroll/:courseId`
**Authentication Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "data": {
    "enrollment": {
      "id": "enrollment_id",
      "course": {
        "id": "course_id",
        "title": "Beginner Guitar Fundamentals",
        "description": "Learn guitar from absolute scratch...",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "duration": "6 weeks",
        "level": "beginner",
        "category": "Guitar",
        "courseType": 1,
        "price": 39.99
      },
      "enrolledAt": "2024-01-01T10:00:00Z",
      "expiresAt": "2024-04-01T10:00:00Z",
      "enrollmentType": "paid",
      "daysRemaining": 90,
      "isExpired": false
    }
  }
}
```

### 2. Get My Courses
**GET** `/api/v1/enrollments/my-courses`
**Authentication Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "My courses retrieved successfully",
  "data": {
    "courses": [
      {
        "enrollmentId": "enrollment_id_1",
        "enrolledAt": "2024-01-01T10:00:00Z",
        "expiresAt": "2024-04-01T10:00:00Z",
        "daysRemaining": 90,
        "isExpired": false,
        "enrollmentType": "free",
        "progress": {
          "completedLessons": [],
          "lastAccessedAt": "2024-01-01T10:00:00Z",
          "completionPercentage": 0
        },
        "course": {
          "id": "course_id_1",
          "title": "Free Piano Basics",
          "description": "Learn piano basics completely free!",
          "thumbnail": "https://example.com/piano.jpg",
          "duration": "2 weeks",
          "level": "beginner",
          "category": "Piano",
          "courseType": 2,
          "price": 0
        }
      },
      {
        "enrollmentId": "enrollment_id_2",
        "enrolledAt": "2024-01-01T10:00:00Z",
        "expiresAt": "2024-04-01T10:00:00Z",
        "daysRemaining": 90,
        "isExpired": false,
        "enrollmentType": "paid",
        "progress": {
          "completedLessons": ["lesson_id_1", "lesson_id_2"],
          "lastAccessedAt": "2024-01-15T10:00:00Z",
          "completionPercentage": 33
        },
        "course": {
          "id": "course_id_2",
          "title": "Beginner Guitar Fundamentals",
          "description": "Learn guitar from absolute scratch...",
          "thumbnail": "https://example.com/guitar.jpg",
          "duration": "6 weeks",
          "level": "beginner",
          "category": "Guitar",
          "courseType": 1,
          "price": 39.99
        }
      }
    ],
    "totalEnrollments": 2,
    "freeCount": 1,
    "paidCount": 1
  }
}
```

### 3. Get Enrollment Details
**GET** `/api/v1/enrollments/course/:courseId`
**Authentication Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Enrollment details retrieved successfully",
  "data": {
    "enrollment": {
      "id": "enrollment_id",
      "course": {
        "id": "course_id",
        "title": "Beginner Guitar Fundamentals",
        "description": "Learn guitar from absolute scratch...",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "duration": "6 weeks",
        "level": "beginner",
        "category": "Guitar",
        "courseType": 1,
        "price": 39.99,
        "courseContent": [
          {
            "title": "Guitar Basics and Setup",
            "description": "Introduction to guitar parts...",
            "videoUrl": "https://example.com/video1.mp4",
            "duration": "12 minutes",
            "order": 1,
            "isPreview": true
          }
        ]
      },
      "enrolledAt": "2024-01-01T10:00:00Z",
      "expiresAt": "2024-04-01T10:00:00Z",
      "enrollmentType": "paid",
      "daysRemaining": 90,
      "isExpired": false,
      "progress": {
        "completedLessons": ["lesson_id_1"],
        "lastAccessedAt": "2024-01-15T10:00:00Z",
        "completionPercentage": 16
      },
      "paymentDetails": {
        "amount": 39.99,
        "paymentMethod": null,
        "transactionId": null,
        "paymentDate": null
      }
    }
  }
}
```

### 4. Update Course Progress
**PUT** `/api/v1/enrollments/course/:courseId/progress`
**Authentication Required:** Yes

**Request Body:**
```json
{
  "completedLessonId": "lesson_id_3",
  "completionPercentage": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course progress updated successfully",
  "data": {
    "progress": {
      "completedLessons": ["lesson_id_1", "lesson_id_2", "lesson_id_3"],
      "lastAccessedAt": "2024-01-20T10:00:00Z",
      "completionPercentage": 50
    }
  }
}
```

### 5. Unenroll from Course
**DELETE** `/api/v1/enrollments/unenroll/:courseId`
**Authentication Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Successfully unenrolled from course"
}
```

### 6. Get Enrollment Statistics
**GET** `/api/v1/enrollments/stats`
**Authentication Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Enrollment statistics retrieved successfully",
  "data": {
    "totalEnrollments": 5,
    "activeEnrollments": 3,
    "expiredEnrollments": 2,
    "freeEnrollments": 2,
    "paidEnrollments": 3
  }
}
```

### 7. Cleanup Expired Enrollments (Admin)
**POST** `/api/v1/enrollments/admin/cleanup-expired`
**Authentication Required:** Yes (Admin)

**Response:**
```json
{
  "success": true,
  "message": "Cleaned up 5 expired enrollments",
  "data": {
    "removedCount": 5
  }
}
```

---

## Automatic Course Removal

### How It Works:
1. **Enrollment Creation**: When a user enrolls, `expiresAt` is set to 3 months from enrollment date
2. **Automatic Cleanup**: Expired enrollments are automatically marked as inactive
3. **API Filtering**: APIs only return active, non-expired enrollments
4. **Manual Cleanup**: Admin can trigger cleanup via API endpoint

### Expiration Logic:
```javascript
// Enrollment expires 3 months after enrollment
expiresAt: moment().add(3, 'months').toDate()

// Check if expired
isExpired: moment().isAfter(moment(expiresAt))

// Days remaining
daysRemaining: Math.max(0, moment(expiresAt).diff(moment(), 'days'))
```

---

## Error Responses

### Course Not Found
```json
{
  "success": false,
  "message": "Course not found",
  "error": "Course not found"
}
```

### Already Enrolled
```json
{
  "success": false,
  "message": "You are already enrolled in this course",
  "error": "You are already enrolled in this course"
}
```

### Enrollment Not Found
```json
{
  "success": false,
  "message": "Enrollment not found",
  "error": "Enrollment not found"
}
```

---

## Postman Collection Examples

### Enroll in Course
```json
POST /api/v1/enrollments/enroll/64f8a1b2c3d4e5f6a7b8c9d0
Headers: Authorization: Bearer {{authToken}}
```

### Get My Courses
```json
GET /api/v1/enrollments/my-courses
Headers: Authorization: Bearer {{authToken}}
```

### Update Progress
```json
PUT /api/v1/enrollments/course/64f8a1b2c3d4e5f6a7b8c9d0/progress
Headers: Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "completedLessonId": "lesson_id_3",
  "completionPercentage": 50
}
```

---

## Key Features Summary

- ✅ **Auto-expiration**: Courses automatically removed after 3 months
- ✅ **Both Free & Paid**: Support for both course types
- ✅ **Progress Tracking**: Track completion and progress
- ✅ **No Pagination**: All courses returned at once
- ✅ **Automatic Cleanup**: Expired enrollments automatically removed
- ✅ **Statistics**: Get enrollment statistics
- ✅ **Manual Unenroll**: Users can manually unenroll
- ✅ **Admin Cleanup**: Admin can trigger cleanup
- ✅ **Moment.js Integration**: Precise date handling
- ✅ **Comprehensive Validation**: Input validation for all endpoints
