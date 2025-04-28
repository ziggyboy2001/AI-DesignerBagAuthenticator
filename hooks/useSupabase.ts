import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';

export function useSupabase() {
  const supabase = useMemo(() => createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  return supabase;
}