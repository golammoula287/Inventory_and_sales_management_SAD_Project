import React from 'react'

export default function TextInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  autoComplete,
  required = false,
  error,
}) {
  const id = name || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
