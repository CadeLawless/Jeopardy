import React from 'react'
import type { GameBoard } from '@/types'
import styles from './GameBoardCard.module.css'

interface GameBoardCardProps {
  gameBoard: GameBoard
  onPlay: () => void
  onEdit: () => void
  onDelete: () => void
}

const GameBoardCard: React.FC<GameBoardCardProps> = ({ gameBoard, onPlay, onEdit, onDelete }) => {
  const headerStyle = {
    backgroundColor: gameBoard.theme.header_color,
    color: gameBoard.theme.header_text_color,
    borderRadius: `${gameBoard.theme.border_radius}px ${gameBoard.theme.border_radius}px 0 0`
  }

  const previewStyle = {
    backgroundColor: gameBoard.theme.background_color,
    backgroundImage: gameBoard.theme.background_image ? `url(${gameBoard.theme.background_image})` : 'none'
  }

  const categoryStyle = {
    backgroundColor: gameBoard.theme.card_color,
    color: gameBoard.theme.card_text_color,
    borderRadius: `${gameBoard.theme.border_radius}px`
  }

  return (
    <div className={styles.gameBoardCard}>
      <div className={styles.cardHeader} style={headerStyle}>
        <h3 className={styles.cardTitle}>{gameBoard.title}</h3>
        {gameBoard.description && (
          <p className={styles.cardDescription}>{gameBoard.description}</p>
        )}
      </div>
      
      <div className={styles.cardPreview} style={previewStyle}>
        <div className={styles.previewGrid}>
          {gameBoard.categories.slice(0, 5).map(category => (
            <div 
              key={category.id}
              className={styles.previewCategory}
              style={categoryStyle}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.cardActions}>
        <button onClick={onPlay} className={`${styles.actionBtn} ${styles.playBtn}`}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Play
        </button>
        
        <button onClick={onEdit} className={`${styles.actionBtn} ${styles.editBtn}`}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit
        </button>
        
        <button onClick={onDelete} className={`${styles.actionBtn} ${styles.deleteBtn}`}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v-1a1 1 0 10-2 0v1zm4-1a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  )
}

export default GameBoardCard