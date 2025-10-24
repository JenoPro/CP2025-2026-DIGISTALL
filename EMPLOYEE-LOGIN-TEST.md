# Employee Login Test Instructions

## 🧪 **Test Employee Login System**

### **Step 1: Available Test Employee**
We have a test employee created with these credentials:
- **Username**: `limited.employee920`
- **Password**: `iEbp9nVp`
- **Permissions**: dashboard, payments

### **Step 2: Test Employee Login**
1. Go to the login page: http://localhost:5173
2. Enter the employee credentials:
   - Username: `limited.employee920`
   - Password: `iEbp9nVp`
3. Click Login

### **Step 3: Expected Behavior**
After successful login, the employee should:
- ✅ See only 2 menu items: Dashboard, Payment
- ✅ Be able to access /dashboard, /payment routes
- ❌ NOT see: Applicants, Compliances, Vendors, Stallholders, Collectors, Stalls, Complaints
- ❌ NOT be able to access /branch, /employees, or other restricted routes

### **Step 4: Test Permission Restrictions**
1. After logging in as employee, try manually navigating to:
   - http://localhost:5173/branch (should redirect to dashboard)
   - http://localhost:5173/employees (should redirect to dashboard)
   - http://localhost:5173/applicants (should redirect to dashboard)
   - http://localhost:5173/vendors (should redirect to dashboard)

2. Only these should work:
   - http://localhost:5173/dashboard ✅
   - http://localhost:5173/payment ✅  
   - http://localhost:5173/complaints ✅

### **Step 5: Create Another Test Employee**
1. Login as admin or branch manager first
2. Go to Employee Management
3. Create new employee with different permissions
4. Test login with that employee to verify different permission sets

## 🔧 **Current System Status**

### **Fixed Issues:**
- ✅ Employee login endpoint integration
- ✅ Response structure handling for employee login
- ✅ Employee username detection (supports .employee pattern)
- ✅ Permission-based navigation
- ✅ Route protection with guards

### **How Detection Works:**
- **Admin**: username = "admin" or contains "admin"
- **Employee**: username starts with "EMP" OR contains ".employee" OR matches pattern "firstname.lastname###"
- **Branch Manager**: any other username

### **Employee Menu Logic:**
The system checks the employee's permissions array and only shows menu items for:
- `dashboard` → Dashboard
- `payments` → Payment  
- `complaints` → Complaints
- `applicants` → Applicants
- `compliances` → Compliances
- `vendors` → Vendors
- `stallholders` → Stallholders
- `collectors` → Collectors
- `stalls` → Stalls

## 🎯 **Test Results Expected:**
Employee with `["dashboard", "payments"]` permissions should only see and access those 2 features, with all other routes blocked and redirected to dashboard.