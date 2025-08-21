import React from 'react'

export default function Button({ children, type='button', onClick, disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full py-2.5 rounded-lg bg-gray-900 text-white font-medium disabled:opacity-60 hover:bg-black transition"
    >
      {children}
    </button>
  )
}
