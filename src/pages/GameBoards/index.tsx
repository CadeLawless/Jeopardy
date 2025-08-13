import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/context/authContext'
import { useGameBoardStore } from '@/context/gameBoardContext'
import GameBoardCard from '@/components/GameBoardCard'
import styles from './GameBoards.module.css'

const GameBoards: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { gameBoards, loading, fetchGameBoards, deleteGameBoard } = useGameBoardStore()

  const playGame = (id: string) => {
    navigate(`/game-boards/${id}/play`)
  }

  const editGame = (id: string) => {
    navigate(`/game-boards/${id}/edit`)
  }

  const handleDeleteGame = async (id: string) => {
    if (confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      const { error } = await deleteGameBoard(id)
      if (error) {
        alert('Failed to delete game board. Please try again.')
      }
    }
  }

  useEffect(() => {
    if (user) {
      fetchGameBoards(user.id)
    }
  }, [user, fetchGameBoards])

  return (
    <div className={styles.gameBoardsContainer}>
      <div className="page-header">
        <div className="header-content">
          <h1>My Game Boards</h1>
          <p>Create, edit, and manage your Jeopardy games</p>
          
          <Link to="/game-boards/create" className="create-button">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Game
          </Link>
        </div>
      </div>
      
      <div className="content">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading your games...</p>
          </div>
        ) : gameBoards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2>No games yet</h2>
            <p>Create your first Jeopardy game to get started!</p>
            <Link to="/game-boards/create" className="create-button">
              Create Your First Game
            </Link>
          </div>
        ) : (
          <div className={styles.gamesGrid}>
            {gameBoards.map(gameBoard => (
              <GameBoardCard
                key={gameBoard.id}
                gameBoard={gameBoard}
                onPlay={() => playGame(gameBoard.id)}
                onEdit={() => editGame(gameBoard.id)}
                onDelete={() => handleDeleteGame(gameBoard.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GameBoards