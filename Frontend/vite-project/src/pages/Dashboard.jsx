import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-gray-700">
        Welcome {user?.name ? user.name : user?.email ? user.email : 'back'}!
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white shadow p-4">
          <div className="text-sm text-gray-500">Quick Stat</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
        <div className="rounded-2xl bg-white shadow p-4">
          <div className="text-sm text-gray-500">Stock Value</div>
          <div className="text-2xl font-semibold">৳ —</div>
        </div>
        <div className="rounded-2xl bg-white shadow p-4">
          <div className="text-sm text-gray-500">Today's Sales</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
      </div>
    </div>
  )
}
