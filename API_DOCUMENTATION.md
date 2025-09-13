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
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
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

## Error Responses

All endpoints return consistent error responses:

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
