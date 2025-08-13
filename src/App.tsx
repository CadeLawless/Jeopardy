import React, { useEffect } from 'react'
import { useAuthStore } from '@/context/authContext'
import AppHeader from '@/components/AppHeader'
import AppRoutes from '@/routes/AppRoutes'

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <div id="app">
      {isAuthenticated && <AppHeader />}
      
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  )
}

export default App