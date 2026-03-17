-- Feature flags table for admin-controlled frontend menu/feature visibility
BEGIN;

CREATE TABLE IF NOT EXISTS feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT true,
  label TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default flags for all frontend nav menu items
INSERT INTO feature_flags (key, enabled, label) VALUES
  ('nav.dashboard',    true,  'Dashboard'),
  ('nav.countries',    true,  'Countries'),
  ('nav.airports',     true,  'Airports'),
  ('nav.cruiseLines',  true,  'Cruise Lines'),
  ('nav.cruisePorts',  true,  'Cruise Ports'),
  ('nav.audioGuide',   true,  'Audio Guide'),
  ('nav.jobs',         true,  'Jobs'),
  ('nav.community',    true,  'Community'),
  ('nav.leaderTools',  true,  'Leader Tools'),
  ('nav.education',    true,  'Education'),
  ('nav.emergency',    true,  'Emergency'),
  ('nav.routes',       true,  'Routes')
ON CONFLICT (key) DO NOTHING;

COMMIT;
