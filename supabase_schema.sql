-- ========================================================
-- Spiritfy - Script SQL para configuração do Supabase
-- ========================================================

-- 1. Criação da tabela de playlists (com suporte a descrição e capa)
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garante que a coluna description exista caso a tabela já tenha sido criada anteriormente
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. Criação da tabela de músicas (songs) com cifra + letra
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    lyrics TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Criação da tabela de perfis / colaboradores aprovados
CREATE TABLE IF NOT EXISTS public.collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'collaborator',
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Contas iniciais configuradas:
-- Admin Principal: loyolafilipe@gmail.com (permissões totais de admin e aprovação)
-- Admin Secundário: admin@spiritfy.app
-- Filipe: filipe@spiritfy.app (colaborador inicial pré-aprovado para testes)
INSERT INTO public.collaborators (email, role, is_approved)
VALUES 
    ('loyolafilipe@gmail.com', 'admin', true),
    ('admin@spiritfy.app', 'admin', true),
    ('filipe@spiritfy.app', 'collaborator', true)
ON CONFLICT (email) DO UPDATE 
SET role = EXCLUDED.role, is_approved = EXCLUDED.is_approved;

-- 5. Habilitação de RLS (Row Level Security)
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para playlists (leitura pública total, escrita liberada para autenticados/anon)
CREATE POLICY "Permitir leitura pública de playlists"
    ON public.playlists FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção de playlists"
    ON public.playlists FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir atualização de playlists"
    ON public.playlists FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir exclusão de playlists"
    ON public.playlists FOR DELETE
    USING (true);

-- Políticas de acesso para músicas (songs)
CREATE POLICY "Permitir leitura pública de songs"
    ON public.songs FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção de songs"
    ON public.songs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir atualização de songs"
    ON public.songs FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir exclusão de songs"
    ON public.songs FOR DELETE
    USING (true);

-- Políticas de acesso para colaboradores
CREATE POLICY "Permitir leitura de colaboradores"
    ON public.collaborators FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção/atualização de colaboradores"
    ON public.collaborators FOR ALL
    USING (true)
    WITH CHECK (true);
