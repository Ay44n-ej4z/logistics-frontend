# UI Flow Diagram - Visual Navigation Guide

## 🎨 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         JOBS LIST PAGE                               │
│                     /dashboard/jobs                                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Job Number │ Type │ Shipper │ Consignee │ Master │ House  │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ 202510231710│Export│ ABC Co. │  XYZ Inc. │   3    │   5   │   │
│  │                            [👁️ View] [✏️ Edit] [🗑️ Delete]  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  [+ Create Job]                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Click "View" 👁️
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      JOB DETAIL PAGE                                │
│                 /dashboard/jobs/[job_id]                            │
│                                                                      │
│  Breadcrumb: Jobs / 202510231710                                   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              📋 JOB INFORMATION                              │  │
│  │  Job Number: 202510231710    Type: Export                   │  │
│  │  Status: Open                Date: 2025-10-23               │  │
│  │  Shipper: ABC Co.            Consignee: XYZ Inc.            │  │
│  │  Carrier: Emirates           Origin: JFK → Destination: DXB │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              📦 MASTER AWBs (3 items)                        │  │
│  │                                                               │  │
│  │  Master Number │ Carrier  │ Issue Date │ Status            │  │
│  │  MAWB-001      │ Emirates │ 2025-10-23 │ Issued  [👁️View] │  │
│  │  MAWB-002      │ Emirates │ 2025-10-24 │ Draft   [👁️View] │  │
│  │  MAWB-003      │ Emirates │ 2025-10-25 │ Issued  [👁️View] │  │
│  │                                                               │  │
│  │  [+ Add Master AWB]                                          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [✏️ Edit Job]  [+ Create Master AWB]                               │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Click "View" 👁️ on Master AWB
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   MASTER AWB DETAIL PAGE                            │
│             /dashboard/master-awbs/[master_id]                      │
│                                                                      │
│  Breadcrumb: Jobs / 202510231710 / Master AWBs / MAWB-001          │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │         📄 MASTER AWB INFORMATION                            │  │
│  │  Master Number: MAWB-001     Status: Issued                 │  │
│  │  Carrier: Emirates           Issue Date: 2025-10-23         │  │
│  │  Job: 202510231710 [🔗 View Job]                            │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              📦 HOUSE AWBs (5 items)                         │  │
│  │                                                               │  │
│  │  House Number │ Shipper  │ Consignee │ Items │ Status      │  │
│  │  HAWB-001     │ ABC Co.  │ XYZ Inc.  │  3    │ Issued [👁️] │  │
│  │  HAWB-002     │ ABC Co.  │ XYZ Inc.  │  2    │ Draft  [👁️] │  │
│  │  HAWB-003     │ ABC Co.  │ XYZ Inc.  │  4    │ Issued [👁️] │  │
│  │  HAWB-004     │ ABC Co.  │ XYZ Inc.  │  1    │ Issued [👁️] │  │
│  │  HAWB-005     │ ABC Co.  │ XYZ Inc.  │  5    │ Draft  [👁️] │  │
│  │                                                               │  │
│  │  [+ Add House AWB]                                           │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [✏️ Edit Master AWB]  [+ Create House AWB]                         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Click "View" 👁️ on House AWB
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    HOUSE AWB DETAIL PAGE                            │
│              /dashboard/house-awbs/[house_id]                       │
│                                                                      │
│  Breadcrumb: Jobs / 202510231710 / MAWB-001 / House AWBs / HAWB-001│
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │         📄 HOUSE AWB INFORMATION                             │  │
│  │  House Number: HAWB-001      Status: Issued                 │  │
│  │  Issue Date: 2025-10-23                                      │  │
│  │  Job: 202510231710 [🔗 View Job]                            │  │
│  │  Master AWB: MAWB-001 [🔗 View Master AWB]                  │  │
│  │  Shipper: ABC Co.            Consignee: XYZ Inc.            │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              📦 ITEMS (3 items)                              │  │
│  │                                                               │  │
│  │  Commodity    │ Description │ Qty │ Weight │ Volume │ Value │  │
│  │  Electronics  │ Laptops     │ 100 │ 200kg  │ 2m³    │ $5000 │  │
│  │  Electronics  │ Phones      │  50 │ 100kg  │ 1m³    │ $3000 │  │
│  │  Accessories  │ Chargers    │ 200 │  50kg  │ 0.5m³  │ $1000 │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              📊 SUMMARY                                      │  │
│  │  Total Items: 3             Total Weight: 350 kg            │  │
│  │  Total Volume: 3.5 m³       Total Packages: 350             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [✏️ Edit House AWB]                                                │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎯 Key Navigation Patterns

