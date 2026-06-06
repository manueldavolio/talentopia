export interface LessonQuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface PracticalExercise {
  title: string;
  instructions: string;
}

export interface CourseLesson {
  id: string;
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  summary: string;
  content: string;
  footballExample: string;
  quiz: LessonQuizQuestion[];
  exercise: PracticalExercise;
  xpReward: number;
}

export interface CourseBadge {
  id: string;
  name: string;
  icon: string;
  levelRequired: number;
  description: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  levels: { level: number; title: string; description: string }[];
  lessons: CourseLesson[];
  badges: CourseBadge[];
}

export const MATCH_ANALYST_BADGES: CourseBadge[] = [
  { id: "ma-osservatore", name: "Osservatore", icon: "👁️", levelRequired: 1, description: "Completato livello Principiante" },
  { id: "ma-base", name: "Analista Base", icon: "📋", levelRequired: 2, description: "Completato livello Base" },
  { id: "ma-tattico", name: "Tattico", icon: "♟️", levelRequired: 3, description: "Completato livello Intermedio" },
  { id: "ma-video", name: "Video Analyst", icon: "🎬", levelRequired: 4, description: "Completato livello Avanzato" },
  { id: "ma-pro", name: "Match Analyst Pro", icon: "🏆", levelRequired: 5, description: "Completato tutto il corso" },
];

const q = (
  question: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string
): LessonQuizQuestion => ({ question, options, correctIndex, explanation });

