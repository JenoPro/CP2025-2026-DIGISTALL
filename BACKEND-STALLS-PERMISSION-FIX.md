# 🔒 BACKEND STALLS API PERMISSION FIX

## 📍 **Problem**:

Employee gets 403 Forbidden when accessing `/api/stalls` despite having "stalls" permission.

## 🎯 **Root Cause**:

Backend middleware only allows "branch manager" role, ignoring permission-based access.

---

## 🛠️ **Fix Required**

### **File to Update**:

`backend/routes/stalls.js` or wherever the stalls API is defined

### **Current Problematic Middleware**:

```javascript
// ❌ WRONG - Only allows branch managers
router.get('/api/stalls', authenticateBranchManager, getStalls)
```

### **✅ CORRECT Middleware**:

```javascript
// ✅ CORRECT - Allows users with stalls permission
router.get('/api/stalls', authenticateToken, checkStallsPermission, getStalls)
```

---

## 🔧 **Implementation**

### **1. Create Permission-Based Middleware**:

```javascript
// middleware/permissions.js
const checkStallsPermission = (req, res, next) => {
  const user = req.user // Set by authenticateToken middleware

  // Allow branch managers (backward compatibility)
  if (user.role === 'branch-manager' || user.userType === 'branch-manager') {
    return next()
  }

  // Allow employees with stalls permission
  if (user.role === 'employee' || user.userType === 'employee') {
    const permissions = user.permissions || []

    if (permissions.includes('stalls')) {
      console.log(`✅ Employee ${user.username} has stalls permission`)
      return next()
    } else {
      console.log(`❌ Employee ${user.username} lacks stalls permission`)
      return res.status(403).json({
        success: false,
        message: 'Access denied. Stalls permission required.',
      })
    }
  }

  // Default deny
  return res.status(403).json({
    success: false,
    message: 'Access denied. Invalid user role.',
  })
}

module.exports = { checkStallsPermission }
```

### **2. Update Stalls Routes**:

```javascript
// routes/stalls.js (or wherever stalls routes are defined)
const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const { checkStallsPermission } = require('../middleware/permissions')
const { getStalls } = require('../controllers/stallsController')

// ✅ Updated route with permission-based access
router.get('/api/stalls', authenticateToken, checkStallsPermission, getStalls)

module.exports = router
```

### **3. Apply Same Fix to Related Endpoints**:

```javascript
// Also update these endpoints for employee access:
router.get('/api/floors', authenticateToken, checkStallsPermission, getFloors)
router.get('/api/sections', authenticateToken, checkStallsPermission, getSections)
```

---

## 🎯 **Expected Results**:

### **Before Fix**:

- ❌ Employee with "stalls" permission: 403 Forbidden
- ✅ Branch Manager: 200 OK

### **After Fix**:

- ✅ Employee with "stalls" permission: 200 OK
- ✅ Branch Manager: 200 OK
- ❌ Employee without "stalls" permission: 403 Forbidden
- ❌ Unauthorized users: 401 Unauthorized

---

## 🧪 **Test Cases**:

1. **Employee with stalls permission** → Should get stalls data ✅
2. **Employee without stalls permission** → Should get 403 with clear message ❌
3. **Branch manager** → Should get stalls data (backward compatibility) ✅
4. **No authentication** → Should get 401 ❌

---

## 🚀 **Quick Implementation Steps**:

1. **Find the stalls route file** (likely `/routes/stalls.js` or similar)
2. **Replace role-based auth** with permission-based auth
3. **Create permission middleware** if it doesn't exist
4. **Test with employee account** - should work!
5. **Restart backend server**

---

**This fix ensures employees with "stalls" permission can access stalls data while maintaining security.**