### 1. **Drill Down Pattern** (Top → Bottom)
```
Jobs List → Job Detail → Master AWB Detail → House AWB Detail
```
Use "View" 👁️ buttons to navigate deeper into the hierarchy.

### 2. **Breadcrumb Pattern** (Bottom → Top)
```
House AWB Detail → Master AWB Detail → Job Detail → Jobs List
```
Click on any breadcrumb link to navigate back up the hierarchy.

### 3. **Direct Link Pattern** (Across)
```
House AWB Detail → Click "View Job" → Jump to Job Detail
House AWB Detail → Click "View Master AWB" → Jump to Master AWB Detail
```
Use clickable relationship links to jump across the hierarchy.

### 4. **Context-Aware Creation** (With Pre-filled Data)
```
Job Detail → "+ Create Master AWB" → Form with Job pre-selected
Master AWB Detail → "+ Create House AWB" → Form with Job & Master pre-selected
```
Create child records with parent context automatically filled.

## 🌈 Color Coding Guide

### Status Indicators
- 🟦 **Blue Badge**: Open/Active items count
- 🟢 **Green Badge**: Issued/Completed status
- 🟡 **Yellow Badge**: Draft status  
- 🔴 **Red Badge**: Cancelled status
- ⚫ **Gray Badge**: Closed status

### Action Buttons
- 👁️ **Blue**: View (Navigate to detail page)
- ✏️ **Green**: Edit (Navigate to edit form)
- 🗑️ **Red**: Delete (Show confirmation dialog)

## 📱 Responsive Behavior

### Desktop View
- Full table layout with all columns visible
- Side-by-side information panels
- Inline action buttons

### Tablet View
- Scrollable tables with important columns pinned
- Stacked information panels
- Grouped action buttons

### Mobile View
- Card-based layout instead of tables
- Full-width information panels
- Bottom action sheet for operations

## ✨ Interactive Features

### Hover Effects
- **Table Rows**: Light gray background on hover
- **Action Buttons**: Color changes and background highlight
- **Breadcrumbs**: Blue text color on hover
- **Links**: Underline and color change

### Click Behaviors
- **View Button**: Instant navigation to detail page
- **Edit Button**: Navigate to edit form with data pre-loaded
- **Delete Button**: Shows confirmation dialog before deletion
- **Badge Counts**: Clickable to filter/view related items

### Loading States
- **Spinner**: Shown during data fetch
- **Skeleton**: Placeholder for content being loaded
- **Disabled State**: Buttons disabled during operations

## 🎨 Example User Flow

### Scenario: View complete details of a specific shipment

1. **Start**: Navigate to `/dashboard/jobs`
2. **Find**: Search for job number "202510231710"
3. **View**: Click 👁️ on the job row
4. **Arrive**: Job detail page shows job info + 3 Master AWBs
5. **Select**: Click 👁️ on "MAWB-001"
6. **Arrive**: Master AWB detail shows AWB info + 5 House AWBs
7. **Select**: Click 👁️ on "HAWB-001"
8. **Arrive**: House AWB detail shows complete shipment with 3 items
9. **Review**: See summary statistics at the bottom
10. **Navigate Back**: Use breadcrumbs to go back to any level

### Scenario: Create a new shipment

1. **Start**: Navigate to `/dashboard/jobs`
2. **Create**: Click "+ Create Job" button
3. **Fill**: Complete job form (auto-filled job number)
4. **Save**: Submit and redirected to job detail page
5. **Add**: Click "+ Create Master AWB"
6. **Fill**: Complete Master AWB form (Job pre-selected)
7. **Save**: Submit and redirected to Master AWB detail
8. **Add**: Click "+ Create House AWB"
9. **Fill**: Complete House AWB form with items (Job & Master pre-selected)
10. **Save**: Submit and view complete House AWB with items

## 🚀 Pro Tips

1. **Use Breadcrumbs**: Fastest way to navigate up the hierarchy
2. **Bookmark Detail Pages**: Direct access to frequently viewed items
3. **Context Creation**: Always create from parent detail pages to save time
4. **Search First**: Use search on list pages to quickly find items
5. **View Counts**: Badge numbers help identify busy jobs/AWBs at a glance

## 🎉 You're All Set!

Your logistics system now has a fully connected, intuitive hierarchy that makes managing complex shipping operations simple and efficient!

```
          🚢 Smooth sailing ahead! ⛵
```

