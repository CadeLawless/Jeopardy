import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import type { GameBoard, GameSession, QuestionState } from '@/types'

interface GameBoardState {
  gameBoards: GameBoard[]
  currentGameBoard: GameBoard | null
  currentSession: GameSession | null
  questionStates: QuestionState[]
  loading: boolean
  fetchGameBoards: (userId: string) => Promise<void>
  createGameBoard: (gameBoard: Omit<GameBoard, 'id' | 'created_at' | 'updated_at'>) => Promise<{ data: any; error: any }>
  updateGameBoard: (id: string, updates: Partial<GameBoard>) => Promise<{ data: any; error: any }>
  deleteGameBoard: (id: string) => Promise<{ error: any }>
  startGameSession: (gameBoardId: string, playerName: string) => Promise<{ data: any; error: any }>
  updateGameSession: (sessionId: string, updates: Partial<GameSession>) => Promise<{ data: any; error: any }>
  initializeQuestionStates: () => void
  updateQuestionState: (questionId: string, updates: Partial<QuestionState>) => void
  calculateScore: () => number
  isGameComplete: () => boolean
  setCurrentGameBoard: (gameBoard: GameBoard | null) => void
  setCurrentSession: (session: GameSession | null) => void
  setQuestionStates: (states: QuestionState[]) => void
}

export const useGameBoardStore = create<GameBoardState>((set, get) => ({
  gameBoards: [],
  currentGameBoard: null,
  currentSession: null,
  questionStates: [],
  loading: false,

  fetchGameBoards: async (userId: string) => {
    set({ loading: true })
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check your environment variables.')
      }
      
      const { data, error } = await supabase
        .from('game_boards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ gameBoards: data || [] })
    } catch (error) {
      console.error('Error fetching game boards:', error)
      // Set empty array to prevent UI issues
      set({ gameBoards: [] })
    } finally {
      set({ loading: false })
    }
  },

  createGameBoard: async (gameBoard) => {
    set({ loading: true })
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check your environment variables.')
      }
      
      const { data, error } = await supabase
        .from('game_boards')
        .insert([gameBoard])
        .select()
        .single()

      if (error) throw error
      set(state => ({ gameBoards: [data, ...state.gameBoards] }))
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      set({ loading: false })
    }
  },

  updateGameBoard: async (id: string, updates: Partial<GameBoard>) => {
    set({ loading: true })
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check your environment variables.')
      }
      
      const { data, error } = await supabase
        .from('game_boards')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      set(state => ({
        gameBoards: state.gameBoards.map(gb => gb.id === id ? data : gb),
        currentGameBoard: state.currentGameBoard?.id === id ? data : state.currentGameBoard
      }))
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      set({ loading: false })
    }
  },

  deleteGameBoard: async (id: string) => {
    set({ loading: true })
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check your environment variables.')
      }
      
      const { error } = await supabase
        .from('game_boards')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      set(state => ({
        gameBoards: state.gameBoards.filter(gb => gb.id !== id),
        currentGameBoard: state.currentGameBoard?.id === id ? null : state.currentGameBoard
      }))
      
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      set({ loading: false })
    }
  },

  startGameSession: async (gameBoardId: string, playerName: string) => {
    set({ loading: true })
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check your environment variables.')
      }
      
      const { data, error } = await supabase
        .from('game_sessions')
        .insert([{
          game_board_id: gameBoardId,
          player_name: playerName,
          score: 0,
          completed_questions: []
        }])
        .select()
        .single()

      if (error) throw error
      
      set({ currentSession: data })
      get().initializeQuestionStates()
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      set({ loading: false })
    }
  },

  updateGameSession: async (sessionId: string, updates: Partial<GameSession>) => {
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check your environment variables.')
      }
      
      const { data, error } = await supabase
        .from('game_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single()

      if (error) throw error
      
      set(state => ({
        currentSession: state.currentSession?.id === sessionId ? data : state.currentSession
      }))
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  initializeQuestionStates: () => {
    const { currentGameBoard } = get()
    if (!currentGameBoard) return
    
    const states: QuestionState[] = []
    currentGameBoard.categories.forEach(category => {
      category.questions.forEach(question => {
        states.push({
          id: question.id,
          revealed: false,
          answered: false,
          correct: undefined
        })
      })
    })
    set({ questionStates: states })
  },

  updateQuestionState: (questionId: string, updates: Partial<QuestionState>) => {
    set(state => ({
      questionStates: state.questionStates.map(qs => 
        qs.id === questionId ? { ...qs, ...updates } : qs
      )
    }))
  },

  calculateScore: () => {
    const { currentGameBoard, questionStates } = get()
    if (!currentGameBoard) return 0
    
    let score = 0
    currentGameBoard.categories.forEach(category => {
      category.questions.forEach(question => {
        const state = questionStates.find(qs => qs.id === question.id)
        if (state?.answered && state.correct) {
          score += question.points
        }
      })
    })
    
    return score
  },

  isGameComplete: () => {
    const { questionStates } = get()
    return questionStates.every(qs => qs.answered)
  },

  setCurrentGameBoard: (gameBoard: GameBoard | null) => {
    set({ currentGameBoard: gameBoard })
  },

  setCurrentSession: (session: GameSession | null) => {
    set({ currentSession: session })
  },

  setQuestionStates: (states: QuestionState[]) => {
    set({ questionStates: states })
  }
}))