export const MATCH_ANALYST_LESSONS: CourseLesson[] = [
  {
    id: "ma-l1-1",
    level: 1,
    title: "Cos'è un match analyst",
    summary: "Ruolo, obiettivi e differenza dal semplice spettatore.",
    content:
      "Un match analyst osserva partite con metodo: registra moduli, transizioni, errori e schemi. Non basta guardare i gol: serve capire perché una squadra crea occasioni o subisce pressing.",
    footballExample:
      "In Inter-Milan, un analista nota come la squadra in possesso allarga le ali per creare spazio centrale — non solo chi segna.",
    quiz: [
      q(
        "Cosa fa principalmente un match analyst?",
        ["Osserva con metodo e registra pattern tattici", "Solo tifa", "Arbitrare", "Giocare in campo"],
        0,
        "L'analista usa obiettivi chiari e appunti strutturati."
      ),
    ],
    exercise: {
      title: "Prima osservazione",
      instructions: "Guarda 15 minuti di una partita e annota solo i moduli delle due squadre.",
    },
    xpReward: 50,
  },
  {
    id: "ma-l1-2",
    level: 1,
    title: "Guardare vs analizzare",
    summary: "Passare dallo spettatore all'osservatore strutturato.",
    content:
      "Guardare è passivo; analizzare richiede domande: dove pressa la squadra? Chi libera il regista? Quali spazi restano scoperti?",
    footballExample:
      "Durante un possesso lungo del Napoli, chiediti: quanti giocatori sono tra palla e porta avversaria?",
    quiz: [
      q(
        "Analizzare una partita significa:",
        ["Osservare con obiettivi e appunti", "Guardare solo highlights", "Contare i falli", "Ignorare la tattica"],
        0,
        "Serve metodo e obiettivi prima di iniziare."
      ),
    ],
    exercise: {
      title: "Domande guida",
      instructions: "Scrivi 5 domande da farti prima del prossimo match che guardi.",
    },
    xpReward: 50,
  },
  {
    id: "ma-l1-3",
    level: 1,
    title: "Ruoli in campo",
    summary: "Portiere, difensori, centrocampo e attacco.",
    content:
      "Ogni ruolo ha compiti in possesso e non possesso. Un terzino può essere basso in difesa e altissimo in attacco a seconda del modulo.",
    footballExample:
      "Theo Hernandez al Milan: terzino che sale spesso — l'analista segna quando sale e chi copre.",
    quiz: [
      q(
        "Perché annotare i ruoli?",
        ["Per capire compiti e movimenti specifici", "Per decidere il risultato", "Non serve", "Solo per il portiere"],
        0,
        "Ruolo = filtro per osservare meglio."
      ),
    ],
    exercise: {
      title: "Focus su un ruolo",
      instructions: "Segui solo il mediano di una squadra per un tempo intero.",
    },
    xpReward: 60,
  },
  {
    id: "ma-l1-4",
    level: 1,
    title: "Moduli base: 4-4-2, 4-3-3, 3-5-2",
    summary: "Leggere i numeri del modulo.",
    content:
      "4-4-2: equilibrio; 4-3-3: ampiezza e tre attaccanti; 3-5-2: tre difensori e esterni a tutta fascia. Somma i numeri per i giocatori di movimento.",
    footballExample:
      "Atalanta in 3-4-1-2: tre difensori, quattro a centrocampo (due esterni), tre davanti.",
    quiz: [
      q(
        "In un 4-3-3 quanti attaccanti tipici?",
        ["Tre", "Due", "Uno", "Quattro"],
        0,
        "4-4-2 ha due, 4-3-3 ne ha tre."
      ),
    ],
    exercise: {
      title: "Disegna i moduli",
      instructions: "Su carta disegna 4-4-2 e 4-3-3 con posizioni approssimative.",
    },
    xpReward: 60,
  },
  {
    id: "ma-l1-5",
    level: 1,
    title: "Fasi di gioco",
    summary: "Possesso, non possesso, transizioni.",
    content:
      "Possesso: costruzione; non possesso: pressing e coperture; transizione positiva: ripartenza; negativa: ripiegamento.",
    footballExample:
      "Liverpool in gegenpressing: transizione positiva subito dopo recupero.",
    quiz: [
      q(
        "Transizione positiva significa:",
        ["Ripartenza verso porta avversaria", "Possesso lento", "Solo difesa", "Intervallo"],
        0,
        "Positiva = verso la porta avversaria."
      ),
    ],
    exercise: {
      title: "Conta le fasi",
      instructions: "In 10 minuti di partita conta quante volte cambia la fase per una squadra.",
    },
    xpReward: 70,
  },
  {
    id: "ma-l1-6",
    level: 1,
    title: "Appunti durante la partita",
    summary: "Foglio semplice e simboli rapidi.",
    content:
      "Usa colonne: minuto, modulo, evento, osservazione. Simboli: ▲ pressing, ▼ blocco basso, → transizione.",
    footballExample:
      "Min 23': 4-3-3 → pressing alto su regista avversario → errore → occasione.",
    quiz: [
      q(
        "Un buon appunto contiene:",
        ["Minuto, contesto e osservazione", "Solo il punteggio", "Solo nomi", "Niente"],
        0,
        "Contesto + osservazione = utile dopo."
      ),
    ],
    exercise: {
      title: "Foglio analisi",
      instructions: "Prepara un foglio con colonne: minuto / modulo / osservazione e usalo 20 minuti.",
    },
    xpReward: 70,
  },
  {
    id: "ma-l2-1",
    level: 2,
    title: "Analisi individuale",
    summary: "Focus su un giocatore per 90 minuti.",
    content:
      "Segui touch, movimenti senza palla, errori e soluzioni. Confronta 1° e 2° tempo.",
    footballExample:
      "Analisi su Modric: quante volte gira il gioco in avanti vs indietro?",
    quiz: [
      q(
        "Analisi individuale utile per:",
        ["Valutare compiti e rendimento specifico", "Solo il portiere", "Solo tifosi", "Arbitro"],
        0,
        "Un giocatore alla volta = dettaglio."
      ),
    ],
    exercise: { title: "Profilo giocatore", instructions: "Scrivi 5 punti di forza e 3 di debolezza di un giocatore seguito." },
    xpReward: 80,
  },
  {
    id: "ma-l2-2",
    level: 2,
    title: "Analisi di squadra",
    summary: "Blocchi, linee e comportamento collettivo.",
    content:
      "Osserva distanza tra linee, compattezza, ampiezza e profondità del gruppo.",
    footballExample:
      "Squadra in blocco medio: linea difensiva + centrocampo a 10-15 metri.",
    quiz: [
      q("Blocchi di squadra riguardano:", ["Posizione collettiva delle linee", "Solo un giocatore", "Solo tifosi", "Solo arbitro"], 0, "Analisi di squadra = collettivo."),
    ],
    exercise: { title: "Compattezza", instructions: "Stima la distanza media tra difesa e centrocampo in 3 momenti." },
    xpReward: 80,
  },
  {
    id: "ma-l2-3",
    level: 2,
    title: "Costruzione dal basso",
    summary: "Uscita palla e progressione.",
    content:
      "Portiere + difensori + mediani: come si supera il pressing? Linee di passaggio e movimenti.",
    footballExample:
      "Man City: portiere tra i centrali, terzini alti per allargare.",
    quiz: [
      q("Costruzione dal basso analizza:", ["Come si esce dal pressing in uscita", "Solo corner", "Solo rigori", "Solo tifo"], 0, "Uscita palla = inizio dell'analisi moderna."),
    ],
    exercise: { title: "Uscita palla", instructions: "Conta quante opazioni di passaggio ha il portiere in 5 uscite." },
    xpReward: 90,
  },
  {
    id: "ma-l2-4",
    level: 2,
    title: "Pressing e marcature",
    summary: "Pressing a uomo, a zona, marcatura mista.",
    content:
      "Chi pressa? Trigger (passaggio indietro, palla su fascia)? Chi copre dietro?",
    footballExample:
      "Pressing di Klopp: trigger su passaggio al centrale sotto pressione.",
    quiz: [
      q("Pressing a uomo significa:", ["Seguire un avversario chiave", "Difesa passiva", "Solo portiere", "Nessuna pressione"], 0, "A uomo = responsabilità individuale."),
    ],
    exercise: { title: "Trigger", instructions: "Identifica 3 momenti in cui inizia il pressing di una squadra." },
    xpReward: 90,
  },
  {
    id: "ma-l2-5",
    level: 2,
    title: "Ampiezza e profondità",
    summary: "Spazi orizzontali e verticali.",
    content:
      "Ampiezza: ali e terzini; profondità: movimenti in sponda alla difesa avversaria.",
    footballExample:
      "Vinicius allarga, Benzema taglia in profondità — combinazione classica.",
    quiz: [
      q("Profondità in attacco:", ["Penetrare dietro la linea difensiva", "Giocare solo indietro", "Solo cross", "Solo difesa"], 0, "Profondità = verticalità."),
    ],
    exercise: { title: "Mappa spazi", instructions: "Segna su schema dove la squadra crea più ampiezza." },
    xpReward: 100,
  },
  {
    id: "ma-l2-6",
    level: 2,
    title: "Linee di passaggio",
    summary: "Opzioni visibili tra compagni.",
    content:
      "Linee chiuse dal pressing avversario = difficoltà costruzione. Linee aperte = progressione.",
    footballExample:
      "Pressing alto: tagliare passaggio al regista chiude linea centrale.",
    quiz: [
      q("Linee di passaggio sono:", ["Traiettorie possibili tra compagni", "Solo cross", "Linee del campo", "Solo rigore"], 0, "Linee = opzioni di passaggio."),
    ],
    exercise: { title: "Linee chiuse", instructions: "In un replay, conta quante linee di passaggio sono chiuse dal pressing." },
    xpReward: 100,
  },
  {
    id: "ma-l3-1",
    level: 3,
    title: "Analisi video",
    summary: "Replay, angolazioni e ritmo lento.",
    content:
      "Il video permette di rivedere transizioni, posizioni fuori palla e errori non visti live.",
    footballExample:
      "Replay fuorigioco semi-automatico: posizione spalla al passaggio.",
    quiz: [
      q("Analisi video serve a:", ["Rivedere dettagli non visibili live", "Sostituire arbitro", "Solo social", "Ignorare dati"], 0, "Video = precisione."),
    ],
    exercise: { title: "Replay", instructions: "Rivedi 3 azioni in replay e annota cosa non avevi visto live." },
    xpReward: 110,
  },
  {
    id: "ma-l3-2",
    level: 3,
    title: "Taggare eventi",
    summary: "Catalogare azioni con timestamp.",
    content:
      "Tag: pressing riuscito, errore difensivo, occasione da gol, palla persa zona pericolosa.",
    footballExample:
      "Tag «occasione xG alta» al min 67' per clip report.",
    quiz: [
      q("Taggare eventi significa:", ["Etichettare azioni con timestamp", "Solo guardare", "Solo tifo", "Cancellare video"], 0, "Tag = catalogo ricercabile."),
    ],
    exercise: { title: "5 tag", instructions: "Crea 5 tag personalizzati e applicali a 5 clip." },
    xpReward: 110,
  },
  {
    id: "ma-l3-3",
    level: 3,
    title: "Occasioni da gol e errori difensivi",
    summary: "Qualità chance e responsabilità difensive.",
    content:
      "Non solo «tiro»: posizione, pressione, tipo di assist. Errori: chi perde marcatura, linea alta scoperta.",
    footballExample:
      "Gol su seconda palla: errore = nessuno copre zona del rigore.",
    quiz: [
      q("Occasione da gol include:", ["Posizione e qualità del tiro", "Solo cartellino", "Solo corner", "Solo sostituzione"], 0, "Qualità > quantità tiri."),
    ],
    exercise: { title: "2 occasioni", instructions: "Descrivi 2 occasioni con: chi, dove, come nasce." },
    xpReward: 120,
  },
  {
    id: "ma-l3-4",
    level: 3,
    title: "Report partita base",
    summary: "Struttura: sintesi, dati, clip, conclusioni.",
    content:
      "1 pagina: modulo, fasi dominanti, 3 punti di forza, 3 debolezze, 2 clip chiave.",
    footballExample:
      "Report post Inter: blocco basso efficace, difficoltà uscita pressione alta.",
    quiz: [
      q("Report post gara base contiene:", ["Sintesi tattica e osservazioni", "Solo risultato", "Solo emoji", "Solo mercato"], 0, "Struttura chiara = utile allo staff."),
    ],
    exercise: { title: "Mini report", instructions: "Scrivi un report di 1 pagina su una partita vista." },
    xpReward: 120,
  },
  {
    id: "ma-l4-1",
    level: 4,
    title: "Analisi avversario",
    summary: "Preparazione pre-gara.",
    content:
      "Studia modulo abituale, pattern offensivi, debolezze in uscita palla, palle inattive.",
    footballExample:
      "Pre-gara: avversario concede spazio dietro terzini alti → pianificare profondità.",
    quiz: [
      q("Analisi avversario serve a:", ["Preparare la gara con dati sui pattern", "Ignorare l'avversario", "Solo tifo", "Arbitrare"], 0, "Pre-gara = vantaggio tattico."),
    ],
    exercise: { title: "Scheda avversario", instructions: "Compila scheda: modulo, punti forti, debolezze, giocatore chiave." },
    xpReward: 130,
  },
  {
    id: "ma-l4-2",
    level: 4,
    title: "Pattern offensivi e KPI semplici",
    summary: "Schemi ripetuti e metriche base.",
    content:
      "KPI: tiri in area, possesso zona finale, pressing riusciti. Pattern: ripetizione movimenti simili.",
    footballExample:
      "Pattern: esterno-banda, cross, attaccante + trequartista area.",
    quiz: [
      q("Un KPI semplice può essere:", ["Tiri in area o possesso zona finale", "Numero tifosi", "Colore maglia", "Orario kickoff"], 0, "KPI = misura utile."),
    ],
    exercise: { title: "1 pattern", instructions: "Identifica un pattern offensivo ripetuto 3+ volte." },
    xpReward: 130,
  },
  {
    id: "ma-l4-3",
    level: 4,
    title: "Heatmap e xG semplice",
    summary: "Visualizzare dove si gioca e qualità occasioni.",
    content:
      "Heatmap: zone calde = dove passa la palla. xG: probabilità gol per occasione.",
    footballExample:
      "Heatmap ala destra calda = attacco concentrato su quella fascia.",
    quiz: [
      q("Expected goals (xG) indica:", ["Probabilità che un tiro diventi gol", "Gol già fatti", "Minuti giocati", "Cartellini"], 0, "xG = qualità occasioni."),
    ],
    exercise: { title: "Zona calda", instructions: "Disegna a mano una heatmap approssimativa di una squadra." },
    xpReward: 140,
  },
  {
    id: "ma-l5-1",
    level: 5,
    title: "Report professionale",
    summary: "Presentazione chiara per staff e allenatore.",
    content:
      "Linguaggio preciso, clip brevi, raccomandazioni actionable. Evita opinioni senza dati.",
    footballExample:
      "Slide 1: sintesi; slide 2-3: clip pressing; slide 4: raccomandazioni.",
    quiz: [
      q("Report pro deve essere:", ["Chiaro, oggettivo e con clip utili", "Solo lungo", "Solo opinioni", "Senza video"], 0, "Pro = chiarezza + dati."),
    ],
    exercise: { title: "Presentazione 5 slide", instructions: "Prepara outline 5 slide per presentare analisi a uno staff immaginario." },
    xpReward: 150,
  },
  {
    id: "ma-l5-2",
    level: 5,
    title: "Piano gara e post gara",
    summary: "Dal preparatorio al debrief.",
    content:
      "Pre: obiettivi tattici; post: cosa ha funzionato vs piano. Comunicazione con allenatore.",
    footballExample:
      "Piano: pressing su regista; post: 70% pressing riusciti, 2 gol da transizione.",
    quiz: [
      q("Analisi post gara confronta:", ["Piano pre-gara vs cosa è successo", "Solo risultato", "Solo mercato", "Solo tifosi"], 0, "Post = verifica del piano."),
    ],
    exercise: { title: "Debrief", instructions: "Scrivi debrief: 3 obiettivi pre-gara e quanto sono stati raggiunti." },
    xpReward: 150,
  },
  {
    id: "ma-l5-3",
    level: 5,
    title: "Comunicazione con staff e giocatori",
    summary: "Linguaggio, rispetto e utilità.",
    content:
      "Feedback costruttivo, clip brevi, evitare giudizi personali. Adattare linguaggio all'interlocutore.",
    footballExample:
      "Con giocatore: clip 30 sec + 1 suggerimento concreto, non 10 errori insieme.",
    quiz: [
      q("Con un giocatore conviene:", ["Clip brevi e feedback concreto", "Critiche lunghe senza esempi", "Solo dati senza video", "Ignorarlo"], 0, "Comunicazione efficace = breve e utile."),
    ],
    exercise: { title: "Messaggio coach", instructions: "Scrivi un messaggio di 5 righe all'allenatore con 1 insight chiave da una partita." },
    xpReward: 160,
  },
];

export const MATCH_ANALYST_COURSE: Course = {
  id: "match-analyst",
  slug: "match-analyst",
  title: "Corso Match Analyst",
  description:
    "Da zero a match analyst: osservazione, tattica, video, report e comunicazione con lo staff.",
  icon: "📊",
  gradient: "from-violet-600 via-purple-700 to-indigo-900",
  levels: [
    { level: 1, title: "Principiante", description: "Ruoli, moduli, fasi di gioco e appunti" },
    { level: 2, title: "Base", description: "Analisi individuale/squadra, pressing, spazi" },
    { level: 3, title: "Intermedio", description: "Video, tagging, report partita" },
    { level: 4, title: "Avanzato", description: "Avversario, KPI, heatmap, xG" },
    { level: 5, title: "Top", description: "Report pro, piano gara, comunicazione" },
  ],
  lessons: MATCH_ANALYST_LESSONS,
  badges: MATCH_ANALYST_BADGES,
};

export const COURSES = [MATCH_ANALYST_COURSE];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getLessonById(courseSlug: string, lessonId: string): CourseLesson | undefined {
  const course = getCourseBySlug(courseSlug);
  return course?.lessons.find((l) => l.id === lessonId);
}
