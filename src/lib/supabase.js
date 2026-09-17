import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL. Please check your .env.local file.'
  );
}

if (!supabasePublishableKey) {
  throw new Error(
    'Missing VITE_SUPABASE_PUBLISHABLE_KEY. Please check your .env.local file.'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);