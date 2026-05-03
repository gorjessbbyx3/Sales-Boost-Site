-- Adds "send later" support: drafts can be scheduled for future send.
-- A cron-driven worker flushes due drafts via /api/email/flush-scheduled.

ALTER TABLE email_drafts ADD COLUMN scheduled_for TEXT NOT NULL DEFAULT '';
ALTER TABLE email_drafts ADD COLUMN scheduled_status TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_email_drafts_scheduled
  ON email_drafts(scheduled_status, scheduled_for);
