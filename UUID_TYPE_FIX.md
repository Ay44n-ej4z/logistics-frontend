# UUID Type Fix - Summary

## 🔴 The Error

```
error: invalid input syntax for type uuid: "1850"
Database Error: 22P02 - Invalid data format.
```

## 🎯 Root Cause

**Backend Database**: All IDs are stored as **UUID** (Universally Unique Identifier)
- Example: `550e8400-e29b-41d4-a716-446655440000`

**Frontend TypeScript**: Types were incorrectly defined as `number`
- Example: `1850` ❌

When the frontend tried to query `/dashboard/jobs/1850`, it passed the number `1850` to the backend, but PostgreSQL expected a UUID string and rejected it.

---

## ✅ What Was Fixed

### 1. Job Types (`jobsApi.ts`)

#### Before (WRONG):
```typescript
export interface Job {
  job_id: number;        // ❌ Wrong!
  shipper_id: number;    // ❌ Wrong!
  consignee_id: number;  // ❌ Wrong!
  carrier_id: number;    // ❌ Wrong!
  // ... all IDs were number
}
```

#### After (CORRECT):
```typescript
export interface Job {
  job_id: string;        // ✅ UUID
  shipper_id: string;    // ✅ UUID
  consignee_id: string;  // ✅ UUID
  carrier_id: string;    // ✅ UUID
  // ... all IDs are now string (UUID)
}
```

### 2. Master AWB Types (`masterAwbsApi.ts`)

#### Before (WRONG):
```typescript
export interface CreateMasterAwbRequest {
  job_id: number;       // ❌ Wrong!
  carrier_id: number;   // ❌ Wrong!
}
```

#### After (CORRECT):
```typescript
export interface CreateMasterAwbRequest {
  job_id: string;       // ✅ UUID
  carrier_id: string;   // ✅ UUID
}
```

### 3. House AWB Types (`houseAwbsApi.ts`)

#### Before (WRONG):
```typescript
export interface HouseAwbSearchParams {
  house_id?: number;     // ❌ Wrong!
  job_id?: number;       // ❌ Wrong!
  shipper_id?: number;   // ❌ Wrong!
  consignee_id?: number; // ❌ Wrong!
}
```

#### After (CORRECT):
```typescript
export interface HouseAwbSearchParams {
  house_id?: string;     // ✅ UUID
  job_id?: string;       // ✅ UUID
  shipper_id?: string;   // ✅ UUID
  consignee_id?: string; // ✅ UUID
  master_id?: string;    // ✅ UUID
}
```

### 4. House AWB Detail Page

#### Before (WRONG):
```typescript
const { data } = useGetHouseAwbByIdQuery(Number(houseAwbId));  // ❌ Converting to number!
```

#### After (CORRECT):
```typescript
const { data } = useGetHouseAwbByIdQuery(houseAwbId);  // ✅ Using UUID string directly
```

---

## 🧬 Understanding UUIDs

### What is a UUID?
A UUID (Universally Unique Identifier) is a 128-bit label used for information in computer systems.

**Format**: `550e8400-e29b-41d4-a716-446655440000`
- 8 hex digits - 4 hex digits - 4 hex digits - 4 hex digits - 12 hex digits
- Always 36 characters (32 hex + 4 hyphens)

### Why Use UUIDs?
✅ **Globally Unique**: Can generate without central coordination
✅ **Non-Sequential**: Better security (can't guess next ID)
✅ **Distributed Systems**: Multiple systems can generate IDs without conflict
✅ **Merge-Friendly**: Easy to merge data from different sources

### UUID vs Integer IDs

| Feature | UUID | Integer |
|---------|------|---------|
| **Size** | 128 bits (36 chars) | 32-64 bits |
| **Format** | `123e4567-...` | `1, 2, 3, ...` |
| **Type in TypeScript** | `string` | `number` |
| **Type in PostgreSQL** | `uuid` | `int`, `bigint` |
| **Generation** | Random/Time-based | Sequential |
| **Uniqueness** | Global | Database-local |

---

## 📋 Files Changed

1. ✅ `logistics-frontend/src/store/api/jobsApi.ts`
   - Updated `Job` interface
   - Updated `CreateJobRequest` interface
   - Updated `UpdateJobRequest` interface

2. ✅ `logistics-frontend/src/store/api/masterAwbsApi.ts`
   - Updated `CreateMasterAwbRequest` interface

3. ✅ `logistics-frontend/src/store/api/houseAwbsApi.ts`
   - Updated `HouseAwbSearchParams` interface
   - Updated `getHouseAwbById` query parameter type
   - Updated `updateHouseAwb` mutation parameter type
   - Updated `deleteHouseAwb` mutation parameter type

4. ✅ `logistics-frontend/src/app/dashboard/house-awbs/[id]/page.tsx`
   - Removed incorrect `Number()` conversion

---

## 🧪 How to Verify the Fix

### Test Job Detail Page:
1. Go to `/dashboard/jobs`
2. Click "View" on any job
3. URL should look like: `/dashboard/jobs/550e8400-e29b-41d4-a716-446655440000`
4. Page should load successfully ✅

### Test Master AWB Detail Page:
1. From a job detail page, click "View" on any Master AWB
2. URL should look like: `/dashboard/master-awbs/123e4567-...`
3. Page should load successfully ✅

### Test House AWB Detail Page:
1. From a Master AWB detail page, click "View" on any House AWB
2. URL should look like: `/dashboard/house-awbs/abc12345-...`
3. Page should load successfully ✅

---

## 🚨 Important Notes

### When Creating/Updating Records:

**OLD WAY (WRONG):**
```typescript
const jobData = {
  job_number: "JOB-001",
  shipper_id: 123,       // ❌ Number
  consignee_id: 456,     // ❌ Number
  carrier_id: 789,       // ❌ Number
};
```

**NEW WAY (CORRECT):**
```typescript
const jobData = {
  job_number: "JOB-001",
  shipper_id: "550e8400-e29b-41d4-a716-446655440000",  // ✅ UUID string
  consignee_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",  // ✅ UUID string
  carrier_id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",  // ✅ UUID string
};
```

### In Forms:
When selecting from dropdowns (parties, carriers, ports), make sure the **value** stored is the **UUID string**, not a number.

**Example (React Hook Form):**
```typescript
<select {...register('shipper_id')}>
  <option value="550e8400-e29b-41d4-a716-446655440000">ABC Company</option>
  {/* NOT: <option value="123">ABC Company</option> */}
</select>
```

---

## ✅ No More Errors!

The error `invalid input syntax for type uuid` should now be completely resolved. All frontend types now correctly match the backend UUID types.

---

## 🔍 If You Still See Errors

1. **Clear your browser cache** - Old type definitions might be cached
2. **Restart the dev server** - Ensure latest code is running
3. **Check the console** - Look for any TypeScript compilation errors
4. **Verify database** - Ensure all IDs in the database are actually UUIDs

---

## 📚 Related Documentation

- [PostgreSQL UUID Type](https://www.postgresql.org/docs/current/datatype-uuid.html)
- [TypeORM UUID Primary Column](https://typeorm.io/entities#primary-columns)
- [TypeScript String Type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#string)

---

**Status**: ✅ **FIXED**

All ID types in the frontend now correctly match the backend UUID types. The application should work seamlessly!

