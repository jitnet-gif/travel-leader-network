import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;
const supabaseKey = serviceRoleKey || anonKey;

export const supabaseReady = Boolean(supabaseUrl && supabaseKey);
const usingServiceRole = Boolean(serviceRoleKey);

if (!supabaseReady) {
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY is not set. Using fallback data.');
} else if (!usingServiceRole) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Using anon key with limited permissions.');
}

export const supabase = supabaseReady
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  : null;
