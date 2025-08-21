import React from 'react'
import AppRouter from './routes/AppRouter.jsx'
import Navbar from './components/Navbar.jsx'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AppRouter />
      </main>
      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Munna Enterprise — Inventory & Profit System
      </footer>
    </div>
  )
}

export default App
