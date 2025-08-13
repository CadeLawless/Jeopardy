import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  isAuthenticated: false,

  signUp: async (email: string, password: string, fullName?: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      set({ loading: false })
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, isAuthenticated: false })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      set({ loading: false })
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (error) throw error
      if (data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata.full_name,
          avatar_url: data.user.user_metadata.avatar_url,
          created_at: data.user.created_at
        }
        set({ user, isAuthenticated: true })
      }
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      set({ loading: false })
    }
  },

  initializeAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      const user = {
        id: session.user.id,
        email: session.user.email!,
        full_name: session.user.user_metadata.full_name,
        avatar_url: session.user.user_metadata.avatar_url,
        created_at: session.user.created_at
      }
      set({ user, isAuthenticated: true })
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata.full_name,
          avatar_url: session.user.user_metadata.avatar_url,
          created_at: session.user.created_at
        }
        set({ user, isAuthenticated: true })
      } else {
        set({ user: null, isAuthenticated: false })
      }
    })
  }
}))