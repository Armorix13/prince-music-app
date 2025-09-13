# Test Signup API

## Test Case 1: Basic Signup (Required Fields Only)
```bash
curl -X POST http://localhost:7000/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "countryCode": "+1",
    "phoneNumber": "1234567890",
    "dob": "1990-01-01",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "deviceType": "android",
    "deviceToken": "device_token_123"
  }'
```

## Test Case 2: Signup with Optional Fields
```bash
curl -X POST http://localhost:7000/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "countryCode": "+1",
    "phoneNumber": "0987654321",
    "dob": "1995-05-15",
    "email": "jane@example.com",
    "password": "SecurePass123!",
    "deviceType": "ios",
    "deviceToken": "device_token_456",
    "socialType": "normal",
    "profileImage": "https://example.com/profile.jpg",
    "theme": "dark"
  }'
```

## Test Case 3: Social Signup
```bash
curl -X POST http://localhost:7000/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Bob",
    "lastName": "Wilson",
    "countryCode": "+1",
    "phoneNumber": "5555555555",
    "dob": "1988-12-25",
    "email": "bob@example.com",
    "password": "SecurePass123!",
    "deviceType": "web",
    "deviceToken": "device_token_789",
    "socialType": "google",
    "socialId": "google_user_123",
    "profileImage": "https://lh3.googleusercontent.com/profile.jpg"
  }'
```

## Expected Response Format
```json
{
  "success": true,
  "message": "User created successfully. Please verify your email with the OTP sent.",
  "data": {
    "user": {
      "id": "user_id_here",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "countryCode": "+1",
      "phoneNumber": "1234567890",
      "dob": "1990-01-01T00:00:00.000Z",
      "socialType": "normal",
      "deviceType": "android",
      "isEmailVerified": false,
      "isOtpVerified": false,
      "loginAt": "2024-01-01T10:00:00.000Z",
      "createdAt": "2024-01-01T10:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    },
    "otp": {
      "expiresAt": "2024-01-01T10:10:00.000Z",
      "expiresIn": "10 minutes"
    }
  }
}
```

## Error Cases to Test

### Missing Required Field
```bash
curl -X POST http://localhost:7000/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "countryCode": "+1",
    "phoneNumber": "1234567890",
    "dob": "1990-01-01",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Invalid Email Format
```bash
curl -X POST http://localhost:7000/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "countryCode": "+1",
    "phoneNumber": "1234567890",
    "dob": "1990-01-01",
    "email": "invalid-email",
    "password": "SecurePass123!",
    "deviceType": "android",
    "deviceToken": "device_token_123"
  }'
```

### Weak Password
```bash
curl -X POST http://localhost:7000/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "countryCode": "+1",
    "phoneNumber": "1234567890",
    "dob": "1990-01-01",
    "email": "john@example.com",
    "password": "123",
    "deviceType": "android",
    "deviceToken": "device_token_123"
  }'
```
