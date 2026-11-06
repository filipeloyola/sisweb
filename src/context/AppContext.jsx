import React, { createContext, useContext, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { supabase } from '../supabaseClient';

// Create App Context
const AppContext = createContext(null);

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
        lyrics: `Aleluia, (aleluia) 4X

A alegria está no coração
De quem já conhece a Jesus
A verdadeira paz só tem aquele
Que já conhece a Jesus

O sentimento mais precioso
Que vem do nosso Senhor
É o amor que só tem quem
Já conhece a Jesus
(2x)

Posso pisar numa tropa
E saltar as muralhas

Aleluia! Aleluia!
Posso pisar numa tropa
E saltar as muralhas
Aleluia! Aleluia!

E Ele é a rocha da minha salvação
Com Ele não há mais condenação
Posso pisar numa tropa
E saltar as muralhas
Aleluia!

Aleluia! Aleluia!...

O sentimento mais precioso…`,
      },
      {
        id: 'bj-02',
        title: 'João',
        artist: 'Oficina G3',
        duration: '4:10',
        requests: 8,
        addedAt: '2026-10-15T18:10:00.000Z',
        lyrics: `Em direção ao rio
Cumprindo sua missão
Da Galileia veio em minha direção

Como posso eu, um mero pecador
Batizar nas águas o meu Senhor?

Eu não sou merecedor de com minhas mãos te mergulhar
Se digno eu não sou de suas sandálias desatar

Deixa assim acontecer
Mesmo sem você entender

São os planos do meu Pai
Pra justiça se cumprir
O começo é aqui
O Pai quem me enviou

O céu se abriu
E a terra se curvou
Das águas levantou
O filho de Deus
O céu se abriu
O Espírito desceu
O filho revelou
E o Pai falou

Com os meus olhos vi
Sair do rio Jordão
O rio de água viva, a salvação
Como posso eu, um mero pecador
Batizar nas águas o meu Senhor?

Eu não sou merecedor…

Este é o meu filho amado
Que traz o sorriso aos meus lábios

Hosana, Hosana, Hosana ao nosso rei`,
      },
      {
        id: 'bj-03',
        title: 'Felicidade',
        artist: 'Marcelo Jeneci',
        duration: '4:05',
        requests: 15,
        addedAt: '2026-10-15T18:15:00.000Z',
        lyrics: `Haverá um dia em que você não haverá de ser feliz
Sem tirar o ar, sem se mexer, sem desejar como antes sempre quis
Você vai rir, sem perceber, felicidade é só questão de ser
Quando chover, deixar molhar pra receber o sol quando voltar
Lembrará os dias que você deixou passar sem ver a luz
Se chorar, chorar é vão porque os dias vão pra nunca mais

Melhor viver, meu bem, pois há um lugar em que o sol brilha pra você
Chorar, sorrir também e depois dançar, na chuva quando a chuva vem
Melhor viver, meu bem, pois há um lugar em que o sol brilha pra você
Chorar, sorrir também e dançar
Dançar na chuva quando a chuva vem

Tem vez que as coisas pesam mais do que a gente acha que pode aguentar
Nessa hora fique firme, pois tudo isso logo vai passar
Você vai rir, sem perceber, felicidade é só questão de ser
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
        lyrics: `Tu anseias, eu bem sei, por salvação
Tens desejo de banir a escuridão
Abre, pois, de par em par teu coração
E deixa a luz do céu entrar

Deixa a luz do céu entrar
Deixa a luz do céu entrar
Abre bem as portas do teu coração
E deixa a luz do céu entrar

Cristo, a luz do céu em ti, quer habitar
Para as trevas dos seus erros dissipar
Teu caminho e coração iluminar
E deixa a luz do céu entrar

Que alegria andar ao brilho dessa luz
Vida eterna e paz no coração produz
Oh! Aceita essa aliança com Jesus
E deixa a luz do céu entrar`,
      },
      {
        id: 'bj-05',
        title: 'Oração de São Francisco',
        artist: 'Bianca e Jorge',
        duration: '3:30',
        requests: 18,
        addedAt: '2026-10-15T18:25:00.000Z',
        lyrics: `Senhor, fazei-me instrumento de vossa paz
Onde houver ódio, que eu leve o amor
Onde houver ofensa, que eu leve o perdão
Onde houver discórdia, que eu leve a união
Onde houver dúvida, que eu leve a fé

Onde houver erro, que eu leve a verdade
Onde houver desespero, que eu leve a esperança
Onde houver tristeza, que eu leve a alegria
Onde houver trevas, que eu leve a luz

Ó mestre, fazei com que eu procure mais
Consolar, que ser consolado
Compreender, que ser compreendido
Amar, que ser amado
Pois é dando que se recebe
É perdoando que se é perdoado
E é morrendo que se vive,
Para a vida eterna`,
      },
      {
        id: 'bj-06',
        title: 'Girassol',
        artist: 'Kell Smith',
        duration: '3:52',
        requests: 22,
        addedAt: '2026-10-15T18:30:00.000Z',
        lyrics: `Eu sei que cada um só tem a vista da montanha que escalar
Por isso todo dia eu me preocupo em fazer a coisa certa
E mesmo assim, infelizmente, às vezes, não parece adiantar
Porque o mundo tá tão louco e as pessoas andam tão estranhas

Me diz se ainda passa o medo de não ser o melhor de mim
E se a gente se cobra menos em algum momento disso aqui
Me diz

Quando já não sei qual é a direção
E tudo que posso é seguir meu coração
Então me viro
E giro para onde gira o sol

Quando já não sei qual é a direção
E tudo que posso é seguir meu coração
É por instinto
Que eu encontro a luz, sou girassol

Eu quero aquela vida que a gente inventa antes de dormir
Mas pra dar certo sei que tenho que acordar tomando atitude
O tempo não me espera só porque quero jogar tudo pro ar
E quase sempre é em desistência que o fracasso se resume

É por instinto
Que eu encontro a luz
Sou girassol`,
      },
      {
        id: 'bj-07',
        title: 'Uni-vos',
        artist: 'Bianca e Jorge',
        duration: '3:15',
        requests: 9,
        addedAt: '2026-10-15T18:35:00.000Z',
        lyrics: `De que importa sua bandeira?
Suas cores não me dizem nada

Todas iguais, se segregando entre si

Se sabe tanto, então faz!

Amai-vos como um só,
cantemos como um só

Se reconhece por suas obras
e pelo esforço em superar
De que suas mãos estão marcadas?
O que significa amar?

Amai-vos como um só,
cantemos como um só

Uni-vos em torno do mesmo ideal
Derrube as barreiras do material
Amai-vos como um só,
cantemos como um só

Laraê, laraê, laraêlaiá,
laraêlaiá (2x)

O corpo é só ferramenta
Pro espírito se reformar
Se curte Rock, Funk ou Pop, no fundo é tudo igual
Daqui o que vamos levar?

Amai-vos como um só,
cantemos como um só`,
      },
      {
        id: 'bj-08',
        title: 'Trem-Bala',
        artist: 'Ana Vilela',
        duration: '4:18',
        requests: 27,
        addedAt: '2026-10-15T18:40:00.000Z',
        lyrics: `Não é sobre ter
Todas as pessoas do mundo pra si
É sobre saber
Que em algum lugar, alguém zela por ti

É sobre cantar e poder escutar
Mais do que a própria voz
É sobre dançar
Na chuva de vida que cai sobre nós

É saber se sentir infinito
Num universo tão vasto e bonito
É saber sonhar
Então fazer valer a pena
Cada verso daquele poema
Sobre acreditar

Não é sobre chegar
No topo do mundo e saber que venceu
É sobre escalar
E sentir que o caminho te fortaleceu

É sobre ser abrigo
E também ter morada em outros corações
E assim ter amigos
Contigo em todas as situações

A gente não pode ter tudo
Qual seria a graça do mundo
Se fosse assim?
Por isso eu prefiro sorrisos
E os presentes que a vida trouxe
Pra perto de mim

Segura teu filho no colo
Sorria e abraça os teus pais
Enquanto estão aqui

Que a vida é trem bala, parceiro
E a gente é só passageiro
Prestes a partir`,
      },
      {
        id: 'bj-09',
        title: 'Uma Prece (Totem)',
        artist: 'Cacau',
        duration: '3:40',
        requests: 11,
        addedAt: '2026-10-15T18:45:00.000Z',
        lyrics: `Ó poderosa águia que há no alto do totem
Dá-me tuas asas, me ensina a voar
Cruzar os horizontes, vencer montes e mares
Com a luz do saber, pela virtude de amar

Com tua força tamanha, ó urso, me ajude a derrubar
As barreiras da vida que eu venha a encontrar

E eu venho pedir a ti, ó tartaruga, que o totem estás a sustentar
Dá-me tua certeza de um dia eu poder chegar
A ver-te nas asas da águia, na força do urso
Em todas as coisas criadas por ti
Eleva minh'alma, me faz tão perfeito
Me leva a saber que estás dentro de mim

Ó Pai Nosso que estás no céu
Santificado seja o teu nome
Em favor de todos nós`,
      },
      {
        id: 'bj-10',
        title: 'Aos Pés do Monte',
        artist: 'Tim e Vanessa',
        duration: '4:00',
        requests: 14,
        addedAt: '2026-10-15T18:50:00.000Z',
        lyrics: `Um sentimento me ronda
Não sei dizer, tudo é novo pra mim
Meu coração se renova
Sinto a esperança invadir o meu ser

Quero ser manso, ser limpo, ser justo
E pobre de espírito ser
Tua palavra me sonda
Me conta do Reino que espera por mim
Eu te ofereço meu pranto
As dores da alma que quer renascer

Eu ouvi tua voz
Teu falar me encantou
Quis seguir, caminhar
Quis saber pra onde vou

Eis-me aqui
Minha dor serenou`,
      },
      {
        id: 'bj-11',
        title: 'Vento e Luz',
        artist: 'Bianca e Jorge',
        duration: '3:10',
        requests: 7,
        addedAt: '2026-10-15T18:55:00.000Z',
        lyrics: `Ouça o vento na folhagem
Veja a luz do sol e a lua
Pra viver em paz na terra
Temos que tentar sorrir

E não ligar mais pra tristeza
No caminho sempre há pedras
Não sentir mais o abandono
Reunir e cantar pra Jesus

O sol conduz a paz
E a ser feliz sem ter porque
Pedir mais que o vento e a luz`,
      },
      {
        id: 'bj-12',
        title: 'Lei de Amor',
        artist: 'Fernanda Mendes Carvalho',
        duration: '3:35',
        requests: 13,
        addedAt: '2026-10-15T19:00:00.000Z',
        lyrics: `Tente acreditar que o amor ainda virá
Pela reencarnação tudo vai mudar

A família que nos cerca é aquela que escolhemos
Para nossa evolução isso agora entendemos

Nascer, viver, morrer
Renascer ainda
Progredir sempre, tal é a lei`,
      },
      {
        id: 'bj-13',
        title: 'Tempo e Vida',
        artist: 'Ariovaldo Filho',
        duration: '3:50',
        requests: 16,
        addedAt: '2026-10-15T19:05:00.000Z',
        lyrics: `Depende de nós
De mais ninguém
Que o amanhã seja melhor
Através do amor e humildade

Deixar o tempo e a vida
Fluir com paz e leveza
Acreditar no bem
É a nossa riqueza`,
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
        lyrics: `Belo pra mim é criança a brincar, é ouvir mil canções numa concha do mar
É a chuva caindo, é o campo em flor e acima de tudo, é o amor (é o amor) é o amor...

Belo pra mim quando estou a sofrer e a treva na alma começa a crescer
É lembrar com alegria que além, muito além, à espera de mim existe alguém.`,
      },
      {
        id: 'gv-02',
        title: 'Quanta Luz',
        artist: 'Cenyra Pinto',
        duration: '2:50',
        requests: 11,
        addedAt: '2026-10-16T19:10:00.000Z',
        lyrics: `Quanta luz neste ambiente
Descendo sobre nós
Vibrando em nossa mente
Quanta luz, quando assim em prece
Como a alma cresce
Aos olhos de Jesus...

Quanta luz, pois em oração
A voz do Mestre fala ao nosso coração...
Quanta luz, descendo sobre nós
Quanta luz.....quanta luz...quanta luz`,
      },
      {
        id: 'gv-03',
        title: 'Canção da Alegria Cristã',
        artist: 'Leopoldo Machado / Oli de Castro',
        duration: '3:10',
        requests: 17,
        addedAt: '2026-10-16T19:15:00.000Z',
        lyrics: `Somos companheiros,
Amigos, irmãos
Que vivem alegres pensando no bem.
A nossa alegria é de bons cristãos,
Não ofende a Jesus, nem fere a ninguém.

A nossa alegria (a nossa alegria)
É bem do evangelho (é bem do evangelho)
Vibra e contagia (vibra e contagia)
Da criança ao velho (da criança ao velho)
Mesmo entre perigos (mesmo entre perigos)
Daremos as mãos (daremos as mãos)
Como bons amigos (como bons amigos)
Como bons cristãos...

Sempre ombro a ombro,
Sempre lado a lado,
Vamos trabalhar com muita alegria,
Pelo o Espiritismo mais cristianizado,
Pela implantação da paz e harmonia.`,
      },
      {
        id: 'gv-04',
        title: 'Já é Tempo',
        artist: 'James',
        duration: '3:20',
        requests: 19,
        addedAt: '2026-10-16T19:20:00.000Z',
        lyrics: `Sem saber que um sol maior brilhava sobre mim
Quase me perdi... sem destino, mas o amor...

Não... não há lugar pra tristeza em quem sabe amar
É uma luz que nos faz sonhar, é uma alegria que te faz chorar
De sofrer sorrindo sem temor...

Olhe (Olhe) Olhe pro céu, já é tempo de cair o véu
De sair amando espalhando a paz, a paz... (a paz)
A paz... (a paz) a paz... (a paz) a paz... (a paz)`,
      },
      {
        id: 'gv-05',
        title: 'Amigo',
        artist: 'José Carlos Guimarães',
        duration: '3:15',
        requests: 16,
        addedAt: '2026-10-16T19:25:00.000Z',
        lyrics: `Onde estiver sei que vou caminhar com você, meu irmão, meu amigo
Seja na terra ou nas águas do mar, na pureza do ar com você, amigo
Onde estiver sei que vou caminhar com você, meu irmão, meu amigo
Na escuridão sei que a luz vai voltar, sei que o sol vai brilhar em você, amigo

Amor, amor, que nunca vai nos separar amor [BIS]`,
      },
      {
        id: 'gv-06',
        title: 'Cativar',
        artist: 'Grupo Vocal Amigos de Jesus',
        duration: '3:30',
        requests: 12,
        addedAt: '2026-10-16T19:30:00.000Z',
        lyrics: `Uma palavra tão linda, já quase esquecida me fez relembrar
Contendo sete letrinhas e todas juntinhas se lê cativar

Cativar é amar, é também carregar um pouquinho da dor que alguém tem que levar

Cativou, disse alguém, laços fortes criou, responsável é você pelo que cativou
Num deserto tão só, entre homens também, vou tentar cativar, viver perto de alguém

Cativou, disse alguém, laços fortes criou, responsável é você pelo que cativou`,
      },
      {
        id: 'gv-07',
        title: 'Alegria',
        artist: 'Grupo Vocal Amigos de Jesus',
        duration: '2:55',
        requests: 20,
        addedAt: '2026-10-16T19:35:00.000Z',
        lyrics: `Quando uma tristeza tomar seu coração
Não se desamine e cante uma canção
E lembre que acima de tudo você tem alguém
Que lhe quer muito bem, muito bem, muito bem

Ponha um sorriso bonito no seu rosto
Deixe que as lágrimas lavem seu desgosto
E lembre que acima de tudo você tem alguém
Que lhe quer muito bem, muito bem, muito bem

Quando uma dorzinha danada de doer
Bem lá no fundo lhe fizer sofrer
E lembre que acima de tudo você tem alguém
Que lhe quer muito bem, muito bem, muito bem`,
      },
      {
        id: 'gv-08',
        title: 'A Paz',
        artist: 'Roupa Nova',
        duration: '4:10',
        requests: 23,
        addedAt: '2026-10-16T19:40:00.000Z',
        lyrics: `Deve haver um lugar dentro do seu coração
Onde a paz brilhe mais que uma lembrança
Sem a luz que ela traz já nem se consegue mais
Encontrar o caminho da esperança

Sinta, chega o tempo de enxugar o pranto dos homens
Se fazendo irmão e estendendo a mão
Só o amor, muda o que já se fez
E a força da paz junta todos outra vez

Venha, já é hora de acender a chama da vida
E fazer a terra inteira feliz

Quanta dor e sofrimento em volta a gente ainda tem,
Pra manter a fé e o sonho dos que ainda vêm.
A lição pro futuro vem da alma e do coração,
Pra buscar a paz, não olhar pra trás, com amor.`,
      },
      {
        id: 'gv-09',
        title: 'Confia Sempre',
        artist: 'Carla Bevilacqua Piccolo',
        duration: '3:40',
        requests: 15,
        addedAt: '2026-10-16T19:45:00.000Z',
        lyrics: `Não percas a tua fé
Entre as sombras deste mundo
Ainda que teus pés sangrem
Confia sempre e segue

Tudo passa nesta Terra
Mas o que vem do céu permanecerá
Eleva, pois, o teu olhar
Confia sempre e segue

Luta.. Esforça-te no bem e confia sempre

Se hoje domina a tempestade
E te atormenta o coração
Brilha a alvorada além da noite
Confia sempre e segue

Há uma luz celeste
Pairando acima de ti
Crê que amanhã serás feliz
Confia sempre e segue

Luta... Esforça-te no bem e confia sempre...
Esforça-te no bem e confia sempre`,
      },
      {
        id: 'gv-10',
        title: 'Aurora',
        artist: 'Tim e Vanessa',
        duration: '4:30',
        requests: 18,
        addedAt: '2026-10-16T19:50:00.000Z',
        lyrics: `Uma grande noite abate a Terra, que se abate.
Treva imensa, não sem estrelas...
Passados milênios, um abrasamento
tisna o horizonte clareando esperança.
Prenúncio milenar do amanhecer.

Bem vinda Aurora
A terra sofreu, noites convulsivas
Verteu lágrimas, rangeu dentes`,
      },
      {
        id: 'gv-11',
        title: 'Diamantes de Poeira',
        artist: 'Ariovaldo Filho',
        duration: '3:20',
        requests: 10,
        addedAt: '2026-10-16T19:55:00.000Z',
        lyrics: `Olha a manhã que brilha na janela
Este sol de Deus é luz de amor em seu coração
Olha o que Deus nos deu de presente
Diamantes de poeira flutuando em raios de luz

Vamos louvar a Deus e agradecer a tudo
Um novo dia amanheceu, amanheceu
Nos levantar agora, sair ao mundo hoje
Testificar o amor... o amor de Jesus`,
      },
      {
        id: 'gv-12',
        title: 'Alvorada Jovem',
        artist: 'Grupo Vocal Amigos de Jesus',
        duration: '3:05',
        requests: 21,
        addedAt: '2026-10-16T20:00:00.000Z',
        lyrics: `Jovem (jovem), desbravador de novos mares (úúú)
Depende só de seus cantares o renascer de um mundo bom, bem melhor!

Jovem (jovem), com sangue novo e peito aberto (úúú)
Será traçado um rumo certo
Guiaremos o mundo ao amor, guiaremos o mundo ao amor!

E quando amanhecer, o sol de primavera
Desvenda a nova era em mim e em você`,
      },
      {
        id: 'gv-13',
        title: 'One Day',
        artist: 'Matisyahu',
        duration: '3:55',
        requests: 25,
        addedAt: '2026-10-16T20:05:00.000Z',
        lyrics: `Sometimes I lay under the moon, I thank God I'm breathin'
Then I pray don't take me soon, 'cause I am here for reason
Sometimes in my tears I drown, but I never let it get me down
So when negativity surrounds, I know someday it'll all turn around because

All my life I been waiting for, I been praying for, for the people to say
That we don't wanna fight no more, there'll be no more wars, and our children will play
One day, one day, one day, oh oh oh (2x)

Sometimes I lay under the moon, I thank God I'm breathin'
Then I pray don't take me soon, 'cause I am here for reason

All my life I been waiting for, I been praying for, for the people to say
That we don't wanna fight no more, there'll be no more wars, and our children will play
One day, one day, one day, oh oh oh (4x)`,
      },
      {
        id: 'gv-14',
        title: 'Aleluia',
        artist: 'Elizabete Lacerda',
        duration: '3:50',
        requests: 30,
        addedAt: '2026-10-16T20:10:00.000Z',
        lyrics: `Acredite estou aqui, ao teu lado e vou te ouvir venho consolar teu coração
Fale me do teu sofrer, busque a mim basta querer, posso restaurar a tua vida

Aleluia, aleluia, aleluia, aleluuuuuiiiaaa

Homens fracos creiam em mim, toda dor há de ter fim
Sou de Deus e trago a luz ao mundo
Todo pranto ha de secar, a esperança vai brotar, sinta minha presença em tua vida

Aleluia, aleluia, aleluia, aleluuuuuiiiaaa

Sou o cristo consolador, mensageiro do amor, junto a mim encontrarás abrigo
Nas tormentas e na dor, não desista lá estou, trago a esperança sou amor

Aleluia, aleluia, aleluia, aleluuuuuiiiaaa

Todos num só coração, as nações se dando as mãos,
Somos todos filhos do senhor
Sai o ódio entra o amor, vai a guerra nasce a flor, então cantaremos aleluia

Aleluia, aleluia, aleluia, aleluuuuuiiiaaa`,
      },
      {
        id: 'gv-15',
        title: 'Força do Bem',
        artist: 'Grupo Bem',
        duration: '3:45',
        requests: 28,
        addedAt: '2026-10-16T20:15:00.000Z',
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
        lyrics: `Todo o Céu se organiza para vir nos transformar
O Cristo já nos auxilia para vida nova alçar
Ondas de atos belos podem vir de nossas próprias mãos
Sentimentos triunfantes brotam naturais, então

Vou por dentro me preparar pra sem rebeldia aceitar
Invencível expande o amor em fraternidade

E eu desejo apenas amar, e todo um mar
De afetos cativar
Uma luz vem pra resplandecer, dentro do ser
Para ao Pai glorificar`,
      },
      {
        id: 'fp-02',
        title: 'O Chamado',
        artist: 'Evangelizar É Amar',
        duration: '4:05',
        requests: 17,
        addedAt: '2026-10-17T20:10:00.000Z',
        lyrics: `Esquece o tempo
Preocupado em teres o que os outros têm
Facilidades que na aparência os tornam mais felizes

Seja grato por sua vida,
Creia em Deus e em mim também,
Valoriza com ternura a todos que te querem bem
Amar é ser mais livre e liberdade é condição
Pra alcançar felicidade, seja neste mundo ou não

Esquece o tempo dos mitos dessa ilusão constante
De que viver pro mundo era o bastante
Talvez chamar meu nome não passasse de uma simples convenção

Esquece o tempo marcado pelo orgulho e a vaidade
Erraste por não ter a humildade
De admitir tuas faltas, de dobrar-te a um pedido de perdão

Esquece tudo e vem, senta ao meu lado
Nós precisamos conversar
Meu fardo é leve, a escolha é tua
Não perca o tempo de mudar`,
      },
      {
        id: 'fp-03',
        title: 'Uma Prece',
        artist: 'Cacau',
        duration: '3:40',
        requests: 15,
        addedAt: '2026-10-17T20:15:00.000Z',
        lyrics: `Ó poderosa águia que há no alto do totem
Dá-me tuas asas, me ensina a voar
Cruzar os horizontes, vencer montes e mares
Com a luz do saber, pela virtude de amar

Com tua força tamanha, ó urso, me ajude a derrubar
As barreiras da vida que eu venha a encontrar

E eu venho pedir a ti, ó tartaruga, que o totem estás a sustentar
Dá-me tua certeza de um dia eu poder chegar
A ver-te nas asas da águia, na força do urso
Em todas as coisas criadas por ti
Eleva minh'alma, me faz tão perfeito
Me leva a saber que estás dentro de mim

Ó Pai Nosso que estás no céu
Santificado seja o teu nome
Em favor de todos nóóós... nóóós... nóóós...`,
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
        lyrics: `Sem saber que um Sol maior,
Brilhava sobre mim quase me perdi
Ia sem destino, mas o amor...

Não, não há lugar pra tristeza em quem sabe amar
É uma luz que nos faz sonhar é uma alegria que nos faz chorar
E sofrer sorrindo, sem temor...

Olhe, olhe, olhe pro céu, já é tempo de cair o véu
De sair amando, espalhando a paz, a paz

Na, na, na, na
De sair amando, espalhando a paz, a paz

A paz, a paz a paz, a paz a paz`,
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
];

/**
 * Converte as linhas do Supabase (`playlists` + `songs`) para o formato usado pela UI.
 * Campos que não existem no banco (descrição, gradiente, duração, criador) são
 * recuperados do seed dos PDFs quando o nome/título coincide; caso contrário, usam padrões.
 */
function mapDbToPlaylists(dbPlaylists = [], dbSongs = []) {
  const presetSongs = new Map();
  INITIAL_PLAYLISTS.forEach((pl) =>
    pl.songs.forEach((s) => presetSongs.set(`${pl.name}::${s.title}`.toLowerCase(), s))
  );

  const songsByPlaylist = {};
  dbSongs.forEach((song) => {
    (songsByPlaylist[song.playlist_id] ||= []).push(song);
  });

  return dbPlaylists.map((pl) => {
    const preset = INITIAL_PLAYLISTS.find((p) => p.name.toLowerCase() === pl.title.toLowerCase());
    return {
      id: pl.id,
      name: pl.title,
      title: pl.title,
      description: preset?.description || 'Repertório de músicas ao vivo.',
      imageUrl: pl.image_url || preset?.imageUrl || '',
      image_url: pl.image_url || preset?.imageUrl || '',
      gradient: preset?.gradient || 'from-neutral-800 via-neutral-900 to-black',
      createdBy: preset?.createdBy || 'user-1',
      createdAt: pl.created_at,
      songs: (songsByPlaylist[pl.id] || []).map((song) => {
        const seedSong = presetSongs.get(`${pl.title}::${song.title}`.toLowerCase());
        return {
          id: song.id,
          playlist_id: song.playlist_id,
          title: song.title,
          artist: song.artist,
          lyrics: song.lyrics || '',
          duration: seedSong?.duration || '3:30',
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
   * Semeia as 3 playlists oficiais e respectivas músicas no Supabase
   * caso o banco na nuvem esteja vazio na primeira inicialização.
   */
  const seedInitialPlaylists = useCallback(async () => {
    try {
      console.log('[Supabase] Inicializando banco de dados com as 3 playlists oficiais...');
      for (const pl of INITIAL_PLAYLISTS) {
        const { data: createdPls, error: plErr } = await supabase
          .from('playlists')
          .insert([
            {
              title: pl.name,
              image_url: pl.imageUrl || '',
            },
          ])
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

      setPlaylists(mapDbToPlaylists(newDbPlaylists, newDbSongs));
      showToast('Banco Supabase conectado e sincronizado com sucesso!', 'success');
    } catch (err) {
      console.error('[Supabase] Erro ao semear playlists no banco:', err);
      setPlaylists(INITIAL_PLAYLISTS);
    }
  }, [showToast]);

  /**
   * Consulta assíncrona das playlists e músicas diretamente do Supabase
   */
  const fetchPlaylists = useCallback(async () => {
    try {
      setIsLoadingPlaylists(true);

      const { data: dbPlaylists, error: plError } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: true });

      if (plError) throw plError;

      // Se a tabela estiver vazia, popula com as 3 playlists oficiais
      if (!dbPlaylists || dbPlaylists.length === 0) {
        await seedInitialPlaylists();
        return;
      }

      // Busca todas as músicas da tabela songs
      const { data: dbSongs, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: true });

      if (songsError) throw songsError;

      setPlaylists(mapDbToPlaylists(dbPlaylists, dbSongs));
    } catch (err) {
      console.warn('[Supabase] Falha ao consultar Supabase:', err);
      showToast('Aviso: Operando com dados locais de contingência.', 'info');
      setPlaylists(INITIAL_PLAYLISTS);
    } finally {
      setIsLoadingPlaylists(false);
    }
  }, [seedInitialPlaylists, showToast]);

  // Carrega os dados na montagem do componente
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchPlaylists();
  }, [fetchPlaylists]);

  /**
   * `registeredUsers`: Usuários cadastrados (mantido para sessão e alternância de perfil)
   */
  const [registeredUsers, setRegisteredUsers] = useLocalStorage(
    'spiritfy_registered_users',
    PRESET_USERS
  );

  // Currently logged-in user object (null = logged out / not authenticated)
  const [currentUser, setCurrentUser] = useLocalStorage('spiritfy_current_user', null);

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
    const name = currentUser?.name || 'Usuário';
    setCurrentUser(null);
    showToast(`Até logo, ${name}! Sessão encerrada.`, 'info');
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
    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert([
          {
            title: name.trim(),
            image_url: imageUrl || '',
          },
        ])
        .select();

      if (error) throw error;
      const created = data[0];

      const newPlaylist = {
        id: created.id,
        name: created.title,
        title: created.title,
        description: description || 'Playlist personalizada no Supabase.',
        imageUrl: created.image_url || '',
        image_url: created.image_url || '',
        gradient: gradient || 'from-neutral-800 via-neutral-900 to-black',
        createdBy: currentUser ? currentUser.id : 'user-guest',
        createdAt: created.created_at,
        songs: [],
      };

      setPlaylists((prev) => [newPlaylist, ...prev]);
      showToast(`Playlist "${name}" criada e salva no Supabase!`, 'success');
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
    if (playlistId === 'mix-geral') {
      showToast('O Mix Geral é dinâmico e não pode ser editado diretamente.', 'warning');
      return false;
    }

    try {
      const payload = {};
      if (updatedData.name !== undefined) payload.title = updatedData.name.trim();
      if (updatedData.title !== undefined) payload.title = updatedData.title.trim();
      if (updatedData.imageUrl !== undefined) payload.image_url = updatedData.imageUrl.trim();
      if (updatedData.image_url !== undefined) payload.image_url = updatedData.image_url.trim();

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
              ...updatedData,
              name: payload.title || pl.name,
              title: payload.title || pl.title,
              imageUrl: payload.image_url !== undefined ? payload.image_url : pl.imageUrl,
              image_url: payload.image_url !== undefined ? payload.image_url : pl.image_url,
            };
          }
          return pl;
        })
      );

      showToast(`Playlist atualizada com sucesso no Supabase!`, 'success');
      return true;
    } catch (err) {
      console.error('[Supabase] Erro ao atualizar playlist:', err);
      showToast('Erro ao salvar alterações no Supabase.', 'warning');
      return false;
    }
  };

  /**
   * Add a new song to an existing playlist in Supabase
   * @param {string} playlistId
   * @param {{ title: string, artist: string, duration?: string, lyrics?: string }} songData
   */
  const addSongToPlaylist = async (playlistId, { title, artist, duration, lyrics }) => {
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

      showToast(`Música "${title}" adicionada com sucesso no Supabase!`, 'success');
      return newSong;
    } catch (err) {
      console.error('[Supabase] Erro ao adicionar música:', err);
      showToast('Erro ao adicionar música no Supabase.', 'warning');
      return null;
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
        fetchPlaylists,
        users: registeredUsers,
        registeredUsers,
        currentUser,
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
        addSongToPlaylist,
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
