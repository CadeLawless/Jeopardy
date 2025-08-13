import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/context/authContext'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import GameBoards from '@/pages/GameBoards'
import CreateGameBoard from '@/pages/CreateGameBoard'
import EditGameBoard from '@/pages/EditGameBoard'
import PlayGame from '@/pages/PlayGame'

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
      />
      <Route 
        path="/profile" 
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/game-boards" 
        element={isAuthenticated ? <GameBoards /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/game-boards/create" 
        element={isAuthenticated ? <CreateGameBoard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/game-boards/:id/edit" 
        element={isAuthenticated ? <EditGameBoard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/game-boards/:id/play" 
        element={isAuthenticated ? <PlayGame /> : <Navigate to="/login" />} 
      />
    </Routes>
  )
}

export default AppRoutes