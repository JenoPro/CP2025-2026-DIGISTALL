# Frontend Stalls Component - Normalized Database Structure Update

## Overview

Updated the Stalls.js component to work with the new normalized database structure where `floor` and `section` are separate tables with foreign key relationships instead of simple string attributes.

## Key Changes Made

### 1. Updated transformStallData Method ✅

- **Change**: Modified to handle data from JOINed tables
- **Before**: Used direct `stall.floor` and `stall.section` string attributes
- **After**: Uses `stall.floor_name`/`stall.section_name` from JOINed tables with fallback to old fields
- **New Fields Added**:
  - `sectionId`: stall.section_id
  - `floorId`: stall.floor_id
  - `branchManagerId`: stall.branch_manager_id
  - Enhanced `isAvailable`: Checks both status and is_available flag

### 2. Enhanced Image Mapping ✅

- **Change**: Updated `getDefaultImage()` method
- **Improvement**: Added 'General Section' mapping and better section handling
- **Compatibility**: Works with both `section_name` and legacy `section` fields

### 3. Added Floor & Section Management ✅

- **New Methods**:
  - `fetchFloors()`: Get floors for current branch manager
  - `fetchSections(floorId)`: Get sections (optionally by floor)
  - `getFloorsAndSections()`: Fetch both in parallel
  - `loadFloorsAndSections()`: Component initialization helper

### 4. Enhanced Data Structure ✅

- **New Data Properties**:
  - `floorsData: []`: Store available floors
  - `sectionsData: []`: Store available sections
- **Updated Initialization**: Loads floors/sections on component mount

### 5. Updated Computed Properties ✅

- **Enhanced Grouping**: All grouping functions now work with normalized data
- **New Computed Properties**:
  - `availableFloors()`: Formatted floors for dropdowns
  - `availableSections()`: Formatted sections for dropdowns
  - `getSectionsForFloor()`: Get sections by floor ID
  - `stallsByArea()`: Group stalls by branch manager area

### 6. Branch Manager Integration ✅

- **New Methods**:
  - `getStallLocationHierarchy(stall)`: Full location path display
  - `getStallDisplayInfo(stall)`: Enhanced stall display with manager info
  - `getCurrentBranchInfo()`: Added branchManagerId to user info

### 7. Validation & Helper Methods ✅

- **New Utility Methods**:
  - `validateSectionFloor(sectionId, floorId)`: Ensure section belongs to floor
  - `getFloorName(floorId)`: Get floor name by ID
  - `getSectionName(sectionId)`: Get section name by ID
  - `refreshFloorsAndSections()`: Refresh hierarchical data

## Database Structure Compatibility

### Expected Backend Response Format

```javascript
// The component now expects this structure from the backend:
{
  stall_id: 123,
  stall_no: "NPM-001",
  // ... other stall fields ...

  // FROM JOINed section table:
  section_id: 456,
  section_name: "Electronics Section",

  // FROM JOINed floor table:
  floor_id: 789,
  floor_name: "1st Floor",

  // FROM JOINed branch_manager table:
  branch_manager_id: 1,
  area: "Naga City",
  location: "Peoples Mall",
  manager_first_name: "Juan",
  manager_last_name: "Dela Cruz"
}
```

### Backend API Endpoints Expected

- `GET /api/stalls` - Returns stalls with JOINed floor/section/branch_manager data
- `GET /api/floors` - Returns floors for current branch manager
- `GET /api/sections` - Returns sections for current branch manager
- `GET /api/sections?floor_id=X` - Returns sections for specific floor

## Benefits of These Updates

1. **Full Compatibility**: Works with both old and new database structures during transition
2. **Enhanced Filtering**: Child components can now filter by normalized floor/section IDs
3. **Better Validation**: Ensures section-floor relationships are maintained
4. **Rich Location Display**: Shows full hierarchy (Area > Location > Floor > Section)
5. **Improved Data Management**: Floors and sections are now centrally managed

## Child Component Integration

Child components (AddStall, EditStall, SearchFilter) can now access:

- `this.$parent.availableFloors` - Dropdown options for floors
- `this.$parent.availableSections` - Dropdown options for sections
- `this.$parent.getSectionsForFloor(floorId)` - Filtered sections
- `this.$parent.validateSectionFloor(sectionId, floorId)` - Validation
- `this.$parent.getStallDisplayInfo(stall)` - Enhanced stall display

## Next Steps for Complete Integration

1. **Update Child Components**: Modify AddStall, EditStall, SearchFilter to use new data structure
2. **Update API Calls**: Ensure backend returns JOINed data as expected
3. **Test Compatibility**: Verify both old and new database structures work during transition
4. **Update Forms**: Use sectionId/floorId instead of string values in forms

---

_This update maintains backward compatibility while adding full support for the normalized database structure._
