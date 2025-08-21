import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center p-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">404 — Not Found</h1>
        <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
        <Link to="/" className="px-4 py-2 rounded-lg bg-gray-900 text-white">Go Home</Link>
      </div>
    </div>
  )
}
