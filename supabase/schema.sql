-- Talentopia - Schema Supabase
-- Esegui nel SQL Editor del progetto Supabase

-- Players
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '⚽',
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  coins INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color TEXT NOT NULL
);

-- Questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT NOT NULL REFERENCES categories(slug),
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A','B','C','D')),
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('facile','media','difficile')),
  topic TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  category_slug TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Minigame attempts
CREATE TABLE IF NOT EXISTS minigame_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_slug TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL
);

-- Player badges
CREATE TABLE IF NOT EXISTS player_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(player_id, badge_id)
);

-- Stats estese (opzionale, per profilo completo)
ALTER TABLE players ADD COLUMN IF NOT EXISTS games_played INTEGER DEFAULT 0;
ALTER TABLE players ADD COLUMN IF NOT EXISTS correct_answers INTEGER DEFAULT 0;
ALTER TABLE players ADD COLUMN IF NOT EXISTS win_streak INTEGER DEFAULT 0;

-- Rating adattivo per categoria (difficoltà quiz)
CREATE TABLE IF NOT EXISTS player_category_ratings (
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  category_slug TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 1000 CHECK (rating >= 0 AND rating <= 2500),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (player_id, category_slug)
);
CREATE INDEX IF NOT EXISTS idx_player_category_ratings_player
  ON player_category_ratings(player_id);

-- Indici
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category_slug);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_player ON quiz_attempts(player_id);
CREATE INDEX IF NOT EXISTS idx_minigame_attempts_player ON minigame_attempts(player_id);

-- RLS (da configurare in produzione)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE minigame_attempts ENABLE ROW LEVEL SECURITY;

-- Seed categorie
INSERT INTO categories (name, slug, icon, color) VALUES
  ('Calcio', 'calcio', '⚽', '#22c55e'),
  ('Sport', 'sport', '🏆', '#f59e0b'),
  ('Matematica', 'matematica', '🔢', '#3b82f6'),
  ('Storia', 'storia', '📜', '#a855f7'),
  ('Geografia', 'geografia', '🌍', '#06b6d4'),
  ('Inglese', 'inglese', '🇬🇧', '#ec4899'),
  ('Fantacalcio', 'fantacalcio', '📋', '#ef4444')
ON CONFLICT (slug) DO NOTHING;
