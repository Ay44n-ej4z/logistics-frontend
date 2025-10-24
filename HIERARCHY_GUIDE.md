# Logistics Frontend - Job → Master AWB → House AWB Hierarchy Guide

## 📋 Overview

This document explains the complete hierarchy and navigation flow of the logistics management system.

## 🎯 Hierarchy Structure

```
Job (Root Level)
 ├── Master AWB (Multiple)
 │    ├── House AWB (Multiple)
 │    │    ├── Item 1
 │    │    ├── Item 2
 │    │    └── Item N
 │    └── House AWB (Direct to Job, optional Master AWB)
 └── House AWB (Direct to Job, no Master AWB)
```

## 🔄 Navigation Flow

### 1. Jobs List → Job Details
- **Page**: `/dashboard/jobs`
- **Action**: Click "View" (eye icon) on any job
- **Destination**: `/dashboard/jobs/[job_id]`
- **Shows**: 
  - Job information (type, dates, parties, ports, carrier)
  - List of all Master AWBs associated with this job
  - Option to create new Master AWB

### 2. Job Details → Master AWB Details
- **Page**: `/dashboard/jobs/[job_id]`
- **Action**: Click "View" (eye icon) on any Master AWB
- **Destination**: `/dashboard/master-awbs/[master_id]`
- **Shows**: 
  - Master AWB information (number, carrier, issue date, status)
  - Link back to parent Job
  - List of all House AWBs under this Master AWB
  - Option to create new House AWB

### 3. Master AWB Details → House AWB Details
- **Page**: `/dashboard/master-awbs/[master_id]`
- **Action**: Click "View" (eye icon) on any House AWB
- **Destination**: `/dashboard/house-awbs/[house_id]`
- **Shows**: 
  - House AWB information (number, shipper, consignee, dates)
  - Links back to parent Master AWB and Job
  - List of all Items in this House AWB
  - Summary statistics (total weight, volume, packages)

## 📍 Breadcrumb Navigation

Each detail page includes breadcrumb navigation for easy hierarchy traversal:

### Job Details
```
Jobs / [Job Number]
```

### Master AWB Details
```
Jobs / [Job Number] / Master AWBs / [Master Number]
```

### House AWB Details
```
Jobs / [Job Number] / [Master Number] / House AWBs / [House Number]
```

## 🎨 Visual Indicators

### Status Colors
- **Jobs**:
  - 🟦 Blue: Open
  - 🟪 Indigo: Invoiced
  - ⚫ Gray: Closed

- **Master AWB / House AWB**:
  - 🟡 Yellow: Draft
  - 🟢 Green: Issued
  - 🔴 Red: Cancelled

### Count Badges
- **Jobs List**: Shows count of Master AWBs (blue) and House AWBs (green)
- **House AWBs**: Shows count of Items (blue)

## 🔗 Quick Actions

Each list view provides three actions:
1. **View** (👁️ Blue): Navigate to detail page
2. **Edit** (✏️ Green): Navigate to edit form
3. **Delete** (🗑️ Red): Delete with confirmation

## 📊 Creation Flow

### Create Job
1. Navigate to `/dashboard/jobs`
2. Click "Create Job"
3. Fill job details
4. Job number auto-generated with timestamp

### Create Master AWB
**From Job Detail Page:**
1. Navigate to specific Job detail page
2. Click "Create Master AWB" button
3. Job is pre-selected
4. Fill Master AWB details

**From Master AWBs List:**
1. Navigate to `/dashboard/master-awbs`
2. Click "Create Master AWB"
3. Manually select Job

### Create House AWB
**From Master AWB Detail Page:**
1. Navigate to specific Master AWB detail page
2. Click "Create House AWB" button
3. Job and Master AWB are pre-selected
4. Fill House AWB details and items

**From Job Detail Page:**
1. Navigate to specific Job detail page
2. Click "Create Master AWB" to create intermediate level first
3. Then create House AWB from Master AWB detail page

**From House AWBs List:**
1. Navigate to `/dashboard/house-awbs`
2. Click "Create House AWB"
3. Manually select Job and optionally Master AWB
4. Fill House AWB details and items

## 🎯 Key Features

### Automatic Pre-filling
- Job number: Auto-generated with format `YYYYMMDDHHmm`
- House AWB number: Auto-generated on creation page
- Master AWB number: Auto-generated on creation page

### Relationship Management
- Master AWB → Must belong to a Job
- House AWB → Must belong to a Job
- House AWB → Optionally belongs to a Master AWB
- Items → Must belong to a House AWB

### Data Display
- **Job Detail**: Shows all Master AWBs
- **Master AWB Detail**: Shows all House AWBs under it
- **House AWB Detail**: Shows all Items with summary statistics

## 📱 API Integration

All pages use RTK Query hooks for data fetching:
- `useGetJobsQuery()` - Fetch all jobs
- `useGetJobByIdQuery()` - Fetch single job with details
- `useGetMasterAwbsQuery()` - Fetch all Master AWBs
- `useGetMasterAwbByIdQuery()` - Fetch single Master AWB
- `useSearchMasterAwbsQuery()` - Search Master AWBs by job
- `useGetHouseAwbsQuery()` - Fetch all House AWBs
- `useGetHouseAwbByIdQuery()` - Fetch single House AWB with items
- `useSearchHouseAwbsQuery()` - Search House AWBs by Master AWB

## 🚀 Getting Started

1. **Create a Job first** - This is the root entity
2. **Create Master AWB(s)** - Link to the job
3. **Create House AWB(s)** - Link to Master AWB and Job
4. **Add Items** - During House AWB creation

## 💡 Tips

- Use breadcrumbs to navigate back up the hierarchy
- Use the "View" action to drill down into details
- Create Master AWBs directly from Job detail page to maintain context
- Create House AWBs directly from Master AWB detail page to maintain context
- All relationships are automatically validated by the backend

## 🔍 Search & Filter

- Jobs: Search by job number, shipper, or consignee
- Master AWBs: Search by number, job, or carrier
- House AWBs: Search by number, shipper, or consignee

## 📄 Files Structure

```
src/
├── app/
│   └── dashboard/
│       ├── jobs/
│       │   ├── page.tsx (List)
│       │   ├── [id]/page.tsx (Detail - NEW)
│       │   └── create/page.tsx
│       ├── master-awbs/
│       │   ├── page.tsx (List)
│       │   ├── [id]/page.tsx (Detail - NEW)
│       │   └── create/page.tsx
│       └── house-awbs/
│           ├── page.tsx (List)
│           ├── [id]/page.tsx (Detail - NEW)
│           └── create/page.tsx
├── components/
│   └── master-data/
│       └── columns/
│           ├── jobsColumns.tsx (Updated with navigation)
│           ├── masterAwbsColumns.tsx (Updated with navigation)
│           └── houseAwbsColumns.tsx (Updated with navigation)
└── store/
    └── api/
        ├── jobsApi.ts
        ├── masterAwbsApi.ts
        └── houseAwbsApi.ts
```

## 🎉 Complete!

Your logistics management system now has a fully functional hierarchical navigation system with:
✅ Detail pages for all entities
✅ Breadcrumb navigation
✅ Automatic relationship management
✅ Visual hierarchy indicators
✅ Context-aware creation flows
✅ Complete CRUD operations

Enjoy managing your logistics data! 🚢✈️📦

