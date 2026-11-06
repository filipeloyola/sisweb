import { createClient } from '@supabase/supabase-js';

// Project credentials with robust fallbacks in case environment variables are missing on Netlify build
const defaultUrl = 'https://vyycxfstoahejheqvfkp.supabase.co';
const defaultAnonKey = 'sb_publishable_Lkh1q3EnZYM3GtgoCVHa_w_nveLiVE4';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseUrl = (rawUrl ? rawUrl.replace(/\/rest\/v1\/?$/, '') : defaultUrl).trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || defaultAnonKey).trim();

let client;
try {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
} catch (err) {
  console.error('[SupabaseClient] Falha ao inicializar client Supabase:', err);
  // Safe dummy fallback so import never crashes React
  client = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: new Error('Offline') }),
      signUp: async () => ({ data: null, error: new Error('Offline') }),
      signOut: async () => {},
    },
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => Promise.resolve({ data: [], error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
      update: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
      delete: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    }),
    channel: () => ({
      on: () => ({ on: () => ({ on: () => ({ subscribe: () => ({}) }) }) }),
      subscribe: () => ({}),
    }),
    removeChannel: () => {},
  };
}

export const supabase = client;
export default supabase;
