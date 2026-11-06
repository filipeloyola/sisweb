# sisweb - Spiritfy 🎸🎵

> **Spiritfy** é uma aplicação web interativa desenvolvida com React + Vite + Tailwind CSS que permite ao público de eventos ao vivo escolher e votar em músicas para serem tocadas no palco pelos músicos em tempo real.

---

## 🎨 Design & Cores (Inspirado no Spotify Dark Mode)
- **Background**: `#121212`
- **Superfícies / Cards**: `#181818`
- **Destaque / Acento**: `#1DB954` (Spotify green)
- **Texto Principal**: `#FFFFFF`
- **Texto Secundário**: `#B3B3B3`
- **Bordas / Linhas**: `#333333`
- **Hover**: `#282828`

---

## 📂 Playlists Extraídas dos PDFs (`musicas_para_jovens/`)

A aplicação agora carrega com **3 playlists oficiais** extraídas diretamente dos materiais em PDF dos músicos e grupos jovens:

1. **Bianca e Jorge** (`Bianca e Jorge.pdf`):
   - Músicas de fé, esperança e entusiasmo juvenil (inclui *A Alegria Está No Coração*, *João - Oficina G3*, *Felicidade - Marcelo Jeneci*, *Girassol - Kell Smith*, *Trem-Bala - Ana Vilela*, *Oração de São Francisco*, *Uni-vos*, *Aos Pés do Monte*, *Vento e Luz*, etc.).
2. **Grupo Vocal Amigos de Jesus** (`Grupo Vocal.pdf`):
   - Repertório do grupo vocal (Outubro 2023): *Belo*, *Quanta Luz*, *Canção da Alegria Cristã*, *Já é Tempo*, *Amigo*, *Cativar*, *Alegria*, *A Paz - Roupa Nova*, *Confia Sempre*, *Aurora*, *Alvorada Jovem*, *One Day - Matisyahu*, *Aleluia - Elizabete Lacerda*, *Força do Bem*, etc.
3. **Músicas do Filipe** (`Musicas_Filipe.pdf`):
   - Repertório individual com mensagens de elevação e fraternidade (*Apenas Amar - Denis Soares*, *O Chamado - Evangelizar É Amar*, *Uma Prece - Cacau*, *Força do Bem - Grupo Bem*, *Já É Tempo*, *Alvorada Jovem*).

### 🌟 Mix Geral (Automático)
- Agrega automaticamente **todas as músicas das 3 playlists**, eliminando duplicatas e ordenando pelo número de solicitações/pedidos ao vivo do público.

---

## ✏️ Funcionalidade de Edição de Playlist
O usuário pode personalizar cada uma das 3 playlists diretamente na interface:
- **Alteração do Nome da Playlist**
- **Alteração da Imagem de Capa**: suporte a URL externa customizada ou seleção imediata entre temas/presets selecionados (Acústico, Vocal, Espiritual, Palco, Violão e Harmonia).
- Acesso à edição:
  - Na página de detalhes da playlist: botão **"Editar Playlist"** no topo ou **clique direto sobre a capa do álbum** (com efeito hover inspirado no Spotify).
  - Na listagem de playlists: botão de edição no canto do card.
- Todas as alterações são salvas e persistidas diretamente no **Supabase** via consultas assíncronas (`async/await`).

---

## 🗄️ Integração com Supabase (Banco de Dados em Nuvem)

A aplicação está integrada com o **Supabase** para persistência em nuvem das tabelas `playlists` e `songs`.

### 1. Variáveis de Ambiente (`.env`)
As credenciais são carregadas através das variáveis no arquivo `.env`:
```env
VITE_SUPABASE_URL=https://vyycxfstoahejheqvfkp.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```
*(Um arquivo `.env.example` foi fornecido no repositório como modelo).*

### 2. Cliente de Conexão (`src/supabaseClient.js`)
Configurado para inicializar a instância oficial `@supabase/supabase-js`, com tratamento automático para normalização da URL base.

### 3. Esquema das Tabelas (`supabase_schema.sql`)
- **`playlists`**: `id` (UUID), `title` (TEXT), `image_url` (TEXT), `created_at` (TIMESTAMP).
- **`songs`**: `id` (UUID), `playlist_id` (UUID, FK -> playlists.id), `title` (TEXT), `artist` (TEXT), `lyrics` (TEXT), `created_at` (TIMESTAMP).
- **Inicialização Automática**: Na primeira carga, se o banco estiver vazio, o Spiritfy semeia automaticamente as 3 playlists oficiais e todas as suas músicas.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- Node.js (v18+) e npm instalados.

### 2. Instalação das dependências
```bash
npm install
```

### 3. Rodar em ambiente de desenvolvimento
```bash
npm run dev
```
O servidor de desenvolvimento estará disponível em: `http://localhost:5173/`

### 4. Gerar build de produção
```bash
npm run build
```

---

## 📱 Rotas e Funcionalidades

- **`/` (HomePage)**:
  - Hero com slogan *"Escolha a música. O músico toca ao vivo."*
  - Dashboard de estatísticas em tempo real (Total de playlists, músicas, pedidos ativos e artistas).
  - Playlists em destaque (Mix Geral + 3 playlists oficiais) e ranking das músicas mais pedidas da noite.
- **`/playlists` (PlaylistsPage)**:
  - Catálogo de playlists com busca instantânea e atalho de edição.
  - "Mix Geral" no topo agregando as músicas mais pedidas de todo o evento.
  - Modal para criação de novas playlists com capas personalizadas.
- **`/playlists/:id` (PlaylistDetailPage)**:
  - Visão detalhada do repertório, contagem e duração total calculada.
  - Botão de **"Editar Playlist"** e capa interativa para alteração de nome e imagem.
  - Tabela interativa com botão *"♥ Pedir ao vivo"* que computa o voto instantaneamente com notificação Toast.
  - Modal para cadastrar novas músicas com letra/cifra.
- **`/playlists/:playlistId/songs/:songId` (SongDetailPage)**:
  - Visual imersivo em tela cheia com iluminação de palco.
  - Letra completa formatada para acompanhar e cantar junto.
  - Botão de votação ao vivo e compartilhamento.
- **`/profile` (ProfilePage)**:
  - Gestão de perfil e autenticação com simulação de ativação por e-mail e persistência local.
  - Gestão de playlists criadas pelo usuário logado.
  - Histórico de pedidos feitos na sessão.

---

## 🛠️ Tecnologias
- **React 18** (SPA)
- **Vite 5**
- **React Router v6**
- **Tailwind CSS 3**
- **Lucide React** (Ícones)
- **LocalStorage API** (Persistência completa sem necessidade de backend)
