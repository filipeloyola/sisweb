-- ========================================================
-- Spiritfy - Script SQL para configuração do Supabase
-- ========================================================

-- 1. Criação da tabela de playlists
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Criação da tabela de músicas (songs)
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    lyrics TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitação de RLS (Row Level Security) com políticas públicas para o app do evento
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para playlists (leitura, inserção, atualização e exclusão)
CREATE POLICY "Permitir leitura pública de playlists"
    ON public.playlists FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção pública de playlists"
    ON public.playlists FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de playlists"
    ON public.playlists FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir exclusão pública de playlists"
    ON public.playlists FOR DELETE
    USING (true);

-- Políticas de acesso público para músicas (leitura, inserção, atualização e exclusão)
CREATE POLICY "Permitir leitura pública de songs"
    ON public.songs FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção pública de songs"
    ON public.songs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de songs"
    ON public.songs FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir exclusão pública de songs"
    ON public.songs FOR DELETE
    USING (true);
