# Master Data Edit & Delete Functionality Implementation

## ✅ Completed Entities
1. **Carriers** - Full edit/delete functionality implemented
2. **Cities** - Full edit/delete functionality implemented
3. **Commodities** - Full edit/delete functionality implemented
4. **Countries** - Columns updated (page needs completion)

## 🔄 Remaining Entities (Same Pattern)
5. **Parties**
6. **Ports/Airports**

## 📋 Implementation Pattern

Each entity follows this consistent pattern:

### 1. Column Files (`src/components/master-data/columns/`)

```typescript
interface CreateColumnsOptions {
  onEdit?: (entity: EntityType) => void;
  onDelete?: (id: number, name: string) => void;
}

export const createEntityColumns = (options?: CreateColumnsOptions): ColumnDef<EntityType>[] => [
  // ... existing columns ...
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const entity = row.original;
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => options?.onEdit?.(entity)}
            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Icon icon="mdi:pencil" className="w-4 h-4" />
          </button>
          <button
            onClick={() => options?.onDelete?.(entity.entity_id, entity.entity_name)}
            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Icon icon="mdi:delete" className="w-4 h-4" />
          </button>
        </div>
      );
    },
  },
];

export const entityColumns = createEntityColumns();
```

### 2. Page Files (`src/app/dashboard/entity/page.tsx`)

#### A. Imports
```typescript
import { useState, useMemo, useCallback } from 'react';
import { 
  useCreateEntityMutation, 
  useUpdateEntityMutation, 
  useDeleteEntityMutation, 
  useSearchEntitiesQuery 
} from '@/store/api/masterDataApi';
import { EntitySearchParams, Entity } from '@/types';
import { createEntityColumns } from '@/components/master-data/columns/entityColumns';
import { useToast } from '@/hooks/useToast';
```

#### B. State Management
```typescript
const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
const toast = useToast();
const [createEntity] = useCreateEntityMutation();
const [updateEntity] = useUpdateEntityMutation();
const [deleteEntity] = useDeleteEntityMutation();
```

#### C. Form Setup
```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
  setValue,
} = useForm<CreateEntityFormData>({
  resolver: zodResolver(createEntitySchema),
});
```

#### D. Submit Handler
```typescript
const onSubmit = async (data: CreateEntityFormData) => {
  try {
    if (editingEntity) {
      await updateEntity({ id: editingEntity.entity_id, data }).unwrap();
      toast.success('Entity updated successfully!');
    } else {
      await createEntity(data).unwrap();
      toast.success('Entity created successfully!');
    }
    reset();
    setShowForm(false);
    setEditingEntity(null);
  } catch (error: any) {
    toast.error(error?.data?.message || `Failed to ${editingEntity ? 'update' : 'create'} entity`);
  }
};
```

#### E. Edit Handler
```typescript
const handleEdit = useCallback((entity: Entity) => {
  setEditingEntity(entity);
  // Set all form values
  setValue('field1', entity.field1);
  setValue('field2', entity.field2);
  // ... set all fields ...
  setShowForm(true);
}, [setValue]);
```

#### F. Delete Handler
```typescript
const handleDelete = useCallback(async (id: number, name: string) => {
  if (!confirm(`Are you sure you want to delete entity "${name}"?\n\nThis action cannot be undone.`)) {
    return;
  }
  try {
    await deleteEntity(id).unwrap();
    toast.success(`Entity "${name}" deleted successfully!`);
  } catch (error: any) {
    toast.error(error?.data?.message || `Failed to delete entity "${name}"`);
  }
}, [deleteEntity, toast]);
```

#### G. Cancel Handler
```typescript
const handleCancelEdit = () => {
  setEditingEntity(null);
  setShowForm(false);
  reset();
};
```

#### H. Columns with Callbacks
```typescript
const columns = useMemo(
  () => createEntityColumns({ onEdit: handleEdit, onDelete: handleDelete }), 
  [handleEdit, handleDelete]
);
```

#### I. UI Updates

1. **Form Title**:
```jsx
<h3 className="text-lg font-semibold text-gray-900 mb-4">
  {editingEntity ? 'Edit Entity' : 'Add New Entity'}
</h3>
```

2. **Add Button**:
```jsx
<motion.button
  onClick={() => {
    setEditingEntity(null);
    reset();
    setShowForm(!showForm);
  }}
  className="btn-primary flex items-center"
>
  <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
  Add Entity
</motion.button>
```

3. **Submit Button**:
```jsx
<button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">
  {editingEntity ? 'Update Entity' : 'Create Entity'}
</button>
```

4. **Cancel Button**:
```jsx
<button type="button" onClick={handleCancelEdit} className="btn-secondary">
  Cancel
</button>
```

5. **Table**:
```jsx
<MasterDataTable
  data={entities}
  columns={columns}  // Using the columns with callbacks
  // ... other props ...
/>
```

## 🔑 Key Features

### Edit Functionality
- ✅ Click edit icon to populate form with existing data
- ✅ Form title changes to "Edit [Entity]"
- ✅ Submit button changes to "Update [Entity]"
- ✅ Success toast notification on update
- ✅ Error handling with specific error messages

### Delete Functionality
- ✅ Confirmation dialog before deletion
- ✅ Shows entity name in confirmation
- ✅ Success toast notification on deletion
- ✅ Error handling with specific error messages
- ✅ Automatic table refresh after deletion

### Form Management
- ✅ Cancel button clears editing state
- ✅ Add button resets form for new entry
- ✅ Form validation with react-hook-form + zod
- ✅ Editing state properly managed

## 📝 To Complete Remaining Entities

For **Parties** and **Ports/Airports**, apply the same pattern:

1. Update columns file (add `CreateColumnsOptions` interface and callbacks)
2. Update page file:
   - Add imports for useCallback, update/delete mutations, useToast
   - Add editingEntity state
   - Add setValue to useForm destructuring
   - Add handleEdit, handleDelete, handleCancelEdit functions
   - Update onSubmit to handle both create and update
   - Create columns with useMemo and callbacks
   - Update UI elements (form title, buttons, table)

## 🎯 API Mutations Already Available

All mutations are already implemented in `masterDataApi.ts`:
- ✅ `useCreateEntityMutation`
- ✅ `useUpdateEntityMutation`
- ✅ `useDeleteEntityMutation`

No backend changes needed!

## 🚀 Benefits

1. **Consistent UX** across all master data pages
2. **Inline editing** - no separate edit pages needed
3. **Toast notifications** for user feedback
4. **Error handling** with backend error messages
5. **Confirmation dialogs** to prevent accidental deletions
6. **Type-safe** with TypeScript throughout
7. **Responsive** and accessible UI

## 📊 Current Status

| Entity | Columns | Page | Status |
|--------|---------|------|--------|
| Carriers | ✅ | ✅ | Complete |
| Cities | ✅ | ✅ | Complete |
| Commodities | ✅ | ✅ | Complete |
| Countries | ✅ | 🔄 | Partial |
| Parties | ⏳ | ⏳ | Pending |
| Ports/Airports | ⏳ | ⏳ | Pending |

