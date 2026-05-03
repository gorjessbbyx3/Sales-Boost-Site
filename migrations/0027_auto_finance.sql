-- 0027_auto_finance.sql
-- Auto-import receipts/invoices from inbound email into the Finances tab.
--
-- Pipeline:
--   1. Inbound email worker tags messages with finance_candidate=1 when
--      sender/subject/attachment heuristics suggest a receipt or invoice.
--   2. Worker calls POST /api/finance/extract-from-message (worker-key gated)
--      which runs Claude on the body + first PDF attachment and inserts a row
--      into invoices with auto_imported=1, source_message_id, vendor, confidence.
--   3. Finances tab renders an "Auto-imported · Review" chip; user one-clicks
--      Approve (clears auto_imported) or Reject (deletes the row).

-- email_messages: flag + cached extraction so we never re-bill the AI.
ALTER TABLE email_messages ADD COLUMN finance_candidate INTEGER NOT NULL DEFAULT 0;
ALTER TABLE email_messages ADD COLUMN finance_extracted_json TEXT NOT NULL DEFAULT '';

-- invoices: provenance + review state for auto-imported rows.
ALTER TABLE invoices ADD COLUMN auto_imported INTEGER NOT NULL DEFAULT 0;
ALTER TABLE invoices ADD COLUMN source_message_id TEXT NOT NULL DEFAULT '';
ALTER TABLE invoices ADD COLUMN vendor TEXT NOT NULL DEFAULT '';
ALTER TABLE invoices ADD COLUMN confidence REAL NOT NULL DEFAULT 1.0;

CREATE INDEX IF NOT EXISTS idx_email_messages_finance ON email_messages(finance_candidate);
CREATE INDEX IF NOT EXISTS idx_invoices_auto ON invoices(auto_imported);
CREATE INDEX IF NOT EXISTS idx_invoices_source_msg ON invoices(source_message_id);
