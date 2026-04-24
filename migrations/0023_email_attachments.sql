-- Email attachments: every inbound/outbound email attachment is stored in R2
-- and indexed here so the inbox UI can list, download, sign, save, or forward them.

CREATE TABLE IF NOT EXISTS email_attachments (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  thread_id TEXT NOT NULL DEFAULT '',
  filename TEXT NOT NULL DEFAULT 'attachment',
  content_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  size INTEGER NOT NULL DEFAULT 0,
  r2_key TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  direction TEXT NOT NULL DEFAULT 'inbound',  -- 'inbound' | 'outbound'
  signed_of TEXT NOT NULL DEFAULT '',         -- if non-empty, this row is the signed version of another attachment
  saved_to_files INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_email_attachments_message ON email_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_email_attachments_thread ON email_attachments(thread_id);

-- Clients gain a client_assets JSON column so saved email attachments can be linked to a client.
ALTER TABLE clients ADD COLUMN client_assets TEXT NOT NULL DEFAULT '[]';
