# SearchableDropdown Component

A reusable searchable dropdown component that provides a better user experience for selecting from large lists of options.

## Features

- **Search functionality**: Type to filter options in real-time
- **Debounced search**: Optimized API calls with configurable debounce delay
- **Loading states**: Shows loading indicator during API calls
- **Keyboard navigation**: Full keyboard support for accessibility
- **Clear functionality**: Easy way to clear selected value
- **Customizable display**: Support for different display keys and search keys
- **Error handling**: Built-in error display support
- **Responsive design**: Works well on all screen sizes

## Usage

### Basic Usage

```tsx
import SearchableDropdown from '@/components/common/SearchableDropdown';

const options = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
  { id: 3, name: 'Option 3' },
];

function MyComponent() {
  const [selectedValue, setSelectedValue] = useState<number | undefined>();

  return (
    <SearchableDropdown
      options={options}
      value={selectedValue}
      onChange={setSelectedValue}
      placeholder="Select an option"
    />
  );
}
```

### With Search API

```tsx
import SearchableDropdown from '@/components/common/SearchableDropdown';
import { useSearchableDropdown } from '@/hooks/useSearchableDropdown';
import { useSearchPartiesQuery } from '@/store/api/masterDataApi';

function MyComponent() {
  const search = useSearchableDropdown();
  const { data, isLoading } = useSearchPartiesQuery(
    { name: search.debouncedQuery, page: 1, page_size: 50 },
    { skip: !search.debouncedQuery }
  );

  const options = data?.data?.data || [];

  return (
    <SearchableDropdown
      options={options.map(party => ({ id: party.party_id, name: party.name }))}
      value={selectedValue}
      onChange={setSelectedValue}
      placeholder="Select a party"
      searchPlaceholder="Search parties..."
      onSearch={search.handleSearch}
      loading={isLoading}
    />
  );
}
```

### With React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import SearchableDropdown from '@/components/common/SearchableDropdown';

function MyForm() {
  const { setValue, watch } = useForm();
  const selectedValue = watch('fieldName');

  return (
    <SearchableDropdown
      options={options}
      value={selectedValue}
      onChange={(value) => setValue('fieldName', value)}
      placeholder="Select an option"
      error={errors.fieldName?.message}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `Array<{id: number, name: string, [key: string]: any}>` | ✅ | - | Array of options to display |
| `value` | `number \| undefined` | ✅ | - | Currently selected value |
| `onChange` | `(value: number \| undefined) => void` | ✅ | - | Callback when selection changes |
| `placeholder` | `string` | ✅ | - | Placeholder text when no option is selected |
| `searchPlaceholder` | `string` | ❌ | `'Search...'` | Placeholder for search input |
| `displayKey` | `string` | ❌ | `'name'` | Key to use for displaying option text |
| `searchKey` | `string` | ❌ | `'name'` | Key to use for searching/filtering |
| `disabled` | `boolean` | ❌ | `false` | Whether the dropdown is disabled |
| `error` | `string` | ❌ | - | Error message to display |
| `className` | `string` | ❌ | `''` | Additional CSS classes |
| `onSearch` | `(query: string) => void` | ❌ | - | Callback when search query changes |
| `loading` | `boolean` | ❌ | `false` | Whether to show loading state |

## useSearchableDropdown Hook

A custom hook that provides debounced search functionality:

```tsx
import { useSearchableDropdown } from '@/hooks/useSearchableDropdown';

function MyComponent() {
  const search = useSearchableDropdown({
    initialSearchQuery: '',
    debounceMs: 300, // Optional, defaults to 300ms
  });

  // search.searchQuery - Current search input value
  // search.debouncedQuery - Debounced search value (use this for API calls)
  // search.handleSearch - Function to update search query
  // search.clearSearch - Function to clear search query
}
```

## Styling

The component uses Tailwind CSS classes and follows the existing design system. The main classes used are:

- `input-field` - Base input styling
- `border-red-500` - Error state styling
- `opacity-50 cursor-not-allowed` - Disabled state styling

## Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- Focus management
- Clear visual feedback for all states
