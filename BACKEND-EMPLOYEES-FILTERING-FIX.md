# 🔒 BACKEND EMPLOYEES FILTERING FIX

## 📍 **Problem**: 
Branch managers can see all employees, but they should only see employees they created.

## 🎯 **Business Requirement**: 
Branch managers should only have access to employees where `created_by_manager` matches their own ID.

---

## 🛠️ **Backend Fix Required**

### **File to Update**: 
`backend/controllers/employees.js` or `backend/routes/employees.js`

### **Current Implementation (WRONG)**:
```javascript
// ❌ Returns all employees without filtering
router.get('/api/employees', authenticateToken, async (req, res) => {
  const [employees] = await pool.execute(`
    SELECT e.*, b.branch_name,
           GROUP_CONCAT(DISTINCT ep.permission_name) as permissions
    FROM employees e
    LEFT JOIN branches b ON e.branch_id = b.branch_id
    LEFT JOIN employee_permissions ep ON e.employee_id = ep.employee_id
    GROUP BY e.employee_id
  `)
  
  return res.json({ success: true, data: employees })
})
```

### **✅ CORRECT Implementation**:
```javascript
// ✅ Filter employees based on user role and permissions
router.get('/api/employees', authenticateToken, async (req, res) => {
  try {
    const user = req.user // Set by JWT middleware
    let whereClause = ''
    let params = []
    
    // Filter based on user role
    if (user.role === 'branch-manager' || user.userType === 'branch-manager') {
      // Branch managers can only see employees they created
      whereClause = 'WHERE e.created_by_manager = ?'
      params.push(user.userId || user.id)
      console.log(`🔍 Filtering employees for branch manager ID: ${user.userId || user.id}`)
    } else if (user.role === 'employee' || user.userType === 'employee') {
      // Employees can only see themselves (if needed)
      whereClause = 'WHERE e.employee_id = ?'
      params.push(user.employeeId || user.userId || user.id)
    } else if (user.role === 'admin' || user.userType === 'admin') {
      // Admins can see all employees
      whereClause = ''
      params = []
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Invalid user role.'
      })
    }

    const query = `
      SELECT e.*, b.branch_name,
             GROUP_CONCAT(DISTINCT ep.permission_name) as permissions
      FROM employees e
      LEFT JOIN branches b ON e.branch_id = b.branch_id
      LEFT JOIN employee_permissions ep ON e.employee_id = ep.employee_id
      ${whereClause}
      GROUP BY e.employee_id
      ORDER BY e.created_at DESC
    `
    
    const [employees] = await pool.execute(query, params)
    
    // Process permissions
    const processedEmployees = employees.map(emp => ({
      ...emp,
      permissions: emp.permissions ? emp.permissions.split(',').filter(p => p.trim()) : []
    }))
    
    console.log(`✅ Returning ${processedEmployees.length} employees for user ${user.username}`)
    
    return res.json({
      success: true,
      data: processedEmployees,
      total: processedEmployees.length
    })
    
  } catch (error) {
    console.error('Error fetching employees:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})
```

---

## 🔧 **Additional Backend Updates**

### **1. Employee Creation - Ensure created_by_manager is set**:

```javascript
// POST /api/employees - Create new employee
router.post('/api/employees', authenticateToken, async (req, res) => {
  try {
    const user = req.user
    const { firstName, lastName, email, phoneNumber, branchId, permissions } = req.body
    
    // Ensure created_by_manager is set to current user
    const createdByManager = user.userId || user.id
    const employeeBranchId = branchId || user.branchId || 1
    
    // Insert employee with created_by_manager
    const [result] = await pool.execute(`
      INSERT INTO employees (
        employee_username, employee_password, first_name, last_name,
        email, phone_number, branch_id, created_by_manager, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active')
    `, [username, hashedPassword, firstName, lastName, email, phoneNumber, employeeBranchId, createdByManager])
    
    // ... rest of employee creation logic
    
  } catch (error) {
    // ... error handling
  }
})
```

### **2. Employee Updates - Verify ownership**:

```javascript
// PUT /api/employees/:id - Update employee
router.put('/api/employees/:id', authenticateToken, async (req, res) => {
  try {
    const user = req.user
    const employeeId = req.params.id
    
    // Check if user can modify this employee
    if (user.role === 'branch-manager' || user.userType === 'branch-manager') {
      // Verify the employee was created by this manager
      const [employees] = await pool.execute(
        'SELECT created_by_manager FROM employees WHERE employee_id = ?',
        [employeeId]
      )
      
      if (employees.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        })
      }
      
      if (employees[0].created_by_manager !== (user.userId || user.id)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only modify employees you created.'
        })
      }
    }
    
    // ... proceed with update
    
  } catch (error) {
    // ... error handling
  }
})
```

---

## 🎯 **Expected Results**:

### **Before Fix**:
- ❌ Branch Manager sees ALL employees in system
- ❌ No filtering based on creator

### **After Fix**:
- ✅ Branch Manager only sees employees they created
- ✅ Admin sees all employees (if applicable)
- ✅ Employees see only themselves (if applicable)
- ✅ Proper ownership verification on updates

---

## 🧪 **Test Cases**:

1. **Branch Manager A** creates Employee X → Should see Employee X ✅
2. **Branch Manager B** creates Employee Y → Should NOT see Employee X ❌
3. **Branch Manager A** tries to edit Employee Y → Should get 403 Forbidden ❌
4. **Admin user** → Should see all employees ✅

---

## 🚀 **Implementation Steps**:

1. **Update employees GET endpoint** with role-based filtering
2. **Update employees POST endpoint** to set created_by_manager
3. **Update employees PUT endpoint** with ownership verification
4. **Test with different user roles**
5. **Restart backend server**

---

**This ensures proper data isolation between branch managers while maintaining security.**