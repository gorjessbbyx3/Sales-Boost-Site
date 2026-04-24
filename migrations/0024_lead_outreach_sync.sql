-- Bidirectional cross-links between pipeline leads and outreach map businesses.
-- A lead can be mirrored as an outreach_business so it shows up as a pin on the map,
-- and an outreach_business can be mirrored as a lead so it lives in the pipeline.

ALTER TABLE leads ADD COLUMN outreach_business_id INTEGER;
ALTER TABLE outreach_businesses ADD COLUMN lead_id TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_outreach_business_id ON leads(outreach_business_id);
CREATE INDEX IF NOT EXISTS idx_outreach_businesses_lead_id ON outreach_businesses(lead_id);
