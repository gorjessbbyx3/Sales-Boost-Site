-- Add CC/BCC support to email_messages and a server-side drafts table
-- so the inbox can behave like a real Outlook-style client.

ALTER TABLE email_messages ADD COLUMN cc_emails TEXT NOT NULL DEFAULT '';
ALTER TABLE email_messages ADD COLUMN bcc_emails TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS email_drafts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT '',
  account TEXT NOT NULL DEFAULT '',
  to_emails TEXT NOT NULL DEFAULT '',
  cc_emails TEXT NOT NULL DEFAULT '',
  bcc_emails TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  attachments_json TEXT NOT NULL DEFAULT '[]',
  thread_id TEXT NOT NULL DEFAULT '',
  reply_to_message_id TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_email_drafts_user ON email_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_email_drafts_updated ON email_drafts(updated_at);

-- Per-user, per-account "signature" so each address can have its own sign-off.
-- Optional; the existing default signature in code remains the fallback.
CREATE TABLE IF NOT EXISTS email_signatures (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT '',
  account TEXT NOT NULL DEFAULT '',
  html TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_signatures_unique ON email_signatures(user_id, account);
