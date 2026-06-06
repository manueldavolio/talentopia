import type { Course, CourseBadge, CourseLesson, LessonQuizQuestion } from "./match-analyst";

const q = (
  question: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string
): LessonQuizQuestion => ({ question, options, correctIndex, explanation });

export const ARBITRO_BADGES: CourseBadge[] = [
  { id: "arbitro-junior", name: "Arbitro Junior", icon: "🟨", levelRequired: 2, description: "Regole base e fuorigioco" },
  { id: "arbitro-provinciale", name: "Arbitro Provinciale", icon: "🟧", levelRequired: 4, description: "Falli, cartellini e VAR" },
  { id: "arbitro-elite", name: "Arbitro Elite", icon: "🏅", levelRequired: 5, description: "Corso arbitro completato" },
];

export const ARBITRO_LESSONS: CourseLesson[] = [
  {
    id: "arb-l1",
    level: 1,
    title: "Regole base",
    summary: "Durata, campo, palla, numero giocatori.",
    content:
      "Una partita dura 90 minuti in due tempi da 45. Il campo ha linee di fondo, laterali, area e dischetto. La palla deve essere sferica e i giocatori in campo sono 11 per squadra.",
    footballExample: "L'arbitro verifica che ci siano 11 giocatori per squadra prima del calcio d'inizio.",
    quiz: [
      q("Quanti giocatori per squadra in campo?", ["9", "10", "11", "12"], 2, "Sono 11 titolari per squadra."),
      q("Quanti minuti dura una partita?", ["80", "90", "100", "120"], 1, "Due tempi da 45 minuti."),
    ],
    exercise: { title: "Osserva il calcio d'inizio", instructions: "Guarda un video e nota posizione arbitro e pallone." },
    xpReward: 80,
  },
  {
    id: "arb-l2",
    level: 2,
    title: "Fuorigioco",
    summary: "Posizione, interferenza e momenti di valutazione.",
    content:
      "Fuorigioco si valuta al momento del passaggio: testa, busto o gamba oltre penultimo difensore o palla. Non è fuorigioco se si trova in campo proprio o al livello del penultimo.",
    footballExample: "Attaccante in linea con il penultimo difensore: NON fuorigioco al momento del passaggio.",
    quiz: [
      q("Quando si valuta il fuorigioco?", ["Al tiro", "Al passaggio", "Al controllo", "Al gol"], 1, "Si guarda la posizione al passaggio."),
      q("Quale parte del corpo conta?", ["Solo piedi", "Testa, busto o gamba", "Solo busto", "Mani"], 1, "Qualsiasi parte del corpo con cui si può segnare."),
    ],
    exercise: { title: "Freeze frame", instructions: "Metti in pausa un replay e traccia la linea del fuorigioco." },
    xpReward: 90,
  },
  {
    id: "arb-l3",
    level: 3,
    title: "Falli",
    summary: "Falli diretti, indiretti e gioco pericoloso.",
    content:
      "Fallo diretto: contatto ingiusto o gioco pericoloso con contatto. Fallo indiretto: ostacolo senza contatto, fallo del portiere, ecc. Il gioco pericoloso può essere senza contatto.",
    footballExample: "Entrata di punta su caviglia: fallo diretto e probabile cartellino.",
    quiz: [
      q("Entrata pericolosa con contatto?", ["Fallo indiretto", "Fallo diretto", "Rimessa", "Corner"], 1, "Contatto ingiusto = fallo diretto."),
    ],
    exercise: { title: "Classifica i falli", instructions: "Da 5 clip, indica diretto o indiretto." },
    xpReward: 90,
  },
  {
    id: "arb-l4",
    level: 4,
    title: "Cartellini",
    summary: "Ammonizione, espulsione e doppia ammonizione.",
    content:
      "Cartellino giallo: ammonizione per falli tattici, proteste, perdita tempo. Rosso: espulsione per fallo grave, doppio giallo o negazione chiara gol.",
    footballExample: "Doppio giallo per fallo tattico al 80': espulsione.",
    quiz: [
      q("Due gialli nella stessa partita?", ["Ammonizione", "Espulsione", "Niente", "Rigore"], 1, "Doppia ammonizione = espulsione."),
    ],
    exercise: { title: "Diario cartellini", instructions: "Annota motivo di ogni cartellino in una partita." },
    xpReward: 100,
  },
  {
    id: "arb-l5",
    level: 5,
    title: "VAR",
    summary: "Protocollo VAR, schermo e decisione finale.",
    content:
      "Il VAR interviene per errori chiari su gol, rigore, rosso diretto e identità. L'arbitro può rivedere al monitor (OVR) o accettare il suggerimento VAR.",
    footballExample: "Contatto in area: arbitro va al monitor e annulla il rigore.",
    quiz: [
      q("Quando può intervenire il VAR?", ["Per ogni fallo", "Errori chiari su gol/rigore/rosso", "Per offside dubbio sempre", "Mai"], 1, "Solo per le 4 categorie previste."),
    ],
    exercise: { title: "Decisione VAR", instructions: "Simula 3 situazioni: conferma, cambia o mantieni." },
    xpReward: 110,
  },
  {
    id: "arb-l6",
    level: 3,
    title: "Gestione gara",
    summary: "Comunicazione, autorità e controllo del tempo.",
    content:
      "L'arbitro gestisce il gioco con chiarezza, posizionamento e comunicazione. Parla ai capitani, usa il fischio con decisione e controlla il tempo aggiuntivo.",
    footballExample: "Arbitro richiama capitano per proteste eccessive della panchina.",
    quiz: [
      q("Chi parla per primo con l'arbitro?", ["Tifosi", "Capitani", "Allenatori", "Steward"], 1, "I capitani sono interlocutori ufficiali."),
    ],
    exercise: { title: "Posizionamento", instructions: "Disegna dove posizionarsi in un contropiede." },
    xpReward: 110,
  },
  {
    id: "arb-l7",
    level: 4,
    title: "Referto",
    summary: "Compilazione referto e segnalazioni disciplinari.",
    content:
      "Il referto riporta risultato, cartellini, sostituzioni, incidenti e osservazioni. Deve essere chiaro, completo e inviato entro i termini previsti.",
    footballExample: "Segnalare nel referto comportamento antisportivo non visto in campo.",
    quiz: [
      q("Cosa va nel referto?", ["Solo gol", "Cartellini e sostituzioni", "Solo formazioni", "Nulla"], 1, "Tutti gli eventi disciplinari e sostituzioni."),
    ],
    exercise: { title: "Referto simulato", instructions: "Compila un referto da una partita immaginaria." },
    xpReward: 120,
  },
  {
    id: "arb-l8",
    level: 5,
    title: "Situazioni particolari",
    summary: "Rigori, rinvii, interruzioni e fair play.",
    content:
      "Gestire rigori, calci di punizione veloci, lesioni simulate, rinvio e fair play. In situazioni ambigue, la sicurezza dei giocatori viene prima.",
    footballExample: "Fair play: squadra restituisce palla dopo finta lesione avversaria.",
    quiz: [
      q("Fair play significa?", ["Ignorare regole", "Gioco leale e rispetto", "Solo vincere", "Protestare sempre"], 1, "Rispetto delle regole e degli avversari."),
    ],
    exercise: { title: "Scenario complesso", instructions: "Risolvi una situazione con rigore + cartellino + protesta." },
    xpReward: 150,
  },
];

export const ARBITRO_COURSE: Course = {
  id: "corso-arbitro",
  slug: "corso-arbitro",
  title: "Corso Arbitro",
  description: "Impara le regole del calcio e diventa arbitro: dal fuorigioco al VAR.",
  icon: "🟨",
  gradient: "from-amber-500 to-yellow-600",
  levels: [
    { level: 1, title: "Base", description: "Regole e fuorigioco" },
    { level: 2, title: "Disciplina", description: "Falli e cartellini" },
    { level: 3, title: "Elite", description: "VAR, gestione e referto" },
  ],
  lessons: ARBITRO_LESSONS,
  badges: ARBITRO_BADGES,
};

export const ARBITRO = ARBITRO_COURSE;
