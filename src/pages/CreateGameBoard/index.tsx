import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/context/authContext'
import { useGameBoardStore } from '@/context/gameBoardContext'
import GameBoardForm, { GameBoardFormData } from '@/components/GameBoardForm'

const CreateGameBoard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { createGameBoard, loading } = useGameBoardStore()
  
  const handleSubmit = async (gameData: GameBoardFormData) => {
    if (!user) return
    
    const { error } = await createGameBoard({
      ...gameData,
      user_id: user.id
    })
    
    if (error) {
      alert('Failed to create game board. Please try again.')
    } else {
      navigate('/game-boards')
    }
  }

  return (
    <GameBoardForm
      onSubmit={handleSubmit}
      loading={loading}
      edit={false}
    />
  )
}

export default CreateGameBoard