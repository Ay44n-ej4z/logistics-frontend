# Toast Notification System

## Overview
This project uses Sonner for toast notifications with automatic API error/success handling through Redux middleware.

## Features
✅ Automatic toast notifications for all API mutations (POST, PUT, DELETE)
✅ Custom toast hook for manual notifications
✅ Rich color schemes and animations
✅ Top-right positioning with close buttons
✅ Automatic error handling with descriptive messages

## Quick Start

### 1. Use the `useToast` Hook

```typescript
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const toast = useToast();

  const handleClick = () => {
    // Success toast
    toast.success('Operation completed!');
    
    // Error toast
    toast.error('Something went wrong!');
    
    // Info toast
    toast.info('New update available');
    
    // Warning toast
    toast.warning('Please save your work');
  };
}
```

### 2. Toast with Descriptions

```typescript
const toast = useToast();

toast.success('Profile updated!', {
  description: 'Your profile has been successfully updated',
  duration: 4000, // 4 seconds
});

toast.error('Failed to save', {
  description: 'Please check your internet connection and try again',
});
```

### 3. Toast with Actions

```typescript
toast.warning('Unsaved changes', {
  description: 'You have unsaved changes',
  action: {
    label: 'Save Now',
    onClick: () => handleSave(),
  },
});
```

### 4. API-Specific Toasts

```typescript
const toast = useToast();

// For create operations
toast.api.created('User');  // Shows: "User created successfully!"

// For update operations
toast.api.updated('Profile');  // Shows: "Profile updated successfully!"

// For delete operations
toast.api.deleted('Job');  // Shows: "Job deleted successfully!"

// For errors
toast.api.error('save data', error);  // Shows: "Failed to save data" with error message
```

### 5. Loading States

```typescript
const toast = useToast();

// Simple loading
const loadingId = toast.loading('Uploading file...');

// Later dismiss it
toast.dismiss(loadingId);

// Or use promise-based loading
toast.promise(
  fetchData(),
  {
    loading: 'Loading data...',
    success: 'Data loaded successfully!',
    error: 'Failed to load data',
  }
);
```

## Automatic API Notifications

The toast middleware automatically handles:

### Success Notifications (Auto)
All successful mutations (create, update, delete) automatically show success toasts:

```typescript
// This automatically shows: "Master AWB created successfully!"
const [createMasterAwb] = useCreateMasterAwbMutation();
await createMasterAwb(data).unwrap();
```

### Error Notifications (Auto)
All failed API calls automatically show error toasts:

```typescript
// This automatically shows: "Failed to create master AWB" with error message
try {
  await createMasterAwb(data).unwrap();
} catch (error) {
  // Error toast shown automatically!
}
```

### Disable Automatic Toasts
If you want to handle toasts manually for a specific API call:

```typescript
try {
  const result = await createUser(data).unwrap();
  // Use custom toast instead
  toast.success('Welcome aboard!', {
    description: `User ${result.data.email} has been created`,
  });
} catch (error) {
  // Handle error manually
  toast.error('Registration failed', {
    description: 'Email already exists',
  });
}
```

## Manual Toast Examples

### 1. Form Validation

```typescript
const handleSubmit = (data) => {
  if (!data.email) {
    toast.error('Email is required');
    return;
  }
  
  // ... proceed with form submission
};
```

### 2. File Upload

```typescript
const handleUpload = async (file) => {
  const loadingId = toast.loading('Uploading file...');
  
  try {
    await uploadFile(file);
    toast.dismiss(loadingId);
    toast.success('File uploaded successfully!');
  } catch (error) {
    toast.dismiss(loadingId);
    toast.error('Upload failed', {
      description: error.message,
    });
  }
};
```

### 3. Copy to Clipboard

```typescript
const handleCopy = () => {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard!');
};
```

### 4. Batch Operations

```typescript
const handleBulkDelete = async (ids) => {
  const loadingId = toast.loading(`Deleting ${ids.length} items...`);
  
  try {
    await bulkDelete(ids);
    toast.dismiss(loadingId);
    toast.success(`${ids.length} items deleted successfully!`);
  } catch (error) {
    toast.dismiss(loadingId);
    toast.error('Bulk delete failed');
  }
};
```

## Direct Usage (Without Hook)

If you can't use hooks (e.g., in utility functions):

```typescript
import { showToast } from '@/hooks/useToast';

export function utilityFunction() {
  showToast.success('Operation completed');
  showToast.error('Operation failed', 'Error details here');
}
```

## Customization

### Global Configuration
Toast configuration is set in `app/layout.tsx`:

```typescript
<Toaster 
  position="top-right"  // Change position: top-left, top-right, bottom-left, bottom-right
  expand={false}        // Expand toasts
  richColors            // Use semantic colors
  closeButton           // Show close button
/>
```

### Per-Toast Configuration

```typescript
toast.success('Custom toast', {
  duration: 10000,  // 10 seconds
  description: 'Additional details',
  action: {
    label: 'Undo',
    onClick: () => handleUndo(),
  },
});
```

## Best Practices

1. **Use API toasts for CRUD operations** - They're handled automatically!
2. **Use manual toasts for user actions** - Copy, download, etc.
3. **Keep messages concise** - Use descriptions for details
4. **Set appropriate durations**:
   - Success: 3 seconds
   - Error: 5 seconds
   - Info/Warning: 4 seconds
5. **Don't spam toasts** - Dismiss previous ones if needed
6. **Use loading toasts** - For operations taking > 1 second

## Examples from Codebase

### Profile Update (Manual)
```typescript
// src/app/dashboard/profile/page.tsx
const onProfileSubmit = async (data) => {
  try {
    await updateUser(data).unwrap();
    toast.api.updated('Profile');
  } catch (error) {
    toast.api.error('update profile', error);
  }
};
```

### Create User (Automatic)
```typescript
// src/app/dashboard/users/create/page.tsx
const onSubmit = async (data) => {
  try {
    await createUser(data).unwrap();
    // Success toast shown automatically!
    router.push('/dashboard/users');
  } catch (error) {
    // Error toast shown automatically!
  }
};
```

## Troubleshooting

**Q: Toasts not showing?**
- Check that `<Toaster />` is in your root layout
- Ensure you're using the hook inside a component

**Q: Duplicate toasts?**
- The middleware handles API errors automatically
- Don't manually toast for API mutations unless you want custom messages

**Q: Toast stays too long?**
- Adjust duration in the toast call: `toast.success('Message', { duration: 2000 })`

## API Reference

### `useToast()` Hook

| Method | Parameters | Description |
|--------|------------|-------------|
| `success()` | `(message, options?)` | Show success toast |
| `error()` | `(message, options?)` | Show error toast |
| `info()` | `(message, options?)` | Show info toast |
| `warning()` | `(message, options?)` | Show warning toast |
| `loading()` | `(message, options?)` | Show loading toast |
| `promise()` | `(promise, options)` | Promise-based toast |
| `dismiss()` | `(toastId?)` | Dismiss toast(s) |
| `api.created()` | `(resourceName)` | Show create success |
| `api.updated()` | `(resourceName)` | Show update success |
| `api.deleted()` | `(resourceName)` | Show delete success |
| `api.error()` | `(operation, error)` | Show API error |
| `api.loading()` | `(operation)` | Show API loading |

### Toast Options

```typescript
interface ToastOptions {
  title?: string;           // Toast title
  description?: string;     // Additional description
  duration?: number;        // Duration in ms
  action?: {               // Action button
    label: string;
    onClick: () => void;
  };
}
```

