-- Add email_account column to email_threads
ALTER TABLE email_threads ADD COLUMN IF NOT EXISTS email_account TEXT NOT NULL DEFAULT 'contact@techsavvyhawaii.com';
CREATE INDEX IF NOT EXISTS idx_email_threads_account ON email_threads(email_account);

-- Email Accounts table
CREATE TABLE IF NOT EXISTS email_accounts (
  id TEXT PRIMARY KEY,
  address TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT NOT NULL DEFAULT 'mail',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TEXT NOT NULL
);

-- Seed default account
INSERT INTO email_accounts (id, address, display_name, description, color, icon, sort_order, is_default, created_at)
VALUES ('acct-default', 'contact@techsavvyhawaii.com', 'TechSavvy Hawaii', 'Main business email', '#3B82F6', 'mail', 0, true, datetime('now'))
ON CONFLICT (id) DO NOTHING;
