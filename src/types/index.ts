export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface GameBoard {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  categories: Category[];
  theme: GameTheme;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  questions: Question[];
}

export interface Question {
  id: string;
  points: number;
  question: string;
  answer: string;
}

export interface GameTheme {
  name: string;
  background_color: string;
  background_image?: string;
  card_color: string;
  card_text_color: string;
  header_color: string;
  header_text_color: string;
  title_color: string;
  border_radius: number;
}

export interface GameSession {
  id: string;
  game_board_id: string;
  player_name: string;
  score: number;
  completed_questions: string[];
  created_at: string;
  completed_at?: string;
}

export interface QuestionState {
  id: string;
  revealed: boolean;
  answered: boolean;
  correct?: boolean;
}

export const DEFAULT_THEMES: GameTheme[] = [
  {
    name: 'Classic Blue',
    background_color: '#0f1419',
    card_color: '#1e40af',
    card_text_color: '#ffffff',
    header_color: '#3b82f6',
    header_text_color: '#ffffff',
    title_color: '#60a5fa',
    border_radius: 8
  },
  {
    name: 'Royal Purple',
    background_color: '#1e1b4b',
    card_color: '#7c3aed',
    card_text_color: '#ffffff',
    header_color: '#8b5cf6',
    header_text_color: '#ffffff',
    title_color: '#a78bfa',
    border_radius: 12
  },
  {
    name: 'Emerald Green',
    background_color: '#064e3b',
    card_color: '#059669',
    card_text_color: '#ffffff',
    header_color: '#10b981',
    header_text_color: '#ffffff',
    title_color: '#34d399',
    border_radius: 6
  },
  {
    name: 'Sunset Orange',
    background_color: '#7c2d12',
    card_color: '#ea580c',
    card_text_color: '#ffffff',
    header_color: '#f97316',
    header_text_color: '#ffffff',
    title_color: '#fb923c',
    border_radius: 10
  }
];