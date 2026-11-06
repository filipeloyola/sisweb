import React, { createContext, useContext, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { supabase } from '../supabaseClient';

// Create App Context
const AppContext = createContext(null);

/**
 * E-mails com privilégios permanentes de Administrador Principal do Spiritfy.
 * O e-mail loyolafilipe@gmail.com possui acesso total ao sistema.
 */
export const SYSTEM_COLLABORATORS_ID = '00000000-0000-0000-0000-000000000001';

export const ADMIN_EMAILS = ['loyolafilipe@gmail.com', 'admin@spiritfy.app'];

export const checkIsAdmin = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

/**
 * Preset "demo" users that ship with the app seed data.
 * These are read-only references; actual registered users live in
 * the `registeredUsers` localStorage key.
 *
 * Demo credentials (for the login hint in AuthModal):
 *   joao@spiritfy.app  / demo1234
 *   sarah@spiritfy.app / demo1234
 *   carlos@spiritfy.app / demo1234
 */
export const PRESET_USERS = [
  {
    id: 'user-1',
    name: 'Bianca e Jorge',
    email: 'joao@spiritfy.app',
    passwordHash: 'ZGVtbzEyMzQ=',
    avatar: '🎸',
    role: 'Dupla Musical',
    bio: 'Músicas espirituais e de fé para jovens.',
    confirmed: true,
  },
  {
    id: 'user-2',
    name: 'Grupo Vocal Amigos de Jesus',
    email: 'sarah@spiritfy.app',
    passwordHash: 'ZGVtbzEyMzQ=',
    avatar: '🎵',
    role: 'Grupo Vocal',
    bio: 'Grupo vocal com repertório espírita e cristão desde 2023.',
    confirmed: true,
  },
  {
    id: 'user-3',
    name: 'Filipe',
    email: 'filipe@spiritfy.app',
    passwordHash: 'ZGVtbzEyMzQ=',
    avatar: '🎹',
    role: 'Músico Solo',
    bio: 'Repertório pessoal de músicas espirituais.',
    confirmed: true,
  },
];

/**
 * Initial Seed Playlists — extraídas dos PDFs da pasta `musicas_para_jovens`.
 * Playlist 1: Bianca e Jorge (Bianca e Jorge.pdf)
 * Playlist 2: Grupo Vocal Amigos de Jesus (Grupo Vocal.pdf)
 * Playlist 3: Músicas do Filipe (Musicas_Filipe.pdf)
 */
export const INITIAL_PLAYLISTS = [
  // ─────────────────────────────────────────────────────────────────────────
  // PLAYLIST 1 — Bianca e Jorge
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'playlist-bianca-jorge',
    name: 'Bianca e Jorge',
    description: 'Repertório da dupla Bianca e Jorge: músicas de fé, esperança e alegria para o evento ao vivo.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-amber-800 via-orange-900 to-stone-900',
    createdBy: 'user-1',
    createdAt: '2026-10-15T18:00:00.000Z',
    songs: [
      {
        id: 'bj-01',
        title: 'A Alegria Está No Coração',
        artist: 'Bianca e Jorge',
        duration: '3:20',
        requests: 12,
        addedAt: '2026-10-15T18:05:00.000Z',
        lyrics: `                                 A Alegria Está No Coração


    A       G D
Aleluia, (alelui_a) 4X’
A
A alegria está no coração
    D                    A G D
De quem já conhece a Jesus
A
A verdadeira paz só tem aquele
    B7               E
Que já conhece a Jesus


A                    A7
O sentimento mais precioso
    D                F
Que vem do nosso Senhor
    A            E
É o amor que só tem quem
                A G D
Já conhece a Jesus
(2x)


            A
Posso pisar numa tropa
    A7
E saltar as muralhas


    D       F
Aleluia! Aleluia!
        A
Posso pisar numa tropa

     A7
E saltar as muralhas
  D        F
Aleluia! Aleluia!


 A             A7
E Ele é a rocha da minha salvação
  D            F
Com Ele não há mais condenação
      A
Posso pisar numa tropa
 E
E saltar as muralhas
  A E
Aleluia!



Aleluia! Alelui_a!....


O sentimento mais precioso…`,
      },
      {
        id: 'bj-02',
        title: 'João',
        artist: 'Oficina G3',
        duration: '4:10',
        requests: 8,
        addedAt: '2026-10-15T18:10:00.000Z',
        lyrics: `                                    João - Oficina G3


Dm               F
 Em direção ao rio
                Am
Cumprindo sua missão
            G
Da Galileia veio em minha direção


F           Am            G
Como posso eu, um mero pecador
            Dm
Batizar nas águas o meu Senhor?


Bb                    G
Eu não sou merecedor de com minhas mãos te mergulhar
    F                     Gm   Dm
Se digno eu não sou de suas sandálias desatar


Bb
Deixa assim acontecer
G
Mesmo sem você entender


        F
São os planos do meu Pai
        Gm           Dm
Pra justiça se cumprir
    Gm           Dm
O começo é aqui
    Gm          G4 G5
O Pai quem me enviou

    D     D5
O céu se abriu
    Gm
E a terra se curvou
    Bb9
Das águas levantou
    C
O filho de Deus
    D     D5
O céu se abriu
    Gm
O Espírito desceu
    Bb
O filho revelou
    C
E o Pai falou


( Dm F Am G )


Dm               F
 Com os meus olhos vi
           Am
Sair do rio Jordão
          G
O rio de água viva, a salvação
F         Am          G
Como posso eu, um mero pecador
          Dm
Batizar nas águas o meu Senhor?


Eu não sou merecedor…

( Dm F Am G )


Dm                F
 Com os meus olhos vi
          Am
Sair do rio Jordão
          G9 G
A fonte de água viva


D9                Am11
Este é o meu filho amado
         G            D     D9
Que traz o sorriso aos meus lábios
              Em
Este é o meu filho amado
         G            F#m
Que traz o sorriso aos meus lábios


 Am          C9       G              D
Hosana, Hosana,Hosana ao nosso rei`,
      },
      {
        id: 'bj-03',
        title: 'Felicidade',
        artist: 'Marcelo Jeneci',
        duration: '4:05',
        requests: 15,
        addedAt: '2026-10-15T18:15:00.000Z',
        lyrics: `                                       Felicidade - Marcelo Jeneci

G7+            Am               G7+          Am
    Haverá um dia em que você não haverá de ser feliz
G7+            Am                      G7+          Am
    Sem tirar o ar, sem se mexer, sem desejar como antes sempre quis
G7+           Am         G7+       Am               G7+
    Você vai rir, sem perceber, felicidade é só questão de ser
          Am        G7+         Am                G7+
    Quando chover, deixar molhar pra receber o sol quando voltar
               Am                  G7+        Am
    Lembrará os dias que você deixou passar sem ver a luz
G7+                 Am                  G7+        B7
    Se chorar, chorar é vão porque os dias vão pra nunca mais


Em         Bm             Am       D                Em
    Melhor viver, meu bem, pois há um lugar em que o sol brilha pra você
         Bm           Am           D                Em
    Chorar, sorrir também e depois dançar, na chuva quando a chuva vem
         Bm           Am       D                   Em
    Melhor viver, meu bem, pois há um lugar em que o sol brilha pra você
          Bm          Am
    Chorar, sorrir também e dançar
D                             ( G7+ Am )
    Dançar na chuva quando a chuva vem


G7+                      Am                       G7+     Am
    Tem vez que as coisas pesam mais do que a gente acha que pode aguentar
G7+              Am                     G7+        Am
    Nessa hora fique firme, pois tudo isso logo vai passar
G7+         Am         G7+      Am                 G7+
    Você vai rir, sem perceber, felicidade é só questão de ser
         Am         G7+         B7

 Quando chover, deixar molhar pra receber o sol quando voltar


 Melhor viver….
 Dançar na chuva quando a chuva vem…. 3X`,
      },
      {
        id: 'bj-04',
        title: 'Deixa a Luz do Céu Entrar',
        artist: 'Bianca e Jorge',
        duration: '3:45',
        requests: 10,
        addedAt: '2026-10-15T18:20:00.000Z',
        lyrics: `                                     Deixa a Luz do Céu Entrar
    G                       D7
Tu anseias, eu bem sei, por salvação
     Am Am/G                D7/F#        G
Tens dese________jo de banir a escuridão
               G7           C Cm
Abre, pois, de par em par teu coração
 G       Em    Am D7 G D D4 D
E deixa a luz do céu entrar


G                  D7
Deixa a luz do céu entrar
Am            D7        G
Deixa a luz do céu entrar
         G7             C Cm
Abre bem as portas do teu coração
 G       Em    Am D7 G
E deixa a luz do céu entrar


        G                   D7
Cristo, a luz do céu em ti, quer habitar
        Am Am/G                  D7/F#       G
Para as tre________vas dos seus erros dissipar
              G7 C Cm
Teu caminho e coração iluminar
 G       Em    Am D7 G D D4 D
E deixa a luz do céu entrar

[Refrão]
      G                D7
Que alegria andar ao brilho dessa luz
     Am Am/G            D7/F#       G
Vida eter_______na e paz no coração produz
           G7 C       Cm
Oh! Aceita essa aliança com Jesus
 G      Em     Am D7 G D D4 D
E deixa a luz do céu entrar


[Refrão]`,
      },
      {
        id: 'bj-05',
        title: 'Oração de São Francisco',
        artist: 'Bianca e Jorge',
        duration: '3:30',
        requests: 18,
        addedAt: '2026-10-15T18:25:00.000Z',
        lyrics: `                                 Oração de São Francisco

G                                Bm7 Em
Senhor, fazei-me instrumento de vossa paz
              Am                  Em
Onde houver ódio, que eu leve o amor
               Am                   Em
Onde houver ofensa, que eu leve o perdão
               G               B7      Em
Onde houver discórdia, que eu leve a união
               G              B7 Em
Onde houver dúvida, que eu leve a fé

              Am                     Em
Onde houver erro, que eu leve a verdade
               Am                           Em
Onde houver desespero, que eu leve a esperança
                G              B7        Em
Onde houver tristeza, que eu leve a alegria
                G             B7 Em
Onde houver trevas, que eu leve a luz

   G                                Am
Ó mestre, fazei com que eu procure mais
     B7                 Em
Consolar, que ser consolado

            C                 D
Compreender, que ser compreendido
G       B7        Em
Amar, que ser amado
          B7             Em
Pois é dando que se recebe
          C               D
É perdoando que se é perdoado
         G       B7     Em
E é morrendo que se vive,
         B7 G B7 Em
Para a vida eterna`,
      },
      {
        id: 'bj-06',
        title: 'Girassol',
        artist: 'Kell Smith',
        duration: '3:52',
        requests: 22,
        addedAt: '2026-10-15T18:30:00.000Z',
        lyrics: `                      Girassol - Kell Smith
A
Eu sei que cada um só tem a vista da montanha que
    D
escalar
E                               A
Por isso todo dia eu me preocupo em fazer a coisa certa
E mesmo assim, infelizmente, às vezes, não parece
   D
adiantar
E
Porque o mundo tá tão louco e as pessoas andam tão
    A
estranhas

D                                A
Me diz se ainda passa o medo de não ser o melhor de mim
D                                 A
E se a gente se cobra menos em algum momento disso aqui
E
Me diz

A
Quando já não sei qual é a direção
F#m
E tudo que posso é seguir meu coração
      E
Então me viro
               A
E giro para onde gira o sol

Quando já não sei qual é a direção
F#m
E tudo que posso é seguir meu coração
      E
É por instinto
                    A
Que eu encontro a luz, sou girassol

A
Eu quero aquela vida que a gente inventa antes de
   D
dormir
E
Mas pra dar certo sei que tenho que acordar tomando

    A
atitude
                                D
O tempo não me espera só porque quero jogar tudo pro ar
E
E quase sempre é em desistência que o fracasso se
   A
resume

D
Me diz se ainda passa um medo de não ser o melhor de
  A
mim
D                               A
E se a gente se cobra menos em algum momento disso aqui
  E
Me diz

A
Quando já não sei qual é a direção
F#m
E tudo que posso é seguir meu coração
      E
Então me viro
               A
E giro para onde gira o sol

Quando já não sei qual é a direção
F#m
E tudo que posso é seguir meu coração
      E
É por instinto
                    A
Que eu encontro a luz, sou girassol

      E
É por instinto

Que eu encontro a luz
      A
Sou girassol`,
      },
      {
        id: 'bj-07',
        title: 'Uni-vos',
        artist: 'Bianca e Jorge',
        duration: '3:15',
        requests: 9,
        addedAt: '2026-10-15T18:35:00.000Z',
        lyrics: `                                       Uni-vos

G           Am
De que importa sua bandeira?
G           Am
Suas cores não me dizem nada

G          Am
Todas iguais, se segregando entre si

G          Am
Se sabe tanto, então faz!

C
Amai-vos como um só,
D
cantemos como um só

G           Am
Se reconhece por suas obras
G           Am
e pelo esforço em superar
G           Am
De que suas mãos estão marcadas?
G           Am
O que significa amar?

C
Amai-vos como um só,
D
cantemos como um só


G
Uni-vos em torno do mesmo ideal
Am
Derrube as barreiras do material
C
Amai-vos como um só,
D
cantemos como um só

G
Laraê, laraê, laraêlaiá,
Am

laraêlaiá (2x)


G                  Am
O corpo é só ferramenta
G                   Am
Pro espírito se reformar
G
Se curte Rock, Funk ou
                 Am
Pop, no fundo é tudo igual
G                 Am
Daqui o que vamos levar?

C
Amai-vos como um só,
D
cantemos como um só



G
Uni-vos em torno do mesmo ideal
Am
Derrube as barreiras do material
C
Amai-vos como um só,
D
cantemos como um só


G
Uni-vos em torno do mesmo ideal
Am
Derrube as barreiras do material
C
Amai-vos como um só,
D
cantemos como um só


G
Laraê, laraê, laraêlaiá,
Am
laraêlaiá (3X)

G
Laraê, laraê, laraêlaiá,
Am
laraêlaiá laiá`,
      },
      {
        id: 'bj-08',
        title: 'Trem-Bala',
        artist: 'Ana Vilela',
        duration: '4:18',
        requests: 27,
        addedAt: '2026-10-15T18:40:00.000Z',
        lyrics: `                     Trem-Bala - Ana Vilela

        A9
Não é sobre ter
                  D9
Todas as pessoas do mundo pra si
      A9
É sobre saber
                      E
Que em algum lugar, alguém zela por ti

       A9
É sobre cantar e poder escutar
          D9
Mais do que a própria voz
       A9
É sobre dançar
                    E
Na chuva de vida que cai sobre nós

[Refrão]

   D9
É saber se sentir infinito
     E
Num universo tão vasto e bonito
       A9
É saber sonhar
  D9
Então fazer valer a pena
    E
Cada verso daquele poema
        A9
Sobre acreditar

[Segunda Parte]

Não é sobre chegar
                D9

No topo do mundo e saber que venceu
         A9
É sobre escalar
                     E
E sentir que o caminho te fortaleceu

         A9
É sobre ser abrigo
                   D9
E também ter morada em outros corações
        A9
E assim ter amigos
                E
Contigo em todas as situações

[Refrão 2]

  D9
A gente não pode ter tudo
     E
Qual seria a graça do mundo
        A9
Se fosse assim?
  D9
Por isso eu prefiro sorrisos
      E
E os presentes que a vida trouxe
         A9
Pra perto de mim

[Terceira Parte]

Não é sobre tudo
                      D9
Que o seu dinheiro é capaz de comprar
        A9
E sim sobre cada momento
               E
Sorriso a se compartilhar

      A9
Também não é sobre

Correr contra o tempo
          D9
Pra ter sempre mais
          A9
Porque quando menos se espera
              E
A vida já ficou pra trás

[Refrão 3]

 D9
Segura teu filho no colo
  E
Sorria e abraça os teus pais
            A9
Enquanto estão aqui

    D9
Que a vida é trem bala, parceiro
   E
E a gente é só passageiro
       A9
Prestes a partir`,
      },
      {
        id: 'bj-09',
        title: 'Uma Prece (Totem)',
        artist: 'Cacau',
        duration: '3:40',
        requests: 11,
        addedAt: '2026-10-15T18:45:00.000Z',
        lyrics: `                                    Uma Prece (Totem) - Cacau



​ Em                C                   G/B
​Ó poderosa águia que há no alto do totem
​Am             D
​Dá-me tuas asas, me ensina a voar
​ Em                    C                G/B
​Cruzar os horizontes, vencer montes e mares
​     Am                D
​Com a luz do saber, pela virtude de amar


​Em                             C             G/B
​Com tua força tamanha, ó urso, me ajude a derrubar
​Am                             B
​As barreiras da vida que eu venha a encontrar


​          Em                                 C     G/B
​E eu venho pedir a ti, ó tartaruga, que o totem estás a sustentar
​Am                         B
​Dá-me tua certeza de um dia eu poder chegar
​          Em               C
​A ver-te nas asas da águia, na força do urso
​Am                 D
​Em todas as coisas criadas por ti
​Em             C               G/B
​Eleva minh'alma, me faz tão perfeito
​ Am                D               B
​Me leva a saber que estás dentro de mim


​Em                 C       G/B
​Ó Pai Nosso que estás no céu

​Am              B
​Santificado seja o teu nome
​          Em
​Em favor de todos nós`,
      },
      {
        id: 'bj-10',
        title: 'Aos Pés do Monte',
        artist: 'Tim e Vanessa',
        duration: '4:00',
        requests: 14,
        addedAt: '2026-10-15T18:50:00.000Z',
        lyrics: `                                Aos Pés do Monte - Tim e Vanessa


​Em                 Am
​Um sentimento me ronda
​D                     G       B7
​Não sei dizer, tudo é novo pra mim
​Em                Am
​Meu coração se renova
​D                  G          B7
​Sinto a esperança invadir o meu ser


​ Em                         Am
​Quero ser manso, ser limpo, ser justo
​ Em           B7       Em
​E pobre de espírito ser
​Am             D
​Tua palavra me sonda
​          G            D/F#        Em
​Me conta do Reino que espera por mim
​Am                 D
​Eu te ofereço meu pranto
​          G                 B7
​As dores da alma que quer renascer


​ Em           Am
​Eu ouvi tua voz
​     D        G       B7
​Teu falar me encantou
​     Em           Am
​Quis seguir, caminhar
​     D            G
​Quis saber pra onde vou

​    Am
​Eis-me aqui
​   B7         Em
​Minha dor serenou`,
      },
      {
        id: 'bj-11',
        title: 'Vento e Luz',
        artist: 'Bianca e Jorge',
        duration: '3:10',
        requests: 7,
        addedAt: '2026-10-15T18:55:00.000Z',
        lyrics: `                                  VENTO E LUZ

        ​    ​       A9                G/A
Ouça o vento na folhagem
                A9                 G/A
Veja a luz do sol e a lua
               F#m                 C#m
Pra viver em paz na terra
      D7+ C#m Bm E
Temos que tentar sorrir
        ​    ​       A9                G/A
E não ligar mais pra tristeza
        ​    ​       A9                G/A
No caminho sempre há pedras
               F#m                 C#m
Não sentir mais o abandono
D7+ C#m Bm E         D7+/9
Reunir e cantar pra     Jesus
A7+ F#m7 Bm
O sol conduz a paz
                     E D7+/9     A7+
E a ser feliz sem ter porque
                  F         E4           E   (final A9)
Pedir mais que o vento e a luz`,
      },
      {
        id: 'bj-12',
        title: 'Lei de Amor',
        artist: 'Fernanda Mendes Carvalho',
        duration: '3:35',
        requests: 13,
        addedAt: '2026-10-15T19:00:00.000Z',
        lyrics: `Lei de Amor - Fernanda Mendes Carvalho




F#m
Tente acreditar que o amor ainda virá
D                   C#7
Pela reencarnação tudo vai mudar

F#m
A família que nos cerca é aquela que escolhemos
D                     C#7
Para nossa evolução isso agora entendemos


F#m
Nascer ,viver,morrer
            D
Renascer ainda
           C#7
Progredir sempre , tal é a lei

F#m (Bm E A D Bm C#7)`,
      },
      {
        id: 'bj-13',
        title: 'Tempo e Vida',
        artist: 'Ariovaldo Filho',
        duration: '3:50',
        requests: 16,
        addedAt: '2026-10-15T19:05:00.000Z',
        lyrics: `                           Tempo e Vida - Ariovaldo Filho

A                A9
Depende de nós
A            A9
De mais ninguém
E                F#m
Que o amanhã seja melhor
C#m                D E
Através do amor e humildade


F#m         C#m
 Deixar o tempo e a vida
    D7+     D#°
correrem no riacho da
 Bm A
amizade

    A             E
E seremos no amanhã
    F#m         E
Uma grande família

 A                         E
Com certeza nossas vozes vencerão
F#m             A

em coro     todo o mal.`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PLAYLIST 2 — Grupo Vocal Amigos de Jesus
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'playlist-grupo-vocal',
    name: 'Grupo Vocal Amigos de Jesus',
    description: 'Cifras do Grupo Vocal Amigos de Jesus — Outubro 2023. Músicas de luz, esperança e fraternidade.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-sky-900 via-indigo-900 to-slate-900',
    createdBy: 'user-2',
    createdAt: '2026-10-16T19:00:00.000Z',
    songs: [
      {
        id: 'gv-01',
        title: 'Belo',
        artist: 'Grupo Vocal Amigos de Jesus',
        duration: '3:00',
        requests: 14,
        addedAt: '2026-10-16T19:05:00.000Z',
        lyrics: `                                                                                       4

                                           Belo
Introdução: C Am Dm G7
C        Am       Dm         G7       C           Am        Dm        G7
Belo pra mim é criança a brincar, é ouvir mil canções numa concha do mar
     C      Am        Dm         G7      C        Am        Dm                 G7
É a chuva caindo, é o campo em flor e acima de tudo, é o amor (é o amor) é o amor...
 C      Am             Dm      G7        C        Am     Dm        G7
Belo pra mim quando estou a sofrer e a treva na alma começa a crescer
      C          Am        Dm           G7       C      Am Dm G7 C
É lembrar com alegria que além, muito além, à espera de mim existe alguém.`,
      },
      {
        id: 'gv-02',
        title: 'Quanta Luz',
        artist: 'Cenyra Pinto',
        duration: '2:50',
        requests: 11,
        addedAt: '2026-10-16T19:10:00.000Z',
        lyrics: `                                      Quanta Luz
Compositor: Cenyra Pinto
Introdução: D Bm A7
    D        Bm
Quanta luz neste ambiente
  G        A
Descendo sobre nós
  A7          D    A7
Vibrando em nossa mente
     D             Bm
Quanta luz, quando assim em prece
G        A
Como a alma cresce
  A7      D D7
Aos olhos de Jesus...
     G           D
Quanta luz, pois em oração
         Bm       G      A A7
A voz do Mestre fala ao nosso coração...
     G             D
Quanta luz, descendo sobre nós
    Em           A                D
Quanta luz.....quanta luz...quanta luz`,
      },
      {
        id: 'gv-03',
        title: 'Canção da Alegria Cristã',
        artist: 'Leopoldo Machado / Oli de Castro',
        duration: '3:10',
        requests: 17,
        addedAt: '2026-10-16T19:15:00.000Z',
        lyrics: `                                                            5

                                 Canção da Alegria Cristã
Letra: Leopoldo Machado
Música: Oli de Castro
Introdução: G C D G...D G
               G
Somos companheiros,
           C
Amigos, irmãos
            D                    G
Que vivem alegres pensando no bem.
                               C
A nossa alegria é de bons cristãos,
                 D                  G... D G
Não ofende a Jesus, nem fere a ninguém.

             C                D
A nossa alegria (a nossa alegria)
               G
É bem do evangelho (é bem do evangelho)
            C                  D
Vibra e contagia (vibra e contagia)
                G
Da criança ao velho (da criança ao velho)
                C                      D
Mesmo entre perigos (mesmo entre perigos)
              G
Daremos as mãos (daremos as mãos)
              C                     D
Como bons amigos (como bons amigos)
C D C        D G... D G
Como bons cristãos...

        G
Sempre ombro a ombro,
                 C
Sempre lado a lado,
               D                  G
Vamos trabalhar com muita alegria,
             G                   C
Pelo o Espiritismo mais cristianizado,
                D                   G... D G
Pela implantação da paz e harmonia.`,
      },
      {
        id: 'gv-04',
        title: 'Já é Tempo',
        artist: 'James',
        duration: '3:20',
        requests: 19,
        addedAt: '2026-10-16T19:20:00.000Z',
        lyrics: `                                                                                            6

                                        Já é tempo
Compositor: James
Introdução: G D C...G
 G      D            C       G                     D
Sem saber que um sol maior brilhava sobre mim
         C     G B7            C               D7 D7
Quase me perdi... ii sem destino, mas o amor...
 G Am7              G         Am7                      G
Não.... não há lugar pra tristeza em quem sabe amar
       Am7                     G            Am7             G    B7
É uma luz que nos faz sonhar, é uma alegria que te faz chora ...aaá
              C               D7 D7
De sofrer sorrindo sem temor...
 G      Am7                G       Am7               G   B7
Olhe (Olhe) Olhe pro céu, já é tempo de cair o véee...eu
            C         D7          G       Am7 G
De sair amando espalhando a paz, a paz...(a paz)
  Am7        G      Am7       G     Am7        G
A paz... (a paz) a paz... (a paz) a paz... (a paz)`,
      },
      {
        id: 'gv-05',
        title: 'Amigo',
        artist: 'José Carlos Guimarães',
        duration: '3:15',
        requests: 16,
        addedAt: '2026-10-16T19:25:00.000Z',
        lyrics: `                                          Amigo
José Carlos Guimarães
Introdução: D D7+ D7 G Em7 A7 A7
D                    D7+                  D7                       G
Onde estiver sei que vou caminhar com você, meu irmão, meu amigo
Em                  Em7                 A7
Seja na terra ou nas águas do mar, na pureza do ar com você, amigo
D                   D7+                  D7                        G
Onde estiver sei que vou caminhar com você, meu irmão, meu amigo
Em                     Em7                       A7
Na escuridão sei que a luz vai voltar, sei que o sol vai brilhar em você, amigo

D     F#m       Em Em7         A A7 D
Amor, amor, que nunca vai nos sepa...rar amor [BIS]`,
      },
      {
        id: 'gv-06',
        title: 'Cativar',
        artist: 'Grupo Vocal Amigos de Jesus',
        duration: '3:30',
        requests: 12,
        addedAt: '2026-10-16T19:30:00.000Z',
        lyrics: `                                          Cativar
Introdução: C Am Dm G (2x)
C               Am                    Dm                G7
Uma palavra tão linda, já quase esquecida me fez relembrar
    C           Am                 Dm               G7
Contendo sete letrinhas e todas juntinhas se lê cativar
    C      Am         Dm        G7          C         Am          Dm       G7
Cativar é amar, é também carregar um pouquinho da dor que alguém tem que levar
    C             Am         Dm       G7          C      Am    Dm     G7

Cativou, disse alguém, laços fortes criou, responsável é você pelo que cativou
         C       Am       Dm            G7          C      Am        Dm           G7
Num deserto tão só, entre homens também, vou tentar cativar, viver perto de alguém
     C            Am         Dm       G7          C        Am      Dm G7         C Am Dm
Cativou, disse alguém, laços fortes criou, responsável é você pelo que caaatiiiivoooooooo
G7      C Am Dm G7 C
Caatiiivooooooou... Cativou`,
      },
      {
        id: 'gv-07',
        title: 'Alegria',
        artist: 'Grupo Vocal Amigos de Jesus',
        duration: '2:55',
        requests: 20,
        addedAt: '2026-10-16T19:35:00.000Z',
        lyrics: `                                                                                                  7




                                             Alegria

C             Am      Dm          G7
Quando uma tristeza tomar seu coração
C             Am      Dm          G7
Não se desamine e cante uma canção
   C Am       Dm      G7       C       Am
E lembre que acima de tudo você tem alguém
Dm      G7         C          Am Dm G7
Que lhe quer muito bem, muito bem, muito bem

C          Am      Dm         G7
Ponha um sorriso bonito no seu rosto
C              Am      Dm          G7
Deixe que as lágrimas lavem seu desgosto
   C Am        Dm       G7       C      Am
E lembre que acima de tudo você tem alguém
Dm      G7         C          Am Dm G7
Que lhe quer muito bem, muito bem, muito bem

C             Am        Dm           G7
Quando uma dorzinha danada de doer
C          Am      Dm             G7
Bem lá no fundo lhe fizer sofrer
   C Am       Dm        G7        C     Am
E lembre que acima de tudo você tem alguém
Dm      G7          C            Am Dm G7
Que lhe quer muito bem, muito bem, muito bem


                                         Gosto de Você
Int.: D A Bm F#m G F#m Bm Em A7

D               A                  Bm            F#m
Gosto de você assim como você é // Pode me amar assim como você quer
G                  F#m Bm Em                     A7
Quero ter você e não quero saber // Se assim não fosse, como poderia?
D                  A                           Bm                      F#m
Ser de outro jeito, abraços os seus defeitos, // Gosto dos seus olhos, o jeito que me olhas
G                      F#m          Bm      Em                        A7
Seja assim tão pura // A minha voz é sua // Me ame sempre igual em casa ou na rua
D                      A                     Bm                   F#m
Deixe que o vento penteie seus cabelos, // Faça dos meus olhos sempre seu espelho
G                          F#m        Bm       Em                        A7                   D
Deixe que essa noite eu traga uma canção, // Deixe que eu te guarde dentro do meu coração!`,
      },
      {
        id: 'gv-08',
        title: 'A Paz',
        artist: 'Roupa Nova',
        duration: '4:10',
        requests: 23,
        addedAt: '2026-10-16T19:40:00.000Z',
        lyrics: `                                                      8

                              A Paz - Roupa Nova
Intro: C Dm Em Dm (Capo na 5ª casa)
   C       Dm       Em         Dm
Deve haver um lugar dentro do seu coração
   C        Dm            Em Dm
Onde a paz brilhe mais que uma lembrança
   C         Dm       Em        Dm
Sem a luz que ela traz já nem se consegue mais
   C      Dm         Em Dm
Encontrar o caminho da esperança
    Am       Em      F          Em
Sinta, chega o tempo de enxugar o pranto dos homens
    Dm          G4     G
Se fazendo irmão e estendendo a mão
     C         Dm
Só o amor, muda o que já se fez
    G4 G          C        G/B
E a força da paz junta todos outra vez
    Am       Em        F       Em
Venha,     já é hora de acender a chama da vida
    Dm         G       C
E fazer a terra inteira feliz
   C      Dm      Em       Dm
Se você for capaz de soltar a sua voz
   C        Dm     Em Dm
Pelo ar, como prece de criança
    C      Dm      Em          Dm
Deve então começar outros vão te acompanhar
   C        Dm       Em      Dm
E cantar com harmonia e esperança

    Am           Em F              Em
Deixe,    que esse canto lave o pranto do mundo
     Dm         G4      G
Pra trazer perdão e dividir o pão.

Refrão:

     Bb                     C
Quanta dor e sofrimento em volta a gente ainda tem,
     Bb                 C
Pra manter a fé e o sonho dos que ainda vêm.
    Am      Em        F       Em
A lição pro futuro vem da alma e do coração,
      Dm                  G G4
Pra buscar a paz, não olhar pra trás, com amor.

   C     Dm      Em        Dm
Se você começar outros vão te acompanhar
   C       Dm      Em Dm
E cantar com harmonia e esperança.

      Am        Em F               Em
Deixe,    que esse canto lave o pranto do mundo
      Dm        G4      G
Pra trazer perdão e dividir o pão. Refrão:`,
      },
      {
        id: 'gv-09',
        title: 'Confia Sempre',
        artist: 'Carla Bevilacqua Piccolo',
        duration: '3:40',
        requests: 15,
        addedAt: '2026-10-16T19:45:00.000Z',
        lyrics: `                                                             10


                                       Confia Sempre
                                  Carla Bevilacqua Piccolo

(Capo na 1ª casa) ou (Capo na 2ª casa, forma de C)
Introd.: D, Bm, G, A (2x)

D
Não percas a tua fé
Bm
Entre as sombras deste mundo
G                     A
Ainda que teus pés sangrem
              D
Confia sempre e segue

                  Bm
Tudo passa nesta Terra
                              G
Mas o que vem do céu permanecerá
                     A
Eleva, pois, o teu olhar
                      D   Bm
Confia sempre e segue

G         A                  D
Luta.. Esforça-te no bem e confia sempre

D                      Bm
Se hoje domina a tempestade
                     G
E te atormenta o coração
                          A
Brilha a alvorada além da noite
                    D
Confia sempre e segue

             Bm
Há uma luz celeste
                 G
Pairando acima de ti
                      A
Crê que amanhã serás feliz
                  D        Bm
Confia sempre e segue

G          A                   D
Luta... Esforça-te no bem e confia sempre...
G              A      D
Esforça-te no bem e confia sempre`,
      },
      {
        id: 'gv-10',
        title: 'Aurora',
        artist: 'Tim e Vanessa',
        duration: '4:30',
        requests: 18,
        addedAt: '2026-10-16T19:50:00.000Z',
        lyrics: `                                                          12


                                          Aurora
Tim e Vanessa

Intro: Em D4(6) C G/B D9/F# (original: capo na 4ª casa)

Uma grande noite abate a Terra, que se abate.
Treva imensa, não sem estrelas...
Passados milênios, um abrasamento
tisna o horizonte clareando esperança.
Prenúncio milenar do amanhecer.
G9         G        G9    G
Bem vinda Aurora
C C/B             Am7 Am7/G D9/F#              G6
    A terra sofreu,             noites convulsivas
D9/F# C7M                   Bm7
Verteu lágrimas, rangeu dentes
            Em           D4(6)
Mas gestou-se, majestou-se
       C      C/B          Am Am/G
No parto regenerativo deu-se à luz
             D9/F#*
Na Remissão
G         G9           G       G9
Bem vinda Aurora
C C/B         Am7 Am7/G D9/F#              G6
     O lobo pasta            junto ao cordeiro
D9/F# C7M                      Bm7
Crianças brincam com a serpente
       Em            D4(6)
E os anjos andarilham
   C                C/B
Com os homens que volitam
Am Am/G                D9/F#
No amor da Promissão
G         G9             G          G9
Bem vinda Alvorada
C                  C5-            C C5-
Artefazendo o belo bom
     D4(9)
Entreflorindo olhar
Em       Bm7
A aliança homem-Deus
   C     C/B Am Am/G
Já não é só arco-íris
           D9/F#
É comunhão
                   G G9 G
Bem vindo dia
G9                  C C5-
Bem vinda Luz`,
      },
      {
        id: 'gv-11',
        title: 'Diamantes de Poeira',
        artist: 'Ariovaldo Filho',
        duration: '3:20',
        requests: 10,
        addedAt: '2026-10-16T19:55:00.000Z',
        lyrics: `                                                           11

                                 Diamantes de Poeira

Ariovaldo Filho
Tom: G int: G C9 G C9 G C9
G         C9       G       Em
Olha a manhã que brilha na janela
G         C9       F7+       C    F7+       G C9 G C9
Este sol de Deus é luz de amor em seu co_ra_ção
G      C9        G      Em
Olha o que Deus nos deu de presente
  G           C9         F7+ C      F7+      G C9 G
Diamantes de poeira flutuando em raios de luz
                 Em                     Am7
Vamos louvar a Deus        e agradecer a tudo
           D7           G          Em
Um novo dia amanheceu, amanheceu
               Am7                     D7
Nos levantar agora,      sair ao mundo hoje
               F7+ C F7+           G C9 G C9 G C9
Testificar o amor ... o amor de Jesus              [BIS]

                                     Fio Condutor
Autor desconhecido


G
À luz da oração
Em     C Em C               G
Vibração, proteção de nossas almas
G
Orar, meditar
Em      C Em C                  G
Transcender, mergulhar dentro da alma


G              Bm
A prece é uma estrela
                C       D7
Que brilha na escuridão
G               Bm
Com sua luz ilumina
            C       D7
Nossa peregrinação


G            Bm
Bússola que orienta
               C       D7
Nossa frágil embarcação
C                   G
Como um fio condutor
D               G
Nos liga ao Criador`,
      },
      {
        id: 'gv-12',
        title: 'Alvorada Jovem',
        artist: 'Grupo Vocal Amigos de Jesus',
        duration: '3:05',
        requests: 21,
        addedAt: '2026-10-16T20:00:00.000Z',
        lyrics: `Alvorada Jovem
Tom: G

[Intro] G D/F# Em Bm7

      Am7 D7 D7(4)



G        D/F# Em              Bm7

Jovem (jovem), desbravador de novos mares (úúú)

Am7                 D7 Am7

 Depende só de seus cantares o renascer de um

     C       D7

mundo bom, bem melhor!

G        D/F# Em                  Bm7

Jovem (jovem), com sangue novo e peito aberto (úúú)

Am7                 D7

 Será traçado um rumo certo

    Am7            D7    Am7

Guiaremos o mundo ao amor, guiaremos o mundo ao

    D7 D7(4)

amor!



G            Em           Am7

 E quando amanhecer, o sol de primavera

            D7     D7(4) D7   G

Desvenda a nova era em mim e em você`,
      },
      {
        id: 'gv-13',
        title: 'One Day',
        artist: 'Matisyahu',
        duration: '3:55',
        requests: 25,
        addedAt: '2026-10-16T20:05:00.000Z',
        lyrics: `                                                                                          37

                                            One Day
Autor: Matisyahu - Intro: C G Am F (Capo na XX casa)
C         G           Am           F
 Sometimes I lay under the moon, I thank God I'm breathin'
C     G               Am               F
 Then I pray don't take me soon, 'cause I am here for reason
C                 G           Am            F
Sometimes in my tears I drown, but I never let it get me down
          C           G       Am            F
So when negativity surrounds, I know someday it'll all turn around because
C             G               Am                F
All my life I been waiting for, I been praying for, for the people to say
C             G                        Am           F
That we don't wanna fight no more, there'll be no more wars, and our children will play
C     G       Am          F
One day, one day, one day, oh oh oh 2x
C         G           Am           F
 Sometimes I lay under the moon, I thank God I'm breathin'
C     G               Am               F
 Then I pray don't take me soon, 'cause I am here for reason
C                 G           Am            F
Sometimes in my tears I drown, but I never let it get me down
          C           G       Am            F
So when negativity surrounds, I know someday it'll all turn around because
C             G               Am                F
All my life I been waiting for, I been praying for, for the people to say
C             G                        Am           F
That we don't wanna fight no more, there'll be no more wars, and our children will play
C     G       Am          F
One day, one day, one day, oh oh oh 2x

C             G               Am                F
All my life I been waiting for, I been praying for, for the people to say
C             G                        Am           F
That we don't wanna fight no more, there'll be no more wars, and our children will play
C     G       Am          F
One day, one day, one day, oh oh oh 4x`,
      },
      {
        id: 'gv-14',
        title: 'Aleluia',
        artist: 'Elizabete Lacerda',
        duration: '3:50',
        requests: 30,
        addedAt: '2026-10-16T20:10:00.000Z',
        lyrics: `                                                                                    38

                                                            Aleluia
Autora: Elizabete Lacerda
Intro: C Am C Am F G C G (Capo XX Casa)


C        Am           C               Am            F         G          C G
Acredite estou aqui, ao teu lado e vou te ouvir venho consolar teu coração
C        F       G       Am                F            G            E    Am
Fale me do teu sofrer, busque a mim basta querer, posso restaurar a tua vida


    F        Am            F          C G       C
Aleluia, aleluia, aleluia, aleluuuuuiiiaaa


C            Am               C            Am
Homens fracos creiam em mim, toda dor há de ter fim
F        G                C       G
Sou de Deus e trago a luz ao mundo
C            F       G Am              F            G            E            Am
Todo pranto ha de secar, a esperança vai brotar, sinta minha presença em tua vida


    F        Am            F          C G       C
Aleluia, aleluia, aleluia, aleluuuuuiiiaaa


C            Am            C          Am            F            G        C G
Sou o cristo consolador, mensageiro do amor, junto a mim encontrarás abrigo
C         F       G Am                F         G            E           Am
Nas tormentas e na dor, não desista lá estou, trago a esperança sou amor


    F        Am            F          C G       C
Aleluia, aleluia, aleluia, aleluuuuuiiiaaa


C        Am           C               Am
Todos num só coração, as nações se dando as mãos,
F        G           C    G
Somos todos filhos do senhor
C        F        G       Am           F                G         E       Am
Sai o ódio entra o amor, vai a guerra nasce a flor, então cantaremos aleluia


     F        Am              F       C G       C
 Aleluia, aleluia, aleluia, aleluuuuuiiiaaa`,
      },
      {
        id: 'gv-15',
        title: 'Força do Bem',
        artist: 'Grupo Bem',
        duration: '3:45',
        requests: 28,
        addedAt: '2026-10-16T20:15:00.000Z',
        lyrics: `Força do Bem - Grupo Bem
intro: F#m D A E

  F#m                      D

Me perguntam de onde vem

      A            E

esse olhar firme e seguro

      F#m              D

quando tudo é desafio

      A            E

quando tudo é tão escuro



   F#m                     D

as respostas que eu tenho

   A                   E

se encontram neste mundo

 F#m               D

a certeza que eu sinto

  A            E

é o meu porto-seguro



  F#m              D

eu me cerco, eu vigio

       A           E

eu me importo, eu procuro

  F#m          D

persevero, acredito

       A           E

eu transformo este mundo



  F#m          D

é na força do bem

           A       E

que eu me apego e caminho

    F#m                 D

no poder que mantém

        A           E

meu coração protegido



        F#m             D

e não há nada, nada

A           E

nada a temer

    F#m                 D

pois a força do bem

    A           E

é o maior poder`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PLAYLIST 3 — Músicas do Filipe
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'playlist-filipe',
    name: 'Músicas do Filipe',
    description: 'Repertório pessoal do Filipe: músicas espirituais de amor, fé e transformação interior.',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-emerald-800 via-teal-900 to-slate-900',
    createdBy: 'user-3',
    createdAt: '2026-10-17T20:00:00.000Z',
    songs: [
      {
        id: 'fp-01',
        title: 'Apenas Amar',
        artist: 'Denis Soares',
        duration: '3:55',
        requests: 20,
        addedAt: '2026-10-17T20:05:00.000Z',
        lyrics: `Apenas Amar - Denis Soares
    C           F7M              C

Todo o Céu se organiza para vir nos transformar

C7M

    C            F7M         G/C           G

O Cristo já nos auxilia para vida nova alçar

C                F7M                   C

Ondas de atos belos podem vir de nossas

        C7M

próprias mãos

C               F7M              G/C       G

Sentimentos triunfantes brotam naturais, então



F7M             Em         F7M             Em

Vou por dentro me preparar pra sem rebeldia aceitar

F7M            Em          F7M         G

Invencível expande o amor em fraternidade



F        F7M    C

E eu desejo apenas amar, e todo um mar

F       F7M      C

De afetos cativar

F       F7M            C

Uma luz vem pra resplandecer, dentro do ser

F         F7M         C

Para ao Pai glorificar`,
      },
      {
        id: 'fp-02',
        title: 'O Chamado',
        artist: 'Evangelizar É Amar',
        duration: '4:05',
        requests: 17,
        addedAt: '2026-10-17T20:10:00.000Z',
        lyrics: `O Chamado - Evangelizar É Amar
          C

Esquece o tempo

                      Am

Preocupado em teres o que os outros têm

      C                               F

Facilidades que na aparência os tornam mais

 G7/4 G7

felizes



      C

Seja grato por sua vida,



Creia em Deus e em mim também,

     Am

Valoriza com ternura a todos que te querem bem

 F                    Dm

Amar é ser mais livre e liberdade é condição

      G7/4       G7           G7/4         G7

Pra alcançar felicidade, seja neste mundo ou não



          C                      Am

Esquece o tempo dos mitos dessa ilusão constante

                          F

De que viver pro mundo era o bastante

     Dm                   G7/4            G7

Talvez chamar meu nome não passasse de uma

          G7/4   G7

simples convenção

          C                          Am

Esquece o tempo marcado pelo orgulho e a vaidade

                      F

Erraste por não ter a humildade

   Dm                       G7/4   G7

De admitir tuas faltas, de dobrar-te a um pedido

    G7/4 G7

de perdão

(REFRÃO)

     F                      G7

Esquece tudo e vem, senta ao meu lado

      C       E7   Am       Am/G

Nós precisamos conversar

          F             Dm

Meu fardo é leve, a escolha é tua

         G7/4 G7        C

Não perca o tempo de mudar`,
      },
      {
        id: 'fp-03',
        title: 'Uma Prece',
        artist: 'Cacau',
        duration: '3:40',
        requests: 15,
        addedAt: '2026-10-17T20:15:00.000Z',
        lyrics: `Uma Prece - Cacau
[Intro] Em C Am D B7

 Em                    C

Ó poderosa águia que há no alto do totem

Am             D               B7

Dá-me tuas asas, me ensina a voar

 Em                        C

Cruzar os horizontes, vencer montes e mares

     Am                    D           B7

Com a luz do saber, pela virtude de amar



Em                              C

Com tua força tamanha, ó urso, me ajude a derrubar

Am                                 D     B7

As barreiras da vida que eu venha a encontrar



          Em

E eu venho pedir a ti, ó tartaruga, que o totem

  C

estás a

Sustentar

Am                             D        B7

Dá-me tua certeza de um dia eu poder chegar

          Em               C

A ver-te nas asas da águia, na força do urso

Am                 D           B7

Em todas as coisas criadas por ti

Em             C

Eleva minh'alma, me faz tão perfeito

  Am                   D            B7

Me leva a saber que estás dentro de mim



Em                 C

Ó Pai Nosso que estás no céu

Am                  D

Santificado seja o teu nome

     B7        Em

Em favor de todos nós

                 C

Ó Pai Nosso que estás no céu

Am                  D

Santificado seja o teu nome

     B7        Em       C   Am

Em favor de todos nóóós... nóóós... nóóós...

  D       B7

nóóós... nóóós`,
      },
      {
        id: 'fp-04',
        title: 'Força do Bem',
        artist: 'Grupo Bem',
        duration: '3:45',
        requests: 24,
        addedAt: '2026-10-17T20:20:00.000Z',
        lyrics: `Me perguntam de onde vem
esse olhar firme e seguro
quando tudo é desafio
quando tudo é tão escuro

as respostas que eu tenho
se encontram neste mundo
a certeza que eu sinto
é o meu porto-seguro

eu me cerco, eu vigio
eu me importo, eu procuro
persevero, acredito
eu transformo este mundo

é na força do bem
que eu me apego e caminho
no poder que mantém
meu coração protegido

e não há nada, nada
nada a temer
pois a força do bem
é o maior poder`,
      },
      {
        id: 'fp-05',
        title: 'Já É Tempo',
        artist: 'Música Espírita',
        duration: '3:20',
        requests: 19,
        addedAt: '2026-10-17T20:25:00.000Z',
        lyrics: `Já É Tempo - Música Espírita
Intro: G D/F# C G



G     D/F#         C       G

Sem saber que um Sol maior,

            D/F#        C          G B7

Brilhava sobre mim quase me perdi

       C           D7 D7/4 D7

Ia sem destino, mas o amor...



G Am7          G               Am7          G

Não, não há lugar pra tristeza em quem sabe amar

      Am7               G             Am7

É uma luz que nos faz sonhar é uma alegria que

       G B7

nos faz chorar

           C           D7 D7/4

E sofrer sorrindo, sem temor...



G      Am7             G           Am7

Olhe, olhe, olhe pro céu, já é tempo de cair o

G B7

véu

       C       D7              G     Am7

De sair amando, espalhando a paz, a paz



G Am7 G Am7 G B7

Na, na, na, na

       C       D7           G       Am7

De sair amando,espalhando a paz, a paz



G Am7          G               Am7          G

Não, não há lugar pra tristeza em quem sabe amar

        Am7            G          Am7

É uma luz que nos faz sonhar é uma alegria que

         G B7

te faz chorar

             C        D7 D7/4

E sofrer sorrindo, sem temor...



G        Am7          G       Am7

Olhe, olhe, olhe pro céu, já é tempo de cair o

G B7

véu

         C       D7       G   Am7

De sair amando,espalhando a paz,a paz

    G    Am7     G    Am7     G

A paz, a paz a paz,a paz a paz`,
      },
      {
        id: 'fp-06',
        title: 'Alvorada Jovem',
        artist: 'Grupo Vocal',
        duration: '3:05',
        requests: 22,
        addedAt: '2026-10-17T20:30:00.000Z',
        lyrics: `Jovem (jovem), desbravador de novos mares (úúú)
Depende só de seus cantares o renascer de um mundo bom, bem melhor!

Jovem (jovem), com sangue novo e peito aberto (úúú)
Será traçado um rumo certo
Guiaremos o mundo ao amor, guiaremos o mundo ao amor!

E quando amanhecer, o sol de primavera
Desvenda a nova era em mim e em você`,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  // PLAYLIST 4 — Ricardo Baptista
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "playlist-ricardo-baptista",
    name: "Ricardo Baptista",
    description: "Repertório do Ricardo Baptista: canções e cifras de reflexão, esperança, amizade e vida para o evento ao vivo.",
    imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80",
    gradient: "from-amber-900 via-yellow-950 to-neutral-900",
    createdBy: "user-3",
    createdAt: "2026-10-18T10:00:00.000Z",
    songs: [
      {
        id: "rb-01",
        title: "Para Sempre No Meu Coração",
        artist: "Simplesmente Almas",
        duration: "3:40",
        requests: 0,
        addedAt: "2026-10-18T10:00:00.000Z",
        lyrics: `Para Sempre No Meu Coração - Simplesmente Almas
D                        D7M           G

Nem se eu pudesse ter o pôr do sol, a lua, as

                 Gm

estrelas, toda a natureza

D                        D7M       G

Nem se eu tivesse todo o ouro e não tivesse um

        Gm

amigo, nada teria

G                A         F#m              Bm

Mas quando eu começasse a me sentir sozinho,

G            A

quem é que me

        D       D7

Consolaria?

G            A           F#m               Bm

Mas deus é bom botou você em meu caminho, pra

         G

que não falte a

        A

Alegria

            D

Você vai estar

    D7M                        G           Gm

Para sempre dentro do meu coração, vou lembrar

    D           D7M

de nós sempre que

                     G    Gm

Alguém cantar esta canção

D                        D7M           G

Nem se eu soubesse muitas palavras, nem se eu

                 Gm

as transformasse em poesia

D                        D7M       G

Não diria tudo o que há pra dizer, a inspiração

        Gm

de certo, faltaria

G            A           F#m       Bm   G

Mas se algum dia me faltar o seu abraço, não

        A

será triste a

    D       D7

Saudade

G                A         F#m         Bm

 Pois sei que nos encontraremos no espaço, meu

    G                A

amigo de verdade

            D

Você vai estar

    D7M                        G       Gm

Para sempre dentro do meu coração, vou lembrar

    D        D7M

de nós sempre que

                     G    Gm

Alguém cantar esta canção`,
      },
      {
        id: "rb-02",
        title: "Enquanto Houver Sol",
        artist: "Titãs",
        duration: "3:40",
        requests: 0,
        addedAt: "2026-10-18T10:00:00.000Z",
        lyrics: `Enquanto Houver Sol - Titãs
        A           B

Quando não houver saída

        A               B

Quando não houver mais solução

A               G#m

Ainda há de haver saída

F#m         A   B           E

Nenhuma idéia vale uma vida

        A               B

Quando não houver esperança

        A            B

Quando não restar nem ilusão

A                   G#m

Ainda há de haver esperança

    F#m         A           B   E

Em cada um de nós, algo de uma criança



Chorus:



    A                Am

Enquanto houver sol, enquanto houver sol

E           G#m

Ainda haverá

    A                Am             E E4 E

Enquanto houver sol, enquanto houver sol



        A            B

Quando não houver caminho

        A               B

Mesmo sem amor, sem direção

    A               G#m

A sós ninguém está sozinho

F#m         A        B        E

É caminhando que se faz o caminho

        A            B

Quando não houver desejo

        A                B

Quando não restar nem mesmo dor

A                   G#m

Ainda há de haver desejo

    F#m         A         B       E

Em cada um de nós, aonde Deus colocou

    A                Am

Enquanto houver sol, enquanto houver sol

E           G#m

Ainda haverá

    A                Am           E E4 E

Enquanto houver sol, enquanto houver sol




Chorus:

    A                Am

Enquanto houver sol, enquanto houver sol

E           G#m

Ainda haverá

    A                Am           E E4 E

Enquanto houver sol, enquanto houver sol`,
      },
      {
        id: "rb-03",
        title: "É Preciso Saber Viver",
        artist: "Titãs",
        duration: "3:40",
        requests: 0,
        addedAt: "2026-10-18T10:00:00.000Z",
        lyrics: `É Preciso Saber Viver - Titãs
     D

Quem espera que a vida



Seja feita de ilusão



Pode até ficar maluco

    G

Ou morrer na solidão

    Gm

É preciso ter cuidado

        D         Bm

Pra mais tarde não sofrer

E        G    A

É preciso saber viver



    D

Toda pedra no caminho



Você pode retirar



Numa flor que tem espinhos

    G

Você pode se arranhar

    Gm

Se o bem e o mal existem

    D        Bm

Você pode escolher

E        G    A

É preciso saber viver



[Refrão]

G        D        Bm

É preciso saber viver

G        D        Bm

É preciso saber viver

G        D        Bm

É preciso saber viver

E           G A

Saber viver



[Solo] D G Gm D

    Bm E G A

    D G Gm D

    Bm E G A



[Primeira Parte]



     D

Quem espera que a vida



Seja feita de ilusão



Pode até ficar maluco

    G

Ou morrer na solidão

    Gm

É preciso ter cuidado

        D             Bm

Pra mais tarde não sofrer

E        G        A

É preciso saber viver



    D

Toda pedra no caminho

Você pode retirar



Numa flor que tem espinhos

    G

Você pode se arranhar

    Gm

Se o bem e o mal existem

    D        Bm

Você pode escolher

E       G      A

É preciso saber viver



[Refrão]



G        D     Bm

É preciso saber viver

G        D     Bm

É preciso saber viver

G        D     Bm

É preciso saber viver

E        G A

Saber viver



G        D     Bm

É preciso saber viver

G        D     Bm

É preciso saber viver

G        D     Bm

É preciso saber viver

E        G A

Saber viver



G        D     Bm

É preciso saber viver

G      D      Bm

É preciso saber viver

G      D      Bm

É preciso saber viver

E       G A D

Saber viver`,
      },
      {
        id: "rb-04",
        title: "Dias Melhores",
        artist: "Jota Quest",
        duration: "3:40",
        requests: 0,
        addedAt: "2026-10-18T10:00:00.000Z",
        lyrics: `Dias Melhores - Jota Quest

G                     Em7

 Vivemos esperando dias melhores

G                 Em7

 Dias de paz, dias a mais

D4/F#                 G

Dias que não deixaremos para trás

      Em7 D4/F#

Oh, oh, oh



G

 Vivemos esperando

            Em7

O dia em que seremos melhores

G                         Em7

 Melhores no amor, melhores na dor

D4/F#             G

     Melhores em tudo

      Em7

Oh, oh, oh



[Pré-Refrão]



C9           G/B

    Vivemos esperando

C9             G/B

    O dia em que seremos para sempre

C9           G/B

    Vivemos esperando

      Am7

Oh, oh, oh

[Refrão]



G         C9     G    C9

Dias melhores pra sempre

G         C9

Dias melhores

     G

Pra sempre



( Em7 G Em7 D4/F# )



[Primeira Parte]



G                     Em7

 Vivemos esperando dias melhores

G                Em7

 Dias de paz, dias a mais

D4/F#                 G

Dias que não deixaremos para trás

         Em7

Oh, oh, oh



[Pré-Refrão]



C9             G/B

    Vivemos esperando

C9              G/B

    O dia em que seremos para sempre

C9             G/B

    Vivemos esperando

         Am7

Oh, oh, oh



[Refrão Final]

G       C9   G   C9

Dias melhores pra sempre

G       C9   G   C9

Dias melhores pra sempre

G       C9   G   C9

Dias melhores pra sempre

G       C9   G

Dias melhores pra sempre



( Em7 G Em7 )



    G

Pra sempre`,
      },
    ],
  },
];

/**
 * Converte as linhas do Supabase (`playlists` + `songs`) para o formato usado pela UI.
 * Campos que não existem no banco (descrição, gradiente, duração, criador) são
 * recuperados do seed dos PDFs quando o nome/título coincide; caso contrário, usam padrões.
 */
function mapDbToPlaylists(dbPlaylists = [], dbSongs = [], customDescriptions = {}) {
  const presetSongs = new Map();
  INITIAL_PLAYLISTS.forEach((pl) =>
    pl.songs.forEach((s) => presetSongs.set(`${pl.name}::${s.title}`.toLowerCase(), s))
  );

  const songsByPlaylist = {};
  dbSongs.forEach((song) => {
    (songsByPlaylist[song.playlist_id] ||= []).push(song);
  });

  return dbPlaylists
    .filter((pl) => pl.id !== SYSTEM_COLLABORATORS_ID && pl.title !== "__SYSTEM_COLLABORATORS__")
    .map((pl) => {
      let parsedUrl = pl.image_url || "";
      let parsedDesc = pl.description || null;
      if (pl.image_url && typeof pl.image_url === "string" && pl.image_url.trim().startsWith("{")) {
        try {
          const meta = JSON.parse(pl.image_url);
          if (meta.url !== undefined) parsedUrl = meta.url;
          if (meta.description !== undefined) parsedDesc = meta.description;
        } catch (e) {
          // preserve
        }
      }

      const preset = INITIAL_PLAYLISTS.find((p) => p.name.toLowerCase() === pl.title.toLowerCase());
      return {
        id: pl.id,
        name: pl.title,
        title: pl.title,
        description: parsedDesc || customDescriptions[pl.id] || preset?.description || "Repertório de músicas ao vivo.",
        imageUrl: parsedUrl || preset?.imageUrl || "",
        image_url: parsedUrl || preset?.imageUrl || "",
        gradient: preset?.gradient || "from-neutral-800 via-neutral-900 to-black",
        createdBy: preset?.createdBy || "user-1",
        createdAt: pl.created_at,
        songs: (songsByPlaylist[pl.id] || []).map((song) => {
          const seedSong = presetSongs.get(`${pl.title}::${song.title}`.toLowerCase());
          return {
            id: song.id,
            playlist_id: song.playlist_id,
            title: song.title,
            artist: song.artist,
            lyrics: song.lyrics || "",
            duration: seedSong?.duration || "3:30",
            requests: 0,
            addedAt: song.created_at,
          };
        }),
      };
    });
}

/**
 * Generates a random emoji avatar from a curated set.
 * @returns {string}
 */
function randomAvatar() {
  const avatars = ['🧑', '👩', '🧔', '👨', '👱', '🧕', '👩‍🦱', '👨‍🦳', '🎸', '🎵', '🎤', '🎹', '🥁'];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

/**
 * Generates a short pseudo-random confirmation token.
 * NOT cryptographic — only for UI simulation purposes.
 * @returns {string}
 */
function generateToken() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

/**
 * AppContextProvider manages all shared application state,
 * synced to localStorage.
 */
export function AppProvider({ children }) {
  // Playlists state managed via Supabase async queries
  const [dbPlaylists, setPlaylists] = useState([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);

  // As tabelas `songs`/`playlists` não possuem coluna de pedidos ao vivo, então o
  // contador de pedidos por música fica no navegador e é mesclado aos dados do Supabase.
  const [requestCounts, setRequestCounts] = useLocalStorage('spiritfy_song_requests', {});

  // Descrições personalizadas salvas pelo usuário/colaborador
  const [playlistDescriptions, setPlaylistDescriptions] = useLocalStorage('spiritfy_playlist_descriptions', {});

  // Guarda contra execução dupla do efeito (React.StrictMode) que duplicaria o seed.
  const hasFetchedRef = useRef(false);

  const playlists = useMemo(
    () =>
      dbPlaylists.map((pl) => ({
        ...pl,
        songs: (pl.songs || []).map((s) => ({
          ...s,
          requests: requestCounts[s.id] ?? s.requests ?? 0,
        })),
      })),
    [dbPlaylists, requestCounts]
  );

  // Global Toast state
  const [toast, setToast] = useState(null);

  /**
   * Helper to trigger a toast banner
   * @param {string} message
   * @param {'success' | 'info' | 'warning'} [type='success']
   */
  const showToast = useCallback((message, type = 'success') => {
    setToast({
      id: Date.now() + Math.random(),
      message,
      type,
    });
  }, []);

  /**
   * Semeia as 4 playlists oficiais e respectivas músicas no Supabase
   * caso o banco na nuvem esteja vazio na primeira inicialização.
   */
  /**
   * Semeia as 4 playlists oficiais e respectivas músicas no Supabase
   * caso o banco na nuvem esteja vazio na primeira inicialização.
   */
  const seedInitialPlaylists = useCallback(async () => {
    try {
      console.log('[Supabase] Inicializando banco de dados com as playlists oficiais...');
      for (const pl of INITIAL_PLAYLISTS) {
        const payload = {
          title: pl.name,
          image_url: JSON.stringify({
            url: pl.imageUrl || '',
            description: pl.description || '',
          }),
        };

        const { data: createdPls, error: plErr } = await supabase
          .from('playlists')
          .insert([payload])
          .select();

        if (plErr) throw plErr;
        const createdPl = createdPls[0];

        if (pl.songs && pl.songs.length > 0) {
          const songsToInsert = pl.songs.map((s) => ({
            playlist_id: createdPl.id,
            title: s.title,
            artist: s.artist,
            lyrics: s.lyrics || '',
          }));

          const { error: sErr } = await supabase.from('songs').insert(songsToInsert);
          if (sErr) throw sErr;
        }
      }

      // Re-busca os dados gerados com os UUIDs reais do Supabase
      const { data: newDbPlaylists } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: true });

      const { data: newDbSongs } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: true });

      setPlaylists(mapDbToPlaylists(newDbPlaylists, newDbSongs, playlistDescriptions));
      showToast('Banco Supabase conectado e sincronizado com sucesso!', 'success');
    } catch (err) {
      console.error('[Supabase] Erro ao semear playlists no banco:', err);
      setPlaylists(INITIAL_PLAYLISTS);
    }
  }, [playlistDescriptions, showToast]);

  // Mapa de colaboradores sincronizado na nuvem (Supabase __SYSTEM_COLLABORATORS__ e tabela profiles)
  const [collaboratorsMap, setCollaboratorsMap] = useLocalStorage(
    'spiritfy_cloud_collaborators',
    {
      'loyolafilipe@gmail.com': {
        email: 'loyolafilipe@gmail.com',
        name: 'Filipe Loyola',
        status: 'approved',
        role: 'admin',
        is_approved: true,
        requestedAt: '2026-10-15T00:00:00.000Z',
      },
      'admin@spiritfy.app': {
        email: 'admin@spiritfy.app',
        name: 'Administrador Geral',
        status: 'approved',
        role: 'admin',
        is_approved: true,
        requestedAt: '2026-10-15T00:00:00.000Z',
      },
      'filipe@spiritfy.app': {
        email: 'filipe@spiritfy.app',
        name: 'Filipe',
        status: 'approved',
        role: 'collaborator',
        is_approved: true,
        requestedAt: '2026-10-15T00:00:00.000Z',
      },
    }
  );

  /**
   * Busca colaboradores tanto da tabela 'profiles' quanto do registro de sistema no Supabase
   */
  const fetchCollaborators = useCallback(async () => {
    try {
      let profilesMap = {};

      // 1. Tenta buscar da tabela oficial 'profiles' no Supabase com try/catch isolado
      try {
        const { data: profilesData, error: profErr } = await supabase
          .from('profiles')
          .select('*');

        if (!profErr && Array.isArray(profilesData)) {
          profilesData.forEach((prof) => {
            if (!prof.email) return;
            const normEmail = prof.email.toLowerCase().trim();
            const isAdminUser = checkIsAdmin(normEmail) || prof.role === 'admin';
            const isApproved = isAdminUser || prof.is_approved === true || prof.role === 'collaborator';

            profilesMap[normEmail] = {
              id: prof.id,
              email: normEmail,
              name: normEmail.split('@')[0],
              status: isAdminUser ? 'approved' : isApproved ? 'approved' : 'pending',
              role: prof.role || (isAdminUser ? 'admin' : isApproved ? 'collaborator' : 'user'),
              is_approved: isApproved,
              requestedAt: prof.created_at || new Date().toISOString(),
            };
          });
        }
      } catch (profEx) {
        console.warn('[Supabase] Aviso ao buscar tabela profiles:', profEx);
      }

      // 2. Busca do registro de sistema __SYSTEM_COLLABORATORS__ com try/catch isolado
      let systemMap = {};
      try {
        const { data: sysData, error: sysErr } = await supabase
          .from('playlists')
          .select('*')
          .eq('id', SYSTEM_COLLABORATORS_ID)
          .maybeSingle();

        if (!sysErr && sysData && sysData.image_url) {
          const parsed = JSON.parse(sysData.image_url);
          if (parsed && typeof parsed === 'object') {
            systemMap = parsed;
          }
        }
      } catch (sysEx) {
        console.warn('[Supabase] Aviso ao buscar sistema de colaboradores:', sysEx);
      }

      // 3. Mescla com segurança garantindo o Administrador Principal
      setCollaboratorsMap((prev) => {
        const merged = { ...prev, ...systemMap, ...profilesMap };
        merged['loyolafilipe@gmail.com'] = {
          ...(merged['loyolafilipe@gmail.com'] || {}),
          email: 'loyolafilipe@gmail.com',
          name: 'Filipe Loyola',
          status: 'approved',
          role: 'admin',
          is_approved: true,
        };
        merged['admin@spiritfy.app'] = {
          ...(merged['admin@spiritfy.app'] || {}),
          email: 'admin@spiritfy.app',
          name: 'Administrador Geral',
          status: 'approved',
          role: 'admin',
          is_approved: true,
        };
        return merged;
      });
    } catch (e) {
      console.warn('[Supabase] Falha ao sincronizar colaboradores:', e);
    }
  }, [setCollaboratorsMap]);

  /**
   * Persiste o mapa de colaboradores no registro de sistema do Supabase
   */
  const saveCollaboratorsToCloud = useCallback(async (newMap) => {
    try {
      const payload = {
        title: '__SYSTEM_COLLABORATORS__',
        image_url: JSON.stringify(newMap),
      };
      const { error } = await supabase
        .from('playlists')
        .update(payload)
        .eq('id', SYSTEM_COLLABORATORS_ID);

      if (error) {
        await supabase.from('playlists').upsert([{ id: SYSTEM_COLLABORATORS_ID, ...payload }]);
      }
    } catch (err) {
      console.warn('Falha ao salvar colaboradores no Supabase:', err);
    }
  }, []);

  /**
   * Consulta assíncrona das playlists e músicas diretamente do Supabase.
   * SEMPRE chama setIsLoadingPlaylists(false) no bloco finally.
   */
  const fetchPlaylists = useCallback(
    async (showLoading = false) => {
      if (showLoading) setIsLoadingPlaylists(true);
      try {
        const { data: dbPlaylists, error: plError } = await supabase
          .from('playlists')
          .select('*')
          .order('created_at', { ascending: true });

        if (plError) {
          console.warn('[Supabase] Erro ao carregar playlists:', plError);
          setPlaylists(INITIAL_PLAYLISTS);
          return;
        }

        if (!dbPlaylists || dbPlaylists.length === 0) {
          try {
            await seedInitialPlaylists();
          } catch (seedErr) {
            console.warn('[Supabase] Erro no seed de playlists:', seedErr);
            setPlaylists(INITIAL_PLAYLISTS);
          }
          return;
        }

        // Sincroniza colaboradores caso o registro de sistema esteja na listagem
        const systemCollabRow = dbPlaylists.find(
          (pl) => pl.id === SYSTEM_COLLABORATORS_ID || pl.title === '__SYSTEM_COLLABORATORS__'
        );
        if (systemCollabRow && systemCollabRow.image_url) {
          try {
            const parsed = JSON.parse(systemCollabRow.image_url);
            if (parsed && typeof parsed === 'object') {
              setCollaboratorsMap((prev) => ({
                ...prev,
                ...parsed,
                'loyolafilipe@gmail.com': {
                  ...(parsed['loyolafilipe@gmail.com'] || prev['loyolafilipe@gmail.com'] || {}),
                  email: 'loyolafilipe@gmail.com',
                  name: 'Filipe Loyola',
                  status: 'approved',
                },
              }));
            }
          } catch (e) {
            // ignore
          }
        }

        // Busca todas as músicas da tabela songs com try/catch isolado
        let dbSongs = [];
        try {
          const { data: songsData, error: songsError } = await supabase
            .from('songs')
            .select('*')
            .order('created_at', { ascending: true });

          if (!songsError && Array.isArray(songsData)) {
            dbSongs = songsData;
          }
        } catch (sErr) {
          console.warn('[Supabase] Aviso ao buscar músicas (usando padrões):', sErr);
        }

        setPlaylists(mapDbToPlaylists(dbPlaylists, dbSongs, playlistDescriptions));
      } catch (err) {
        console.warn('[Supabase] Falha ao consultar Supabase:', err);
        setPlaylists(INITIAL_PLAYLISTS);
      } finally {
        // GARANTE 100% QUE O CARREGAMENTO É DESATIVADO
        setIsLoadingPlaylists(false);
      }
    },
    [playlistDescriptions, seedInitialPlaylists, setCollaboratorsMap]
  );

  /**
   * `registeredUsers`: Usuários cadastrados (mantido para sessão e alternância de perfil)
   */
  const [registeredUsers, setRegisteredUsers] = useLocalStorage(
    'spiritfy_registered_users',
    PRESET_USERS
  );

  // Currently logged-in user object (null = logged out / not authenticated / visitante)
  const [currentUser, setCurrentUser] = useLocalStorage('spiritfy_current_user', null);

  // Controle de visibilidade do modal de autenticação (não bloqueia visitantes)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  /**
   * Mapeia um usuário do Supabase Auth e perfil da tabela profiles para a interface
   */
  const mapSupabaseUser = useCallback(
    (sbUser, profileData = null) => {
      if (!sbUser) return null;
      const email = (sbUser.email || '').toLowerCase().trim();
      const meta = sbUser.user_metadata || {};
      const collabEntry = collaboratorsMap[email];

      const admin =
        checkIsAdmin(email) ||
        meta.role === 'admin' ||
        profileData?.role === 'admin';

      const isApprovedStatus =
        admin ||
        email === 'filipe@spiritfy.app' ||
        meta.is_approved === true ||
        profileData?.is_approved === true ||
        collabEntry?.status === 'approved';

      const isRejectedStatus = !admin && !isApprovedStatus && collabEntry?.status === 'rejected';

      const roleName = admin
        ? 'Administrador'
        : isApprovedStatus
        ? 'Colaborador Aprovado'
        : isRejectedStatus
        ? 'Cadastro Recusado'
        : 'Aguardando Aprovação';

      return {
        id: sbUser.id,
        email: sbUser.email,
        name: meta.name || profileData?.name || collabEntry?.name || sbUser.email?.split('@')[0] || 'Usuário',
        avatar: meta.avatar || (admin ? '👑' : isApprovedStatus ? '🎸' : '👤'),
        role: roleName,
        isAdmin: admin,
        isApproved: isApprovedStatus,
        collaboratorStatus: admin ? 'approved' : isApprovedStatus ? 'approved' : isRejectedStatus ? 'rejected' : 'pending',
        confirmed: !!sbUser.email_confirmed_at || !!sbUser.confirmed_at,
        rawUser: sbUser,
        profile: profileData,
      };
    },
    [collaboratorsMap]
  );

  /**
   * Verifica a sessão do usuário com try/catch robusto.
   * Se houver qualquer erro, mantém o usuário como visitante sem quebrar a tela.
   */
  const checkUserSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('[Supabase] Erro de autenticação (modo visitante mantido):', error);
        setCurrentUser(null);
        return;
      }

      const sbUser = data?.session?.user;
      if (!sbUser) {
        setCurrentUser(null);
        return;
      }

      // Tenta buscar da tabela profiles com try/catch isolado
      let userProfile = null;
      try {
        const { data: prof, error: pErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sbUser.id)
          .maybeSingle();

        if (!pErr && prof) {
          userProfile = prof;
        } else if (sbUser.email) {
          const { data: profByEmail } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', sbUser.email.toLowerCase().trim())
            .maybeSingle();
          if (profByEmail) userProfile = profByEmail;
        }
      } catch (profErr) {
        console.warn('[Supabase] Aviso ao buscar perfil do usuário (usando metadados):', profErr);
      }

      setCurrentUser(mapSupabaseUser(sbUser, userProfile));
    } catch (err) {
      console.warn('[Supabase] Erro na verificação de sessão (modo visitante ativado):', err);
      setCurrentUser(null);
    }
  }, [mapSupabaseUser, setCurrentUser]);

  // Carregamento inicial mestre com watchdog de segurança e try/catch global
  useEffect(() => {
    let isMounted = true;

    // Watchdog de segurança: NUNCA deixa o site preso em "Carregando repertório..."
    // Em caso de lentidão ou timeout de rede, força a liberação em 2.5 segundos
    const watchdogTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoadingPlaylists(false);
      }
    }, 2500);

    const initMaster = async () => {
      try {
        await Promise.allSettled([
          fetchPlaylists(true),
          fetchCollaborators(),
          checkUserSession(),
        ]);
      } catch (e) {
        console.warn('[Spiritfy] Aviso na inicialização geral:', e);
      } finally {
        if (isMounted) {
          setIsLoadingPlaylists(false);
        }
      }
    };

    initMaster();

    // Sincronização em tempo real (Supabase Realtime)
    const channel = supabase
      .channel('spiritfy_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'playlists' },
        (payload) => {
          if (payload?.new?.id === SYSTEM_COLLABORATORS_ID) {
            fetchCollaborators();
          } else {
            fetchPlaylists(false);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'songs' },
        () => {
          fetchPlaylists(false);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchCollaborators();
        }
      )
      .subscribe();

    // Fallback de polling a cada 15 segundos entre abas/dispositivos
    const interval = setInterval(() => {
      fetchPlaylists(false);
      fetchCollaborators();
    }, 15000);

    // Escuta mudanças de auth em tempo real
    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(mapSupabaseUser(session.user));
      } else {
        setCurrentUser((prev) => (prev?.rawUser ? null : prev));
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(watchdogTimer);
      clearInterval(interval);
      supabase.removeChannel(channel);
      authSub?.unsubscribe();
    };
  }, [fetchPlaylists, fetchCollaborators, checkUserSession, mapSupabaseUser, setCurrentUser]);

  // Atualiza currentUser se o mapa de colaboradores mudar na nuvem
  useEffect(() => {
    if (currentUser?.email) {
      const email = currentUser.email.toLowerCase().trim();
      const admin = checkIsAdmin(email) || currentUser.isAdmin;
      const collabEntry = collaboratorsMap[email];
      const isApprovedStatus = collabEntry?.status === 'approved' || collabEntry?.is_approved === true;
      const isRejectedStatus = collabEntry?.status === 'rejected';

      const approved =
        admin ||
        email === 'filipe@spiritfy.app' ||
        isApprovedStatus;

      const newRole = admin
        ? 'Administrador'
        : approved
        ? 'Colaborador Aprovado'
        : isRejectedStatus
        ? 'Cadastro Recusado'
        : 'Aguardando Aprovação';

      if (currentUser.role !== newRole || currentUser.isApproved !== approved) {
        setCurrentUser((prev) =>
          prev
            ? {
                ...prev,
                role: newRole,
                isApproved: approved,
                isAdmin: admin,
                collaboratorStatus: admin ? 'approved' : isApproved ? 'approved' : isRejectedStatus ? 'rejected' : 'pending',
              }
            : null
        );
      }
    }
  }, [collaboratorsMap, currentUser?.email, currentUser?.isAdmin, currentUser?.isApproved, currentUser?.role, setCurrentUser]);

  // Funções de Gestão de Colaboradores (Exclusivo Administrador)
  const approveCollaborator = useCallback(
    async (email) => {
      if (!email) return;
      const normalized = email.trim().toLowerCase();
      const existing = collaboratorsMap[normalized] || {};
      const updatedEntry = {
        ...existing,
        email: normalized,
        name: existing.name || normalized.split('@')[0],
        status: 'approved',
        role: 'collaborator',
        is_approved: true,
        approvedAt: new Date().toISOString(),
      };
      const updatedMap = {
        ...collaboratorsMap,
        [normalized]: updatedEntry,
      };

      setCollaboratorsMap(updatedMap);

      // Salva no registro de sistema na nuvem
      await saveCollaboratorsToCloud(updatedMap);

      // Também tenta atualizar na tabela profiles
      try {
        await supabase
          .from('profiles')
          .update({ is_approved: true, role: 'collaborator' })
          .eq('email', normalized);
      } catch (profErr) {
        console.warn('Aviso ao atualizar profiles:', profErr);
      }

      showToast(`Colaborador "${normalized}" aprovado com sucesso!`, 'success');
    },
    [collaboratorsMap, saveCollaboratorsToCloud, setCollaboratorsMap, showToast]
  );

  const rejectCollaborator = useCallback(
    async (email) => {
      if (!email) return;
      const normalized = email.trim().toLowerCase();
      if (checkIsAdmin(normalized)) {
        showToast('Não é possível rejeitar o Administrador Principal.', 'warning');
        return;
      }
      const existing = collaboratorsMap[normalized] || {};
      const updatedEntry = {
        ...existing,
        email: normalized,
        name: existing.name || normalized.split('@')[0],
        status: 'rejected',
        role: 'user',
        is_approved: false,
        rejectedAt: new Date().toISOString(),
      };
      const updatedMap = {
        ...collaboratorsMap,
        [normalized]: updatedEntry,
      };

      setCollaboratorsMap(updatedMap);

      // Salva no registro de sistema na nuvem
      await saveCollaboratorsToCloud(updatedMap);

      // Também tenta atualizar na tabela profiles
      try {
        await supabase
          .from('profiles')
          .update({ is_approved: false, role: 'user' })
          .eq('email', normalized);
      } catch (profErr) {
        console.warn('Aviso ao atualizar profiles:', profErr);
      }

      showToast(`Solicitação de "${normalized}" recusada.`, 'info');
    },
    [collaboratorsMap, saveCollaboratorsToCloud, setCollaboratorsMap, showToast]
  );

  const revokeCollaborator = useCallback(
    async (email) => {
      await rejectCollaborator(email);
    },
    [rejectCollaborator]
  );

  // Computa permissões ativas
  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    const email = (currentUser.email || '').toLowerCase().trim();
    return checkIsAdmin(email) || currentUser.role === 'Administrador' || currentUser.isAdmin === true;
  }, [currentUser]);

  const isApprovedCollaborator = useMemo(() => {
    if (!currentUser) return false;
    if (isAdmin) return true;
    const email = (currentUser.email || '').toLowerCase().trim();
    if (email === 'filipe@spiritfy.app') return true;
    const collab = collaboratorsMap[email];
    if (collab && collab.status === 'approved') return true;
    return currentUser.isApproved === true;
  }, [currentUser, isAdmin, collaboratorsMap]);

  // Usuários não logados (visitantes) NUNCA têm permissão de edição
  const canEdit = Boolean(currentUser && (isAdmin || isApprovedCollaborator));

  // Listagens de colaboradores por status
  const pendingCollaborators = useMemo(() => {
    return Object.values(collaboratorsMap).filter((c) => c.status === 'pending');
  }, [collaboratorsMap]);

  const approvedCollaboratorsList = useMemo(() => {
    return Object.values(collaboratorsMap).filter((c) => c.status === 'approved');
  }, [collaboratorsMap]);

  const rejectedCollaborators = useMemo(() => {
    return Object.values(collaboratorsMap).filter((c) => c.status === 'rejected');
  }, [collaboratorsMap]);

  const approvedCollaborators = useMemo(() => {
    return approvedCollaboratorsList.map((c) => c.email);
  }, [approvedCollaboratorsList]);

  // Supabase Auth Methods
  const supabaseSignIn = useCallback(
    async ({ email, password }) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          const isUnconfirmed =
            error.message?.toLowerCase().includes('email not confirmed') ||
            error.code === 'email_not_confirmed';
          return {
            success: false,
            error: isUnconfirmed
              ? 'E-mail ainda não confirmado! O Supabase enviou um link de ativação para sua caixa de entrada. Por favor, confirme seu e-mail para acessar.'
              : error.message || 'Erro ao fazer login no Supabase.',
            isUnconfirmed,
          };
        }

        const user = mapSupabaseUser(data.user);
        setCurrentUser(user);
        setIsAuthModalOpen(false);
        showToast(`Bem-vindo(a), ${user.name}! 🎸`, 'success');
        return { success: true, user };
      } catch (err) {
        return { success: false, error: err.message || 'Erro de conexão com o Supabase.' };
      }
    },
    [mapSupabaseUser, setCurrentUser, showToast]
  );

  const supabaseSignUp = useCallback(
    async ({ name, email, password }) => {
      try {
        const trimmedEmail = email.trim().toLowerCase();
        const isAdminUser = checkIsAdmin(trimmedEmail);

        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              name: name.trim(),
              role: isAdminUser ? 'admin' : 'collaborator',
              is_approved: isAdminUser,
            },
          },
        });

        if (error) {
          return { success: false, error: error.message || 'Erro ao criar conta no Supabase.' };
        }

        // Registra a solicitação de colaborador na nuvem com status pending (ou approved para admin)
        const newEntry = {
          email: trimmedEmail,
          name: name.trim() || trimmedEmail.split('@')[0],
          status: isAdminUser ? 'approved' : 'pending',
          requestedAt: new Date().toISOString(),
        };
        const updatedMap = {
          ...collaboratorsMap,
          [trimmedEmail]: newEntry,
        };
        setCollaboratorsMap(updatedMap);
        await saveCollaboratorsToCloud(updatedMap);

        showToast(
          'Conta cadastrada! Verifique seu e-mail para confirmação. Um administrador liberará seu acesso para edição.',
          'info'
        );

        return {
          success: true,
          user: data.user,
          email: trimmedEmail,
          name: name.trim(),
        };
      } catch (err) {
        return { success: false, error: err.message || 'Erro inesperado ao registrar.' };
      }
    },
    [collaboratorsMap, saveCollaboratorsToCloud, setCollaboratorsMap, showToast]
  );

  const supabaseSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Erro ao encerrar sessão Supabase:', e);
    }
    const name = currentUser?.name || 'Visitante';
    setCurrentUser(null);
    showToast(`Até logo, ${name}! Sessão encerrada.`, 'info');
  }, [currentUser?.name, setCurrentUser, showToast]);

  // Request interaction history (for Profile page & live feed)
  const [userRequests, setUserRequests] = useLocalStorage('spiritfy_user_requests', []);

  /**
   * Computed "Mix Geral" playlist:
   * Aggregates all songs across all stored playlists,
   * dedupes if necessary, and sorts by highest requests count.
   */
  const mixGeralPlaylist = useMemo(() => {
    const songMap = new Map();

    playlists.forEach((pl) => {
      pl.songs.forEach((song) => {
        if (!songMap.has(song.id)) {
          songMap.set(song.id, {
            ...song,
            sourcePlaylistId: pl.id,
            sourcePlaylistName: pl.name,
          });
        } else {
          // If already exists, take max requests
          const existing = songMap.get(song.id);
          if (song.requests > existing.requests) {
            songMap.set(song.id, { ...song, sourcePlaylistId: pl.id, sourcePlaylistName: pl.name });
          }
        }
      });
    });

    const allAggregatedSongs = Array.from(songMap.values()).sort(
      (a, b) => (b.requests || 0) - (a.requests || 0)
    );

    return {
      id: 'mix-geral',
      name: 'Mix Geral (Mais Pedidas)',
      description: 'Compilado dinâmico com todas as músicas do repertório, ordenadas pelas mais pedidas da noite pelo público!',
      imageUrl: '/logo.jpeg',
      gradient: 'from-emerald-500 via-green-600 to-teal-800',
      isMixGeral: true,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      songs: allAggregatedSongs,
    };
  }, [playlists]);

  /**
   * Register a brand-new user account.
   * Returns { success: boolean, token?: string, error?: string }
   *
   * @param {{ name: string, email: string, password: string }} data
   */
  const registerUser = ({ name, email, password }) => {
    const trimmedEmail = email.trim().toLowerCase();

    // Check for duplicate email (case-insensitive)
    const exists = registeredUsers.some(
      (u) => u.email && u.email.toLowerCase() === trimmedEmail
    );
    if (exists) {
      return { success: false, error: 'Este e-mail já está cadastrado. Faça login.' };
    }

    const token = generateToken();
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      // Simple obfuscation for demo — NOT a real security measure
      passwordHash: btoa(password),
      avatar: randomAvatar(),
      role: 'Fã da Plateia',
      bio: 'Novo usuário do Spiritfy.',
      confirmed: false,   // must confirm e-mail first
      token,              // simulated e-mail verification token
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    return { success: true, token, userId: newUser.id, email: trimmedEmail, name: name.trim() };
  };

  /**
   * Confirm a user's e-mail with the provided token (simulated).
   * Activates the account and logs the user in automatically.
   *
   * @param {string} userId
   * @param {string} token
   */
  const confirmEmail = (userId, token) => {
    let confirmed = null;

    setRegisteredUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId && u.token === token) {
          confirmed = { ...u, confirmed: true };
          return confirmed;
        }
        return u;
      })
    );

    if (confirmed) {
      setCurrentUser(confirmed);
      showToast(`Bem-vindo(a), ${confirmed.name}! Conta ativada com sucesso 🎉`, 'success');
      return true;
    }

    showToast('Token de confirmação inválido. Tente novamente.', 'warning');
    return false;
  };

  /**
   * Login with email + password.
   * Returns { success: boolean, error?: string }
   *
   * @param {{ email: string, password: string }} credentials
   */
  const loginUser = ({ email, password }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = registeredUsers.find(
      (u) => u.email && u.email.toLowerCase() === trimmedEmail
    );

    if (!user) {
      return { success: false, error: 'E-mail não encontrado. Crie uma conta primeiro.' };
    }

    // Compare obfuscated password (demo only)
    if (user.passwordHash !== btoa(password)) {
      return { success: false, error: 'Senha incorreta. Tente novamente.' };
    }

    if (!user.confirmed) {
      return {
        success: false,
        error: 'Conta ainda não confirmada. Verifique seu e-mail.',
        needsConfirmation: true,
        userId: user.id,
        token: user.token,
        email: user.email,
        name: user.name,
      };
    }

    setCurrentUser(user);
    showToast(`Bem-vindo(a) de volta, ${user.name}! 🎸`, 'success');
    return { success: true };
  };

  /**
   * Log out the currently authenticated user.
   */
  const logout = () => {
    supabaseSignOut();
  };

  /**
   * Switch active user profile (legacy — kept for compatibility with seed users).
   * @param {string | null} userId
   */
  const switchUser = (userId) => {
    if (!userId) {
      logout();
      return;
    }
    const found = registeredUsers.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showToast(`Perfil alterado para ${found.name}!`, 'success');
    }
  };

  /**
   * Request a song live on stage (increments requests count & saves to history)
   * @param {string} songId
   * @param {string} [songTitle]
   */
  const requestSong = (songId, songTitle) => {
    const targetSong = playlists.flatMap((pl) => pl.songs).find((s) => s.id === songId) || null;

    setRequestCounts((prev) => ({ ...prev, [songId]: (prev[songId] || 0) + 1 }));

    const displayName = songTitle || targetSong?.title || 'a música';
    const artistName = targetSong?.artist || 'Banda ao Vivo';

    // Record user history
    setUserRequests((prev) => [
      {
        id: `req-${Date.now()}`,
        songId,
        songTitle: displayName,
        artist: artistName,
        userName: currentUser ? currentUser.name : 'Público / Anônimo',
        timestamp: new Date().toISOString(),
      },
      ...prev.slice(0, 49), // retain last 50
    ]);

    showToast(`Pedido enviado ao vivo: "${displayName}"! Os músicos foram notificados 🎸`, 'success');
  };

  /**
   * Create a new custom playlist directly in Supabase
   * @param {{ name: string, description: string, imageUrl?: string, gradient?: string }} data
   */
  const addPlaylist = async ({ name, description, imageUrl, gradient }) => {
    if (!canEdit) {
      showToast('Acesso restrito: faça login como colaborador para criar playlists.', 'warning');
      return null;
    }

    try {
      const trimmedName = name.trim();
      const trimmedUrl = (imageUrl || '').trim();
      const trimmedDesc = (description || '').trim();

      const encodedImageUrl = JSON.stringify({
        url: trimmedUrl,
        description: trimmedDesc,
      });

      const { data, error } = await supabase
        .from('playlists')
        .insert([
          {
            title: trimmedName,
            image_url: encodedImageUrl,
          },
        ])
        .select();

      if (error) throw error;
      const created = data[0];

      const newPlaylist = {
        id: created.id,
        name: created.title,
        title: created.title,
        description: trimmedDesc || 'Playlist personalizada no Supabase.',
        imageUrl: trimmedUrl,
        image_url: trimmedUrl,
        gradient: gradient || 'from-neutral-800 via-neutral-900 to-black',
        createdBy: currentUser ? currentUser.id : 'user-guest',
        createdAt: created.created_at,
        songs: [],
      };

      setPlaylists((prev) => [newPlaylist, ...prev]);
      fetchPlaylists(false);

      showToast(`Playlist "${trimmedName}" criada e salva no Supabase!`, 'success');
      return newPlaylist;
    } catch (err) {
      console.error('[Supabase] Erro ao criar playlist:', err);
      showToast('Erro ao salvar playlist no Supabase.', 'warning');
      return null;
    }
  };

  /**
   * Update an existing playlist's details (name, imageUrl, description, gradient) directly in Supabase
   * @param {string} playlistId
   * @param {{ name?: string, title?: string, imageUrl?: string, image_url?: string, description?: string, gradient?: string }} updatedData
   */
  const updatePlaylist = async (playlistId, updatedData) => {
    if (!canEdit) {
      showToast('Acesso restrito: faça login como colaborador para editar playlists.', 'warning');
      return false;
    }

    if (playlistId === 'mix-geral') {
      showToast('O Mix Geral é dinâmico e não pode ser editado diretamente.', 'warning');
      return false;
    }

    try {
      const currentPl = playlists.find((p) => p.id === playlistId);
      const title = (updatedData.name ?? updatedData.title ?? currentPl?.name ?? '').trim();
      const imageUrl = (updatedData.imageUrl ?? updatedData.image_url ?? currentPl?.imageUrl ?? '').trim();
      const description = (updatedData.description ?? currentPl?.description ?? '').trim();

      // Armazena url e description compactadas em image_url no Supabase,
      // garantindo sincronização imediata em todos os navegadores
      const encodedImageUrl = JSON.stringify({
        url: imageUrl,
        description: description,
      });

      const payload = {
        title,
        image_url: encodedImageUrl,
      };

      const { error } = await supabase
        .from('playlists')
        .update(payload)
        .eq('id', playlistId);

      if (error) throw error;

      setPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id === playlistId) {
            return {
              ...pl,
              name: title,
              title: title,
              description: description,
              imageUrl: imageUrl,
              image_url: imageUrl,
              gradient: updatedData.gradient || pl.gradient,
            };
          }
          return pl;
        })
      );

      // Re-busca silenciosa para garantir atualização no banco
      fetchPlaylists(false);

      showToast('Playlist atualizada e sincronizada com sucesso!', 'success');
      return true;
    } catch (err) {
      console.error('[Supabase] Erro ao atualizar playlist:', err);
      showToast('Erro ao salvar alterações no Supabase.', 'warning');
      return false;
    }
  };

  /**
   * Delete an existing playlist from Supabase (restrito ao Admin/colaborador autorizado)
   * @param {string} playlistId
   */
  const deletePlaylist = async (playlistId) => {
    if (!canEdit) {
      showToast('Acesso restrito: apenas colaboradores autorizados podem excluir playlists.', 'warning');
      return false;
    }

    if (playlistId === 'mix-geral') {
      showToast('O Mix Geral não pode ser excluído.', 'warning');
      return false;
    }

    try {
      const { error } = await supabase.from('playlists').delete().eq('id', playlistId);
      if (error) throw error;

      setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
      fetchPlaylists(false);
      showToast('Playlist removida com sucesso!', 'info');
      return true;
    } catch (err) {
      console.error('[Supabase] Erro ao excluir playlist:', err);
      showToast('Erro ao excluir playlist no Supabase.', 'warning');
      return false;
    }
  };

  /**
   * Add a new song to an existing playlist in Supabase
   * @param {string} playlistId
   * @param {{ title: string, artist: string, duration?: string, lyrics?: string }} songData
   */
  const addSongToPlaylist = async (playlistId, { title, artist, duration, lyrics }) => {
    if (!canEdit) {
      showToast('Acesso restrito: faça login como colaborador para adicionar músicas.', 'warning');
      return null;
    }

    if (playlistId === 'mix-geral') {
      showToast('O Mix Geral é automático. Adicione a uma playlist específica.', 'warning');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('songs')
        .insert([
          {
            playlist_id: playlistId,
            title: title.trim(),
            artist: artist.trim(),
            lyrics: lyrics ? lyrics.trim() : '',
          },
        ])
        .select();

      if (error) throw error;
      const created = data[0];

      const newSong = {
        id: created.id,
        playlist_id: playlistId,
        title: created.title,
        artist: created.artist,
        lyrics: created.lyrics || '',
        duration: duration || '3:30',
        requests: 0,
        addedAt: created.created_at,
      };

      setPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id === playlistId) {
            return {
              ...pl,
              songs: [...pl.songs, newSong],
            };
          }
          return pl;
        })
      );
      fetchPlaylists(false);

      showToast(`Música "${title}" adicionada com sucesso no Supabase!`, 'success');
      return newSong;
    } catch (err) {
      console.error('[Supabase] Erro ao adicionar música:', err);
      showToast('Erro ao adicionar música no Supabase.', 'warning');
      return null;
    }
  };

  /**
   * Delete a song from an existing playlist in Supabase
   * @param {string} playlistId
   * @param {string} songId
   */
  const deleteSong = async (playlistId, songId) => {
    if (!canEdit) {
      showToast('Acesso restrito: apenas colaboradores autorizados podem excluir músicas.', 'warning');
      return false;
    }

    try {
      const { error } = await supabase.from('songs').delete().eq('id', songId);
      if (error) throw error;

      setPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id === playlistId) {
            return {
              ...pl,
              songs: (pl.songs || []).filter((s) => s.id !== songId),
            };
          }
          return pl;
        })
      );
      fetchPlaylists(false);

      showToast('Música removida do repertório!', 'info');
      return true;
    } catch (err) {
      console.error('[Supabase] Erro ao excluir música:', err);
      showToast('Erro ao excluir música no Supabase.', 'warning');
      return false;
    }
  };

  /**
   * Helper to retrieve a playlist by ID (supports 'mix-geral')
   */
  const getPlaylistById = (id) => {
    if (id === 'mix-geral') {
      return mixGeralPlaylist;
    }
    return playlists.find((p) => p.id === id) || null;
  };

  /**
   * Helper to find a song by ID across all playlists (or mix geral)
   */
  const getSongById = (playlistId, songId) => {
    const pl = getPlaylistById(playlistId);
    if (pl) {
      const found = pl.songs.find((s) => s.id === songId);
      if (found) return { song: found, playlist: pl };
    }

    // Fallback: search in any playlist
    for (const p of playlists) {
      const found = p.songs.find((s) => s.id === songId);
      if (found) return { song: found, playlist: p };
    }

    return null;
  };

  /**
   * Reset local/cloud demo data
   */
  const resetToDefaults = async () => {
    try {
      showToast('Restaurando dados no Supabase...', 'info');
      await supabase.from('songs').delete().neq('title', '___none___');
      await supabase.from('playlists').delete().neq('title', '___none___');
      await seedInitialPlaylists();
      setRequestCounts({});
      setCurrentUser(null);
    } catch (err) {
      console.warn('Erro ao restaurar:', err);
      setPlaylists(INITIAL_PLAYLISTS);
      setCurrentUser(null);
      showToast('Dados restaurados!', 'info');
    }
  };

  return (
    <AppContext.Provider
      value={{
        playlists,
        isLoadingPlaylists,
        setIsLoadingPlaylists,
        fetchPlaylists,
        users: registeredUsers,
        registeredUsers,
        currentUser,
        isAdmin,
        isApprovedCollaborator,
        canEdit,
        collaboratorsMap,
        pendingCollaborators,
        approvedCollaboratorsList,
        rejectedCollaborators,
        approvedCollaborators,
        approveCollaborator,
        rejectCollaborator,
        revokeCollaborator,
        fetchCollaborators,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        supabaseSignIn,
        supabaseSignUp,
        supabaseSignOut,
        userRequests,
        mixGeralPlaylist,
        toast,
        setToast,
        showToast,
        switchUser,
        registerUser,
        loginUser,
        logout,
        confirmEmail,
        requestSong,
        addPlaylist,
        updatePlaylist,
        deletePlaylist,
        addSongToPlaylist,
        deleteSong,
        getPlaylistById,
        getSongById,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/**
 * Custom hook to consume the AppContext
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
