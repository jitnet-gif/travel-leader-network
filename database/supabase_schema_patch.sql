-- Step 1: Run this FIRST in Supabase SQL Editor
-- 누락 컬럼 추가 (없으면 추가, 있으면 무시)

ALTER TABLE countries          ADD COLUMN IF NOT EXISTS immigration_tips TEXT;
ALTER TABLE countries_i18n     ADD COLUMN IF NOT EXISTS immigration_tips TEXT;
ALTER TABLE cruise_ports       ADD COLUMN IF NOT EXISTS safety_alert TEXT;
ALTER TABLE cruise_ports_i18n  ADD COLUMN IF NOT EXISTS safety_alert TEXT;
ALTER TABLE community_posts    ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE community_posts    ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0;
ALTER TABLE community_posts_i18n ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE tour_jobs          ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE tour_jobs          ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open';
ALTER TABLE tour_jobs_i18n     ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE tour_jobs_i18n     ADD COLUMN IF NOT EXISTS description TEXT;
