-- Migração: Alterar tabela blueprints para usar GitHub repos e Vercel preview

-- Primeiro, fazer backup se necessário
-- Depois, alterar a tabela

ALTER TABLE blueprints
DROP COLUMN IF EXISTS schema;

ALTER TABLE blueprints
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS niche text,
ADD COLUMN IF NOT EXISTS github_repo_url text,
ADD COLUMN IF NOT EXISTS vercel_preview_url text,
ADD COLUMN IF NOT EXISTS screenshot_url text;

-- Garantir que campos obrigatórios não sejam null em novos registros
-- (dados existentes podem ter null temporariamente)
