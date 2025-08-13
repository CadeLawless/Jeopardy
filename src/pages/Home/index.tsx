import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/context/authContext'
import { useGameBoardStore } from '@/context/gameBoardContext'
import GameBoardCard from '@/components/GameBoardCard'
import styles from './Home.module.css'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { gameBoards, fetchGameBoards } = useGameBoardStore()

  const recentGames = gameBoards.slice(0, 3)
  
  const totalQuestions = gameBoards.reduce((total, board) => {
    return total + board.categories.reduce((catTotal, category) => {
      return catTotal + category.questions.length
    }, 0)
  }, 0)

  const playGame = (id: string) => {
    navigate(`/game-boards/${id}/play`)
  }

  const editGame = (id: string) => {
    navigate(`/game-boards/${id}/edit`)
  }

  const deleteGame = async (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      const { deleteGameBoard } = useGameBoardStore.getState()
      await deleteGameBoard(id)
    }
  }

  useEffect(() => {
    if (user) {
      fetchGameBoards(user.id)
    }
  }, [user, fetchGameBoards])

  return (
    <div className={styles.homeContainer}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to Jeopardy Creator</h1>
          <p className={styles.heroSubtitle}>
            Create custom Jeopardy games with personalized categories, questions, and themes. 
            Perfect for classrooms, parties, or family game nights!
          </p>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{gameBoards.length}</div>
              <div className={styles.statLabel}>Games Created</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{totalQuestions}</div>
              <div className={styles.statLabel}>Questions Written</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>5</div>
              <div className={styles.statLabel}>Theme Options</div>
            </div>
          </div>
          
          <div className={styles.ctaButtons}>
            <Link to="/game-boards/create" className={`${styles.ctaButton} ${styles.primary}`}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Game
            </Link>
            
            <Link to="/game-boards" className={`${styles.ctaButton} ${styles.secondary}`}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Browse My Games
            </Link>
          </div>
        </div>
      </div>
      
      {recentGames.length > 0 && (
        <div className={styles.recentGames}>
          <h2>Recent Games</h2>
          <div className={styles.gamesGrid}>
            {recentGames.map(gameBoard => (
              <GameBoardCard
                key={gameBoard.id}
                gameBoard={gameBoard}
                onPlay={() => playGame(gameBoard.id)}
                onEdit={() => editGame(gameBoard.id)}
                onDelete={() => deleteGame(gameBoard.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.featuresSection}>
        <h2>Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Easy Game Creation</h3>
            <p>Create custom Jeopardy boards with your own categories and questions in minutes.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3>Theme Customization</h3>
            <p>Choose from beautiful themes or customize colors, fonts, and backgrounds to match your style.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3>Score Tracking</h3>
            <p>Keep track of player scores with our built-in scoring system during gameplay.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3>Save & Reuse</h3>
            <p>Save your games and play them multiple times with different groups of people.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home