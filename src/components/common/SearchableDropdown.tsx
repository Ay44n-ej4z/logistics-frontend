'use client';

import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

interface SearchableDropdownProps {
  options: Array<{ id: string; name: string; [key: string]: any }> | any;
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder: string;
  searchPlaceholder?: string;
  displayKey?: string;
  searchKey?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  onSearch?: (query: string) => void;
  loading?: boolean;
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder = 'Search...',
  displayKey = 'name',
  searchKey = 'name',
  disabled = false,
  error,
  className = '',
  onSearch,
  loading = false,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  useEffect(() => {
    const optionsArray = Array.isArray(options) ? options : [];
    if (searchQuery.trim() === '') {
      setFilteredOptions(optionsArray);
    } else {
      const filtered = optionsArray.filter((option) =>
        option[searchKey]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchQuery, options, searchKey]);

  // Handle search with debounce
  useEffect(() => {
    if (onSearch) {
      const timeoutId = setTimeout(() => {
        onSearch(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, onSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedOption = Array.isArray(options) ? options.find((option) => option.id === value) : undefined;

  const handleSelect = (option: any) => {
    onChange(option.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange(undefined);
    setSearchQuery('');
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div
        className={`input-field cursor-pointer flex items-center justify-between ${
          error ? 'border-red-500' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption[displayKey] : placeholder}
        </span>
        <div className="flex items-center space-x-1">
          {selectedOption && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <Icon icon="mdi:close" className="w-4 h-4" />
            </button>
          )}
          <Icon
            icon={isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}
            className="w-4 h-4 text-gray-400"
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Icon
                icon="mdi:magnify"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <Icon icon="mdi:loading" className="animate-spin w-5 h-5 mx-auto mb-2" />
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery ? 'No results found' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option: any) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                    value === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  {option[displayKey]}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
