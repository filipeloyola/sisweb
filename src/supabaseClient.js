import { createClient } from '@supabase/supabase-js';

// Clean the Supabase URL in case a trailing /rest/v1/ was added in the .env
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[SupabaseClient] Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontradas. Verifique seu arquivo .env.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
