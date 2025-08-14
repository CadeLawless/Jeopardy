import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/context/authContext'
import { useGameBoardStore } from '@/context/gameBoardContext'
import type { Question } from '@/types'
import styles from './PlayGame.module.css'
import ScrollingGameHeader from '@/components/ScrollingGameHeader'

const PlayGame: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { 
    gameBoards, 
    currentGameBoard, 
    currentSession, 
    questionStates, 
    fetchGameBoards,
    setCurrentGameBoard,
    startGameSession,
    updateGameSession,
    updateQuestionState,
    calculateScore,
    isGameComplete,
    setCurrentSession,
    setQuestionStates
  } = useGameBoardStore()

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showGameComplete, setShowGameComplete] = useState(false)
  const [showPlayerSetup, setShowPlayerSetup] = useState(true)
  const [playerName, setPlayerName] = useState('')

  const currentScore = calculateScore()

  const containerStyle = {
    backgroundColor: currentGameBoard?.theme.background_color || '#0f1419',
    backgroundImage: currentGameBoard?.theme.background_image ? `url(${currentGameBoard.theme.background_image})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }

  const headerStyle = {
    backgroundColor: currentGameBoard?.theme.header_color || '#3b82f6',
    color: currentGameBoard?.theme.header_text_color || '#ffffff'
  }

  const titleStyle = {
    color: currentGameBoard?.theme.title_color || '#60a5fa'
  }

  const scoreStyle = {
    color: currentGameBoard?.theme.title_color || '#60a5fa'
  }

  const categoryHeaderStyle = {
    backgroundColor: currentGameBoard?.theme.header_color || '#3b82f6',
    color: currentGameBoard?.theme.header_text_color || '#ffffff',
    borderRadius: `${currentGameBoard?.theme.border_radius || 8}px`
  }

  const modalStyle = {
    borderRadius: `${currentGameBoard?.theme.border_radius || 8}px`
  }

  const getQuestionCardClass = (questionId: string) => {
    const state = questionStates.find(qs => qs.id === questionId)
    return {
      'revealed': state?.revealed,
      'answered': state?.answered,
      'correct': state?.correct,
      'incorrect': state?.answered && !state?.correct
    }
  }

  const getQuestionCardStyle = (questionId: string) => {
    const state = questionStates.find(qs => qs.id === questionId)
    const theme = currentGameBoard?.theme
    
    if (state?.answered) {
      return {
        backgroundColor: state.correct ? '#10b981' : '#ef4444',
        color: '#ffffff',
        borderRadius: `${theme?.border_radius || 8}px`,
        cursor: 'not-allowed'
      }
    }
    
    return {
      backgroundColor: theme?.card_color || '#1e40af',
      color: theme?.card_text_color || '#ffffff',
      borderRadius: `${theme?.border_radius || 8}px`
    }
  }

  const loadGameBoard = async () => {
    if (!id || !user) return
    
    try {
      // Find the game board in the store or fetch it
      let gameBoard = gameBoards.find(gb => gb.id === id)
      
      if (!gameBoard) {
        await fetchGameBoards(user.id)
        gameBoard = gameBoards.find(gb => gb.id === id)
      }
      
      if (!gameBoard) {
        navigate('/game-boards')
        return
      }
      
      setCurrentGameBoard(gameBoard)
    } catch (error) {
      console.error('Error loading game board:', error)
      navigate('/game-boards')
    }
  }

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim() || !id) return
    
    const { error } = await startGameSession(id, playerName.trim())
    
    if (error) {
      alert('Failed to start game session')
      return
    }
    
    setShowPlayerSetup(false)
  }

  const selectQuestion = (question: Question) => {
    const state = questionStates.find(qs => qs.id === question.id)
    if (state?.answered) return
    
    setSelectedQuestion(question)
    setShowAnswer(false)
    
    // Mark question as revealed
    updateQuestionState(question.id, { revealed: true })
  }

  const revealAnswer = () => {
    setShowAnswer(true)
  }

  const markAnswer = async (correct: boolean) => {
    if (!selectedQuestion || !currentSession) return
    
    // Update question state
    updateQuestionState(selectedQuestion.id, {
      answered: true,
      correct
    })
    
    // Update session score
    const newScore = calculateScore()
    await updateGameSession(currentSession.id, {
      score: newScore,
      completed_questions: [...(currentSession.completed_questions || []), selectedQuestion.id]
    })
    
    closeModal()
    
    // Check if game is complete
    if (isGameComplete()) {
      setTimeout(() => {
        setShowGameComplete(true)
      }, 500)
    }
  }

  const closeModal = () => {
    setSelectedQuestion(null)
    setShowAnswer(false)
  }

  const playAgain = () => {
    setShowGameComplete(false)
    setShowPlayerSetup(true)
    setPlayerName('')
    setCurrentSession(null)
    setQuestionStates([])
  }

  const endGame = () => {
    if (confirm('Are you sure you want to end the current game?')) {
      navigate('/game-boards')
    }
  }

  useEffect(() => {
    loadGameBoard()
  }, [id, user])

  return (
    <div className={styles.playGameContainer} style={containerStyle}>
      <div className={styles.gameHeader} style={headerStyle}>
        <h1 className={styles.gameTitle} style={titleStyle}>{currentGameBoard?.title}</h1>
        <div className={styles.gameInfo}>
          <div className={styles.playerInfo}>
            <span className={styles.playerName}>{currentSession?.player_name}</span>
            <span className={styles.score} style={scoreStyle}>Score: ${currentScore}</span>
          </div>
          <button onClick={endGame} className={styles.endGameBtn}>End Game</button>
        </div>
      </div>
      
      {currentGameBoard && (
        <div className={styles.gameBoard}>
          <div className={styles.categoriesHeader}>
            {currentGameBoard.categories.map(category => (
              <ScrollingGameHeader
                text={category.name}
                key={category.id}
                categoryHeaderStyle={categoryHeaderStyle}
              />
            ))}
          </div>
          
          <div className={styles.questionsGrid}>
            {currentGameBoard.categories.map(category => (
              <div key={category.id} className={styles.categoryColumn}>
                {category.questions.map(question => (
                  <div
                    key={question.id}
                    className={`${styles.questionCard} ${Object.entries(getQuestionCardClass(question.id))
                      .filter(([_, value]) => value)
                      .map(([key]) => key)
                      .join(' ')}`}
                    style={getQuestionCardStyle(question.id)}
                    onClick={() => selectQuestion(question)}
                  >
                    <div className={styles.cardContent}>
                      <span className={styles.pointValue}>${question.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Question Modal */}
      {selectedQuestion && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className={styles.questionModal} onClick={(e) => e.stopPropagation()} style={{...modalStyle, backgroundColor: currentGameBoard?.theme.card_color }}>
            <div className="modal-header" style={headerStyle}>
              <h2>{selectedQuestion.points} Points</h2>
              <button onClick={closeModal} className="close-btn">&times;</button>
            </div>
            
            <div className="modal-content" style={{ backgroundColor: currentGameBoard?.theme.card_color }}>
              {!showAnswer ? (
                <div className={styles.questionDisplay} style={{ backgroundColor: currentGameBoard?.theme.card_color, color: currentGameBoard?.theme.card_text_color }}>
                  <h3 style={{ color: currentGameBoard?.theme.card_text_color }}>Question:</h3>
                  <p className={styles.questionText} style={{ backgroundColor: currentGameBoard?.theme.card_color, color: currentGameBoard?.theme.card_text_color }}>{selectedQuestion.question}</p>
                  <button onClick={revealAnswer} className={styles.revealBtn}>Reveal Answer</button>
                </div>
              ) : (
                <div className={styles.answerDisplay}>
                  <h3 style={{ color: currentGameBoard?.theme.card_text_color }}>Answer:</h3>
                  <p className={styles.answerText} style={{ backgroundColor: currentGameBoard?.theme.card_color, color: currentGameBoard?.theme.card_text_color }}>{selectedQuestion.answer}</p>
                  
                  <div className={styles.scoringControls}>
                    <button onClick={() => markAnswer(true)} className={styles.correctBtn}>Correct</button>
                    <button onClick={() => markAnswer(false)} className={styles.incorrectBtn}>Incorrect</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Game Complete Modal */}
      {showGameComplete && (
        <div className="modal-overlay">
          <div className={styles.gameCompleteModal} onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <div className="modal-header" style={headerStyle}>
              <h2>Game Complete!</h2>
            </div>
            
            <div className="modal-content">
              <div className={styles.finalScore}>
                <h3>Final Score</h3>
                <p className={styles.scoreDisplay} style={scoreStyle}>${currentScore}</p>
                <p className={styles.playerName}>{currentSession?.player_name}</p>
              </div>
              
              <div className={styles.gameActions}>
                <button onClick={playAgain} className={styles.playAgainBtn}>Play Again</button>
                <Link to="/game-boards" className={styles.backBtn}>Back to Games</Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Player Setup Modal */}
      {showPlayerSetup && (
        <div className="modal-overlay">
          <div className={styles.playerSetupModal} onClick={(e) => e.stopPropagation()} style={{...modalStyle, backgroundColor: currentGameBoard?.theme.card_color }}>
            <div className="modal-header" style={headerStyle}>
              <h2>Start New Game</h2>
            </div>
            
            <div className={styles.playerSetupModal} style={{ backgroundColor: currentGameBoard?.theme.card_color }}>
              <form onSubmit={handleStartGame} className={styles.playerSetupForm}>
                <div className="form-group">
                  <label htmlFor="playerName" style={{ color: currentGameBoard?.theme.card_text_color }}>Player Name</label>
                  <input
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter player name"
                  />
                </div>
                
                <div className={styles.formActions}>
                  <Link to="/game-boards" className={styles.cancelBtn}>Cancel</Link>
                  <button type="submit" className={styles.startBtn}>Start Game</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayGame