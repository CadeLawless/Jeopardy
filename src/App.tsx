import { useEffect } from 'react'
import { useAuthStore } from '@/context/authContext'
import AppHeader from '@/components/AppHeader'
import AppRoutes from '@/routes/AppRoutes'
import RouteWatcher from './components/RouteWatcher'

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore()
  
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <div id="app">
      {isAuthenticated && <AppHeader />}
      
      <main className="main-content">
        <RouteWatcher />
        <AppRoutes />
      </main>
    </div>
  )
}

export default App