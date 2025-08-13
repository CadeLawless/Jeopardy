import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/context/authContext'
import { useGameBoardStore } from '@/context/gameBoardContext'
import { type GameBoard, type Category, DEFAULT_THEMES } from '@/types'
import styles from '../../components/GameBoardForm/GameBoardForm.module.css'
import GameBoardForm, { GameBoardFormData } from '@/components/GameBoardForm'

const EditGameBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { gameBoards, fetchGameBoards, updateGameBoard, loading } = useGameBoardStore()
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [initialGameData, setInitialGameData] = useState({
    title: '',
    description: '',
    categories: [] as Category[],
    theme: DEFAULT_THEMES[0]
  });

  useEffect(() => {
    const saved = localStorage.getItem("gameData");
    if (saved) {
      try {
        setInitialGameData(JSON.parse(saved));
        return; // skip API fetch if we already have localStorage data
      } catch {}
    } 

    if (id && user) {
      loadGameBoard();
    }
  }, [id, user])

  const loadGameBoard = async () => {
    if (!id || !user) return
    
    setIsLoading(true)
    try {
      // Find the game board in the store or fetch it
      let gameBoard = gameBoards.find(gb => gb.id === id)
      
      if (!gameBoard) {
        await fetchGameBoards(user.id)
        gameBoard = gameBoards.find(gb => gb.id === id)
      }
      
      if (!gameBoard) {
        setMessage('Game board not found')
        setMessageType('error')
        navigate('/game-boards')
        return
      }
      
      // Populate form data
      setInitialGameData({
        title: gameBoard.title,
        description: gameBoard.description || '',
        categories: JSON.parse(JSON.stringify(gameBoard.categories)),
        theme: gameBoard.theme
      })
      
    } catch (error) {
      setMessage('Failed to load game board')
      setMessageType('error')
      console.error('Error loading game board:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateGameBoard = async (gameData: GameBoardFormData) => {
    if (!user || !id) return
    
    const updatedGameBoard: Partial<GameBoard> = {
      title: gameData.title,
      description: gameData.description,
      categories: gameData.categories,
      theme: gameData.theme,
      updated_at: new Date().toISOString()
    }
    
    const { error } = await updateGameBoard(id, updatedGameBoard)
    
    if (error) {
      setMessage(error.message || 'Failed to update game board')
      setMessageType('error')
    } else {
      setMessage('Game board updated successfully!')
      setMessageType('success')
      setTimeout(() => {
        navigate('/game-boards')
      }, 2000)
    }
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  if (isLoading) {
    return (
      <div className={styles.editGameBoardContainer}>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading game board...</p>
        </div>
      </div>
    )
  }

  return (
    <GameBoardForm
      initialData={initialGameData}
      onSubmit={handleUpdateGameBoard}
      loading={loading}
      message={message}
      messageType={messageType}
      edit={true}
    />
  )
}

export default EditGameBoard