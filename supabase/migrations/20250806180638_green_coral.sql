/*
  # Create Jeopardy Game Tables

  1. New Tables
    - `game_boards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text, optional)
      - `categories` (jsonb, stores category and question data)
      - `theme` (jsonb, stores theme configuration)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `game_sessions`
      - `id` (uuid, primary key)
      - `game_board_id` (uuid, references game_boards)
      - `player_name` (text)
      - `score` (integer)
      - `completed_questions` (jsonb, array of question IDs)
      - `created_at` (timestamp)
      - `completed_at` (timestamp, optional)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for game sessions based on game board ownership
*/

-- Create game_boards table
CREATE TABLE IF NOT EXISTS game_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  theme jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_board_id uuid REFERENCES game_boards(id) ON DELETE CASCADE NOT NULL,
  player_name text NOT NULL,
  score integer DEFAULT 0,
  completed_questions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE game_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for game_boards
CREATE POLICY "Users can view their own game boards"
  ON game_boards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own game boards"
  ON game_boards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game boards"
  ON game_boards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own game boards"
  ON game_boards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for game_sessions
CREATE POLICY "Users can view sessions for their game boards"
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM game_boards 
      WHERE game_boards.id = game_sessions.game_board_id 
      AND game_boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create sessions for their game boards"
  ON game_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM game_boards 
      WHERE game_boards.id = game_sessions.game_board_id 
      AND game_boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sessions for their game boards"
  ON game_sessions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM game_boards 
      WHERE game_boards.id = game_sessions.game_board_id 
      AND game_boards.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM game_boards 
      WHERE game_boards.id = game_sessions.game_board_id 
      AND game_boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sessions for their game boards"
  ON game_sessions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM game_boards 
      WHERE game_boards.id = game_sessions.game_board_id 
      AND game_boards.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_boards_user_id ON game_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_game_boards_created_at ON game_boards(created_at);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_board_id ON game_sessions(game_board_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON game_sessions(created_at);

-- Create updated_at trigger for game_boards
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_game_boards_updated_at
  BEFORE UPDATE ON game_boards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();