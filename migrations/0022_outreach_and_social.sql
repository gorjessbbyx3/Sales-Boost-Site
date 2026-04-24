-- Outreach Map businesses (door-to-door sales tracker)
CREATE TABLE IF NOT EXISTS outreach_businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  rating REAL,
  status TEXT NOT NULL DEFAULT 'not_contacted',
  notes TEXT NOT NULL DEFAULT '',
  lat REAL,
  lng REAL,
  geocoded INTEGER NOT NULL DEFAULT 0,
  visited_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_outreach_businesses_status ON outreach_businesses(status);
CREATE INDEX IF NOT EXISTS idx_outreach_businesses_geocoded ON outreach_businesses(geocoded);

-- Social Media Calendar (Instagram + Facebook posts with AI-generated content)
CREATE TABLE IF NOT EXISTS social_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL DEFAULT 'both',
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL DEFAULT '09:00',
  title TEXT NOT NULL DEFAULT '',
  content_idea TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  hashtags TEXT NOT NULL DEFAULT '',
  visual_prompt TEXT NOT NULL DEFAULT '',
  visual_url TEXT NOT NULL DEFAULT '',
  call_to_action TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'idea',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_social_posts_date ON social_posts(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
