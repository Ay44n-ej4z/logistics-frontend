'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  id: string;
  name: string;
  code?: string;
  email?: string;
  type?: string;
  [key: string]: any;
}

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
  onAddNew?: () => void;
  addNewLabel?: string;
  showCode?: boolean;
  showEmail?: boolean;
  showType?: boolean;
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
  onAddNew,
  addNewLabel = 'Add New',
  showCode = false,
  showEmail = false,
  showType = false,
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

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setSearchQuery('');
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button - IDENTICAL TO NATIVE SELECT */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 rounded-lg border transition-all duration-200
          flex items-center justify-between text-left
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
          ${error 
            ? 'border-red-300 bg-red-50 hover:border-red-400' 
            : 'border-gray-300 bg-white hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}
          appearance-none
        `}
        disabled={disabled}
      >
        <span className="truncate flex-1 text-left pr-6">
          {selectedOption ? selectedOption[displayKey] : placeholder}
        </span>
        
        {/* ARROW - POSITIONED IDENTICALLY TO NATIVE SELECT */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className="h-4 w-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Clear button - positioned over the arrow */}
        {selectedOption && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-6 flex items-center pr-1 z-10"
            title="Clear selection"
          >
            <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden"
            style={{ minWidth: '100%' }}
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900"
              />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-500">Loading...</p>
              </div>
            )}

            {/* Options List */}
            {!loading && (
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">
                      {searchQuery ? 'No results found' : 'No options available'}
                    </p>
                  </div>
                ) : (
                  filteredOptions.map((option: any) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`
                        w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 
                        focus:outline-none transition-colors duration-150 border-b border-gray-100 last:border-b-0
                        ${value === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                        focus:ring-2 focus:ring-blue-500
                      `}
                    >
                      <div className="flex flex-col">
                        <div className="font-medium">{option[displayKey]}</div>
                        {(showCode && option.code) && (
                          <div className="text-xs text-gray-500 mt-1">Code: {option.code}</div>
                        )}
                        {(showEmail && option.email) && (
                          <div className="text-xs text-gray-500 mt-1">{option.email}</div>
                        )}
                        {(showType && option.type) && (
                          <div className="text-xs text-gray-500 mt-1 capitalize">
                            Type: {option.type}
                          </div>
                        )}
                      </div>
                      {value === option.id && (
                        <div className="mt-1 text-xs font-medium text-blue-600">
                          Selected
                        </div>
                      )}
                    </button>
                  ))
                )}

                {/* Add New Button */}
                {onAddNew && !loading && (
                  <div className="border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setSearchQuery('');
                        onAddNew();
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 text-blue-600 font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      + {addNewLabel}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}