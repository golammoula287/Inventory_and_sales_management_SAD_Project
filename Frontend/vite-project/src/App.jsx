import React from 'react'
import AppRouter from './routes/AppRouter.jsx'
import Navbar from './components/Navbar.jsx'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content should take all available space */}
      <main className="flex-1">
        <AppRouter />
      </main>

      
    </div>
  )
}

export default App
