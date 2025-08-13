import { useState, useEffect } from "react"
import { Category, DEFAULT_THEMES, GameTheme, Question } from "@/types"
import styles from './GameBoardForm.module.css'
import { Link } from "react-router-dom"

export interface GameBoardFormData {
    title: string;
    description: string;
    categories: Category[];
    theme: GameTheme;
}

interface GameBoardFormProps {
    initialData?: GameBoardFormData;
    onSubmit: (data: GameBoardFormData) => void;
    message?: string;
    messageType?: string;
    isLoading?: boolean;
    loading: boolean;
    edit: boolean;
}

const GameBoardForm = ({
    initialData,
    onSubmit,
    message,
    messageType,
    isLoading,
    loading,
    edit,
}: GameBoardFormProps) => {
    const generateId = () => Math.random().toString(36).slice(2, 11)

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

    const [gameData, setGameData] = useState({
      title: '',
      description: '',
      categories: createDefaultCategories(),
      theme: DEFAULT_THEMES[0],
    })

    // Fill form when editing
    useEffect(() => {
        if (initialData) {
            setGameData(initialData);
        }
    }, [initialData]);

    if (edit) {
        useEffect(() => {
            if(!isLoading) localStorage.setItem("gameData", JSON.stringify(gameData));
          }, [gameData])        
    }
    
    const getThemePreviewStyle = (theme: GameTheme) => ({
        backgroundColor: theme.background_color,
        backgroundImage: theme.background_image ? `url(${theme.background_image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    })
  
    const addCategory = () => {
        const newCategory: Category = {
        id: `cat_${Date.now()}`,
        name: '',
        questions: [
            { id: `q_${Date.now()}_1`, points: 100, question: '', answer: '' },
            { id: `q_${Date.now()}_2`, points: 200, question: '', answer: '' },
            { id: `q_${Date.now()}_3`, points: 300, question: '', answer: '' },
            { id: `q_${Date.now()}_4`, points: 400, question: '', answer: '' }
        ]
        }
        setGameData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
        }))
    }
    
    const removeCategory = (index: number) => {
        setGameData(prev => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== index)
        }))
    }
    
    const updateCategory = (index: number, name: string) => {
        setGameData(prev => ({
        ...prev,
        categories: prev.categories.map((cat, i) => 
            i === index ? { ...cat, name } : cat
        )
        }))
    }
    
    const updateQuestion = (categoryIndex: number, questionIndex: number, field: 'question' | 'answer', value: string) => {
        setGameData(prev => ({
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
        if (gameData.theme) {
            setGameData(prev => ({
                ...prev,
                theme: {
                    ...prev.theme,
                    [field]: value
                }
            }));
        }
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(gameData);
      };

    return (
        <div className={styles.editGameBoardContainer}>
            <div className="page-header">
            <div className="header-content">
                <h1>Edit Game Board</h1>
                <p>Modify your Jeopardy game settings and content</p>
            </div>
            </div>
            
            <div className="content">
            <form onSubmit={handleSubmit} className={styles.gameForm}>
                {/* Basic Information */}
                <div className={styles.formSection}>
                <h2>Game Information</h2>
                
                <div className="form-group">
                    <label htmlFor="title">Game Title</label>
                    <input
                    id="title"
                    value={gameData.title}
                    onChange={(e) => setGameData(prev => ({ ...prev, title: e.target.value }))}
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter game title"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea
                    id="description"
                    value={gameData.description}
                    onChange={(e) => setGameData(prev => ({ ...prev, description: e.target.value }))}
                    className="form-textarea"
                    placeholder="Brief description of your game"
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
                        className={`${styles.themeOption} ${gameData.theme?.name === theme.name ? styles.active : ''}`}
                        onClick={() => setGameData(prev => ({ ...prev, theme}))}
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
                        <div className={styles.previewCards}>
                            {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className={styles.previewCard}
                                style={{ 
                                backgroundColor: theme.card_color, 
                                color: theme.card_text_color, 
                                borderRadius: theme.border_radius + 'px' 
                                }}
                            >
                                ${i * 100}
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
                
                {/* Custom Theme */}
                {gameData.theme && (
                <div className={styles.formSection}>
                    <h2>Customize Theme</h2>
                    
                    <div className={styles.themeCustomization}>
                    <div className={styles.colorControls}>
                        <div className={styles.colorGroup}>
                        <label>Background Color</label>
                        <input
                            value={gameData.theme.background_color}
                            onChange={(e) => updateTheme('background_color', e.target.value)}
                            type="color"
                            className={styles.colorInput}
                        />
                        </div>
                        
                        <div className={styles.colorGroup}>
                        <label>Card Color</label>
                        <input
                            value={gameData.theme.card_color}
                            onChange={(e) => updateTheme('card_color', e.target.value)}
                            type="color"
                            className={styles.colorInput}
                        />
                        </div>
                        
                        <div className={styles.colorGroup}>
                        <label>Card Text Color</label>
                        <input
                            value={gameData.theme.card_text_color}
                            onChange={(e) => updateTheme('card_text_color', e.target.value)}
                            type="color"
                            className={styles.colorInput}
                        />
                        </div>
                        
                        <div className={styles.colorGroup}>
                        <label>Header Color</label>
                        <input
                            value={gameData.theme.header_color}
                            onChange={(e) => updateTheme('header_color', e.target.value)}
                            type="color"
                            className={styles.colorInput}
                        />
                        </div>
                        
                        <div className={styles.colorGroup}>
                        <label>Header Text Color</label>
                        <input
                            value={gameData.theme.header_text_color}
                            onChange={(e) => updateTheme('header_text_color', e.target.value)}
                            type="color"
                            className={styles.colorInput}
                        />
                        </div>
                        
                        <div className={styles.colorGroup}>
                        <label>Title Color</label>
                        <input
                            value={gameData.theme.title_color}
                            onChange={(e) => updateTheme('title_color', e.target.value)}
                            type="color"
                            className={styles.colorInput}
                        />
                        </div>
                    </div>
                    
                    <div className="style-controls">
                        <div className="form-group">
                        <label htmlFor="borderRadius">Border Radius: {gameData.theme.border_radius}px</label>
                        <input
                            id="borderRadius"
                            value={gameData.theme.border_radius}
                            onChange={(e) => updateTheme('border_radius', Number(e.target.value))}
                            type="range"
                            min="0"
                            max="20"
                            className={styles.rangeInput}
                        />
                        </div>
                        
                        <div className="form-group">
                        <label htmlFor="backgroundImage">Background Image URL (Optional)</label>
                        <input
                            id="backgroundImage"
                            value={gameData.theme.background_image || ''}
                            onChange={(e) => updateTheme('background_image', e.target.value)}
                            type="url"
                            className="form-input"
                            placeholder="https://example.com/image.jpg"
                        />
                        </div>
                    </div>
                    </div>
                </div>
                )}
                
                {/* Categories and Questions */}
                <div className={styles.formSection}>
                <h2>Categories & Questions</h2>
                
                <div className={styles.categoriesContainer}>
                    {gameData.categories.map((category, categoryIndex) => (
                    <div key={category.id} className={styles.categorySection}>
                        <div className={styles.categoryHeader}>
                        <input
                            value={category.name}
                            onChange={(e) => updateCategory(categoryIndex, e.target.value)}
                            type="text"
                            className={styles.categoryInput}
                            placeholder={`Category ${categoryIndex + 1}`}
                        />
                        {gameData.categories.length > 5 && (
                            <button
                            type="button"
                            onClick={() => removeCategory(categoryIndex)}
                            className={styles.removeCategoryBtn}
                            >
                            Remove
                            </button>
                        )}
                        </div>
                        
                        <div className={styles.questionsGrid}>
                        {category.questions.map((question, questionIndex) => (
                            <div key={question.id} className={styles.questionItem}>
                            <div className={styles.questionHeader}>
                                <span className={styles.pointValue}>${question.points}</span>
                            </div>
                            
                            <div className={styles.questionInputs}>
                                <div className="form-group">
                                <label>Question</label>
                                <textarea
                                    value={question.question}
                                    onChange={(e) => updateQuestion(categoryIndex, questionIndex, 'question', e.target.value)}
                                    className={styles.questionTextarea}
                                    placeholder="Enter the question"
                                    rows={2}
                                />
                                </div>
                                
                                <div className="form-group">
                                <label>Answer</label>
                                <textarea
                                    value={question.answer}
                                    onChange={(e) => updateQuestion(categoryIndex, questionIndex, 'answer', e.target.value)}
                                    className={styles.questionTextarea}
                                    placeholder="Enter the answer"
                                    rows={2}
                                />
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
                
                {gameData.categories.length < 6 && (
                    <button
                    type="button"
                    onClick={addCategory}
                    className={styles.addCategoryBtn}
                    >
                    Add Category
                    </button>
                )}
                </div>
                
                {/* Form Actions */}
                <div className={styles.formActions}>
                <Link to="/game-boards" className={styles.cancelBtn}>Cancel</Link>
                <button type="submit" className={styles.saveBtn} disabled={loading}>
                    {loading ? (edit ? 'Saving...' : 'Creating...') : (edit ? 'Save Changes' : 'Create Game Board')}
                </button>
                </div>
            </form>
            </div>
            
            {/* Success/Error Messages */}
            {message && (
            <div className={`message ${messageType}`}>
                {message}
            </div>
            )}
        </div>
    )
}

export default GameBoardForm