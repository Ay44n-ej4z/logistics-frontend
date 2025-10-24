import { useState, useCallback, useRef } from 'react';

interface UseSearchableDropdownOptions {
  initialSearchQuery?: string;
  debounceMs?: number;
}

export function useSearchableDropdown({
  initialSearchQuery = '',
  debounceMs = 300,
}: UseSearchableDropdownOptions = {}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearchQuery);

  // Debounce search query
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
  }, [debounceMs]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  return {
    searchQuery,
    debouncedQuery,
    handleSearch,
    clearSearch,
  };
}

