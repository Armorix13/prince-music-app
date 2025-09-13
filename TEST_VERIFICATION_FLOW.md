# Test Account Verification Flow

## ✅ **Fixed Issues:**

### 1. **Login Requires Email Verification**
- ✅ Users cannot login without verifying their email
- ✅ Clear error message: "Please verify your email before logging in"

### 2. **Signup Allows Re-registration for Unverified Users**
- ✅ Unverified users can register again with the same email
- ✅ Verified users get proper error: "User with this email already exists and is verified"

### 3. **OTP Request Checks Email Verification**
- ✅ Only verified users can request OTP for other purposes
- ✅ Unverified users can only request email verification OTP

---

## 🧪 **Test Scenarios:**

### **Test 1: Complete Signup → Verify → Login Flow**

**Step 1: Signup**
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

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully. Please verify your email with the OTP sent.",
  "data": {
    "user": {
      "isEmailVerified": false,
      "isOtpVerified": false
    },
    "otp": {
      "expiresAt": "2024-01-01T10:10:00.000Z",
      "expiresIn": "10 minutes"
    }
  }
}
```

**Step 2: Try to Login (Should Fail)**
```bash
curl -X POST http://localhost:7000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "deviceType": "android",
    "deviceToken": "device_token_123"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Please verify your email before logging in. Check your email for the verification OTP."
}
```

**Step 3: Verify Account**
```bash
curl -X POST http://localhost:7000/api/v1/users/verify-account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

**Step 4: Login (Should Succeed)**
```bash
curl -X POST http://localhost:7000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "deviceType": "android",
    "deviceToken": "device_token_123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
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

---

### **Test 2: Re-registration for Unverified Users**

**Step 1: Signup (First Time)**
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
    "deviceToken": "device_token_456"
  }'
```

**Step 2: Try to Signup Again (Should Succeed - Replaces Unverified User)**
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
    "password": "NewSecurePass123!",
    "deviceType": "ios",
    "deviceToken": "device_token_456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully. Please verify your email with the OTP sent."
}
```

---

### **Test 3: Verified User Cannot Re-register**

**Step 1: Signup and Verify**
```bash
# Signup
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
    "deviceToken": "device_token_789"
  }'

# Verify (use OTP from email)
curl -X POST http://localhost:7000/api/v1/users/verify-account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "otp": "123456"
  }'
```

**Step 2: Try to Signup Again (Should Fail)**
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
    "password": "NewSecurePass123!",
    "deviceType": "web",
    "deviceToken": "device_token_789"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "User with this email already exists and is verified"
}
```

---

### **Test 4: OTP Request Verification**

**Step 1: Signup (Unverified User)**
```bash
curl -X POST http://localhost:7000/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "countryCode": "+1",
    "phoneNumber": "1111111111",
    "dob": "1992-03-10",
    "email": "alice@example.com",
    "password": "SecurePass123!",
    "deviceType": "android",
    "deviceToken": "device_token_111"
  }'
```

**Step 2: Try to Request Password Reset OTP (Should Fail)**
```bash
curl -X POST http://localhost:7000/api/v1/users/request-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "otpFor": "resetPassword"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Please verify your email first before requesting OTP for other purposes"
}
```

**Step 3: Request Email Verification OTP (Should Succeed)**
```bash
curl -X POST http://localhost:7000/api/v1/users/request-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "otpFor": "emailVerification"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otp": {
      "expiresAt": "2024-01-01T10:10:00.000Z",
      "expiresIn": "10 minutes"
    }
  }
}
```

---

## ✅ **Summary of Fixes:**

1. **Login Security**: Users must verify email before login
2. **Signup Flexibility**: Unverified users can re-register, verified users cannot
3. **OTP Security**: Only verified users can request OTP for non-verification purposes
4. **Clear Error Messages**: Users get helpful error messages explaining what to do

The account verification flow is now secure and user-friendly! 🎉
