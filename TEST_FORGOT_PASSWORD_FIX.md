# Test Forgot Password API Fix

## ✅ **Fixed Issue:**

### **Forgot Password API Now Requires Email Verification**
- **Problem**: Unverified users could request password reset OTP
- **Fix**: Added email verification check in `requestPasswordResetOTP` controller
- **Result**: 
  - ✅ **Verified users** → Can request password reset OTP
  - ❌ **Unverified users** → Get error: *"Please verify your email first before requesting password reset"*

---

## 🧪 **Test Scenarios:**

### **Test 1: Unverified User Tries Forgot Password (Should Fail)**

**Step 1: Signup (Unverified User)**
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

**Step 2: Try Forgot Password (Should Fail)**
```bash
curl -X POST http://localhost:7000/api/v1/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Please verify your email first before requesting password reset"
}
```

---

### **Test 2: Verified User Tries Forgot Password (Should Succeed)**

**Step 1: Signup and Verify**
```bash
# Signup
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

# Verify Account (use OTP from email)
curl -X POST http://localhost:7000/api/v1/users/verify-account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "otp": "123456"
  }'
```

**Step 2: Try Forgot Password (Should Succeed)**
```bash
curl -X POST http://localhost:7000/api/v1/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset OTP sent successfully",
  "data": {
    "email": "jane@example.com",
    "expiresAt": "2024-01-01T10:10:00.000Z",
    "expiresIn": "10 minutes"
  }
}
```

---

### **Test 3: Non-existent User Tries Forgot Password (Should Fail)**

```bash
curl -X POST http://localhost:7000/api/v1/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

## 🔄 **Complete Password Reset Flow:**

### **For Verified Users Only:**

**Step 1: Request Password Reset OTP**
```bash
curl -X POST http://localhost:7000/api/v1/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "verified@example.com"
  }'
```

**Step 2: Verify Password Reset OTP**
```bash
curl -X POST http://localhost:7000/api/v1/users/verify-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "verified@example.com",
    "otp": "123456"
  }'
```

**Step 3: Reset Password**
```bash
curl -X POST http://localhost:7000/api/v1/users/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "verified@example.com",
    "otp": "123456",
    "newPassword": "NewSecurePass123!"
  }'
```

---

## ✅ **Security Benefits:**

1. **Prevents Unverified Account Abuse**: Unverified users cannot request password resets
2. **Ensures Email Ownership**: Only users who have verified their email can reset passwords
3. **Reduces Spam**: Prevents fake accounts from requesting password resets
4. **Better User Experience**: Clear error messages guide users to verify their email first

---

## 📋 **Summary:**

The forgot password API now properly enforces email verification:

- ❌ **Unverified users** → *"Please verify your email first before requesting password reset"*
- ✅ **Verified users** → Password reset OTP sent successfully
- ❌ **Non-existent users** → *"User not found"*

This ensures that only legitimate, verified users can reset their passwords! 🔒
