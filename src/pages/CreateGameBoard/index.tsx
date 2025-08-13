import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/context/authContext'
import { useGameBoardStore } from '@/context/gameBoardContext'
import type { GameBoard, Category, Question, GameTheme } from '@/types'
import { DEFAULT_THEMES } from '@/types'
import styles from './CreateGameBoard.module.css'

const CreateGameBoard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { createGameBoard, loading } = useGameBoardStore()
  
  const [selectedTheme, setSelectedTheme] = useState<GameTheme | null>(null)
  const [gameBoard, setGameBoard] = useState<Omit<GameBoard, 'id' | 'created_at' | 'updated_at'>>({
    user_id: "",
    title: "",
    description: "",
    categories: [],
    theme: DEFAULT_THEMES[0]
  });

  useEffect(() => {
    const saved = localStorage.getItem("gameBoard");
    if (saved) {
      try {
        setGameBoard(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gameBoard", JSON.stringify(gameBoard));
  }, [gameBoard]);

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const createDefaultCategories = (): Category[] => {
    const categories: Category[] = []
    for (let i = 0; i < 5; i++) {
      const questions: Question[] = []
      for (let j = 0; j < 4; j++) {
        questions.push({
          id: generateId(),
          points: (j + 1) * 100,
          question: '',
          answer: ''
        })
      }
      categories.push({
        id: generateId(),
        name: '',
        questions
      })
    }
    return categories
  }

  const selectTheme = (theme: GameTheme) => {
    const newTheme = { ...theme }
    setSelectedTheme(newTheme)
    setGameBoard(prev => ({ ...prev, theme: newTheme }))
  }

  const getThemePreviewStyle = (theme: GameTheme) => ({
    backgroundColor: theme.background_color,
    padding: '1rem',
    borderRadius: '8px',
    minHeight: '100px'
  })

  const addCategory = () => {
    if (gameBoard.categories.length < 6) {
      const questions: Question[] = []
      for (let i = 0; i < 4; i++) {
        questions.push({
          id: generateId(),
          points: (i + 1) * 100,
          question: '',
          answer: ''
        })
      }
      setGameBoard(prev => ({
        ...prev,
        categories: [...prev.categories, {
          id: generateId(),
          name: '',
          questions
        }]
      }))
    }
  }

  const removeCategory = (index: number) => {
    if (gameBoard.categories.length > 5) {
      setGameBoard(prev => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== index)
      }))
    }
  }

  const updateCategory = (index: number, name: string) => {
    setGameBoard(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === index ? { ...cat, name } : cat
      )
    }))
  }

  const updateQuestion = (categoryIndex: number, questionIndex: number, field: 'question' | 'answer', value: string) => {
    setGameBoard(prev => ({
      ...prev,
      categories: prev.categories.map((cat, catIdx) => 
        catIdx === categoryIndex 
          ? {
              ...cat,
              questions: cat.questions.map((q, qIdx) => 
                qIdx === questionIndex ? { ...q, [field]: value } : q
              )
            }
          : cat
      )
    }))
  }

  const updateTheme = (field: keyof GameTheme, value: any) => {
    if (selectedTheme) {
      const newTheme = { ...selectedTheme, [field]: value }
      setSelectedTheme(newTheme)
      setGameBoard(prev => ({ ...prev, theme: newTheme }))
    }
  }

  const isFormValid = () => {
    return gameBoard.title.trim() !== '' &&
           gameBoard.categories.length >= 5 &&
           gameBoard.categories.every(cat => 
             cat.name.trim() !== '' &&
             cat.questions.every(q => q.question.trim() !== '' && q.answer.trim() !== '')
           )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !isFormValid()) return
    
    const { error } = await createGameBoard({
      ...gameBoard,
      user_id: user.id
    })
    
    if (error) {
      alert('Failed to create game board. Please try again.')
    } else {
      navigate('/game-boards')
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("gameBoard");
    if (saved) {
      try {
        setGameBoard(JSON.parse(saved));
      } catch {}
    } else {
      if (user) {
        setGameBoard(prev => ({
          ...prev,
          user_id: user.id,
          categories: createDefaultCategories()
        }))
        selectTheme(DEFAULT_THEMES[0])
      }
    }
  }, [user]);

  return (
    <div className={styles.createGameBoard}>
      <div className="page-header">
        <div className="header-content">
          <h1>Create New Game Board</h1>
          <p>Design your custom Jeopardy game with categories, questions, and themes</p>
        </div>
      </div>
      
      <div className="content">
        <form onSubmit={handleSubmit} className={styles.gameForm}>
          {/* Basic Information */}
          <div className={styles.formSection}>
            <h2>Game Information</h2>
            <div className="form-group">
              <label htmlFor="title">Game Title *</label>
              <input
                id="title"
                value={gameBoard.title}
                onChange={(e) => setGameBoard(prev => ({ ...prev, title: e.target.value }))}
                type="text"
                required
                placeholder="Enter your game title"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={gameBoard.description}
                onChange={(e) => setGameBoard(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of your game"
                className="form-textarea"
                rows={3}
              />
            </div>
          </div>

          {/* Theme Selection */}
          <div className={styles.formSection}>
            <h2>Theme Selection</h2>
            <div className={styles.themeGrid}>
              {DEFAULT_THEMES.map(theme => (
                <div
                  key={theme.name}
                  className={`${styles.themeCard} ${selectedTheme?.name === theme.name ? styles.active : ''}`}
                  onClick={() => selectTheme(theme)}
                >
                  <div className={styles.themePreview} style={getThemePreviewStyle(theme)}>
                    <div 
                      className={styles.previewHeader} 
                      style={{ 
                        backgroundColor: theme.header_color, 
                        color: theme.header_text_color 
                      }}
                    >
                      {theme.name}
                    </div>
                    <div 
                      className={styles.previewCard} 
                      style={{ 
                        backgroundColor: theme.card_color, 
                        color: theme.card_text_color, 
                        borderRadius: theme.border_radius + 'px' 
                      }}
                    >
                      $200
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Custom Theme Controls */}
            {selectedTheme && (
              <div className={styles.customThemeControls}>
                <h3>Customize Theme</h3>
                <div className={styles.colorControls}>
                  <div className={styles.colorGroup}>
                    <label>Background Color</label>
                    <input 
                      value={selectedTheme.background_color} 
                      onChange={(e) => updateTheme('background_color', e.target.value)}
                      type="color" 
                      className={styles.colorInput} 
                    />
                  </div>
                  <div className={styles.colorGroup}>
                    <label>Card Color</label>
                    <input 
                      value={selectedTheme.card_color} 
                      onChange={(e) => updateTheme('card_color', e.target.value)}
                      type="color" 
                      className={styles.colorInput} 
                    />
                  </div>
                  <div className={styles.colorGroup}>
                    <label>Card Text Color</label>
                    <input 
                      value={selectedTheme.card_text_color} 
                      onChange={(e) => updateTheme('card_text_color', e.target.value)}
                      type="color" 
                      className={styles.colorInput} 
                    />
                  </div>
                  <div className={styles.colorGroup}>
                    <label>Header Color</label>
                    <input 
                      value={selectedTheme.header_color} 
                      onChange={(e) => updateTheme('header_color', e.target.value)}
                      type="color" 
                      className={styles.colorInput} 
                    />
                  </div>
                  <div className={styles.colorGroup}>
                    <label>Header Text Color</label>
                    <input 
                      value={selectedTheme.header_text_color} 
                      onChange={(e) => updateTheme('header_text_color', e.target.value)}
                      type="color" 
                      className={styles.colorInput} 
                    />
                  </div>
                  <div className={styles.colorGroup}>
                    <label>Title Color</label>
                    <input 
                      value={selectedTheme.title_color} 
                      onChange={(e) => updateTheme('title_color', e.target.value)}
                      type="color" 
                      className={styles.colorInput} 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Border Radius (px)</label>
                  <input
                    value={selectedTheme.border_radius}
                    onChange={(e) => updateTheme('border_radius', Number(e.target.value))}
                    type="range"
                    min="0"
                    max="20"
                    className={styles.rangeInput}
                  />
                  <span className={styles.rangeValue}>{selectedTheme.border_radius}px</span>
                </div>
              </div>
            )}
          </div>

          {/* Categories and Questions */}
          <div className={styles.formSection}>
            <h2>Categories & Questions</h2>
            <div className={styles.categoriesContainer}>
              {gameBoard.categories.map((category, categoryIndex) => (
                <div key={category.id} className={styles.categorySection}>
                  <div className={styles.categoryHeader}>
                    <input
                      value={category.name}
                      onChange={(e) => updateCategory(categoryIndex, e.target.value)}
                      type="text"
                      placeholder={`Category ${categoryIndex + 1}`}
                      className={styles.categoryInput}
                      required
                    />
                    {gameBoard.categories.length > 5 && (
                      <button
                        type="button"
                        onClick={() => removeCategory(categoryIndex)}
                        className={styles.removeButton}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className={styles.questionsGrid}>
                    {category.questions.map((question, questionIndex) => (
                      <div key={question.id} className={styles.questionCard}>
                        <div className={styles.questionHeader}>
                          <span className={styles.points}>${question.points}</span>
                        </div>
                        <div className={styles.questionInputs}>
                          <textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(categoryIndex, questionIndex, 'question', e.target.value)}
                            placeholder="Enter the question"
                            className={styles.questionTextarea}
                            rows={2}
                            required
                          />
                          <textarea
                            value={question.answer}
                            onChange={(e) => updateQuestion(categoryIndex, questionIndex, 'answer', e.target.value)}
                            placeholder="Enter the answer"
                            className={styles.answerTextarea}
                            rows={2}
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {gameBoard.categories.length < 6 && (
              <button
                type="button"
                onClick={addCategory}
                className={styles.addCategoryButton}
              >
                Add Category
              </button>
            )}
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link to="/game-boards" className={styles.cancelButton}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className={styles.submitButton}
            >
              {loading ? 'Creating...' : 'Create Game Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateGameBoard