'use client';

import SearchableDropdown from './SearchableDropdown';

export const transportModes = [
  { id: 'airways', name: 'Airways' },
  { id: 'seaways', name: 'Seaways' },
  { id: 'roadways', name: 'Roadways' },
  { id: 'railways', name: 'Railways' },
];

type TransportMode = 'airways' | 'seaways' | 'roadways' | 'railways';

interface Props {
  value: TransportMode;
  onChange: (value: TransportMode) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function ModeOfTransportDropdown({ value, onChange, error, disabled, required = true }: Props) {
  return (
    <div className="w-full">
      <SearchableDropdown
        options={transportModes}
        value={value}
        onChange={(val) => onChange(val as TransportMode)}
        placeholder="Select Mode of Transport"
        displayKey="name"
        searchKey="name"
        disabled={disabled}
        error={error}
        className="w-full"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {required && !value && <p className="mt-1 text-sm text-red-600">Mode of Transport is required</p>}
    </div>
  );
}