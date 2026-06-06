import type { Course, CourseBadge, CourseLesson, LessonQuizQuestion } from "./match-analyst";

const q = (
  question: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string
): LessonQuizQuestion => ({ question, options, correctIndex, explanation });

export const PATENTE_ACADEMY_BADGES: CourseBadge[] = [
  { id: "pat-principiante", name: "Principiante", icon: "🚗", levelRequired: 1, description: "Completato Livello 1 — Segnaletica base" },
  { id: "pat-allievo", name: "Allievo Conducente", icon: "🛣️", levelRequired: 2, description: "Completato Livello 2 — Circolazione" },
  { id: "pat-segnaletica", name: "Esperto Segnaletica", icon: "🚦", levelRequired: 3, description: "Completato Livello 3 — Autostrada e sicurezza" },
  { id: "pat-precedenze", name: "Maestro delle Precedenze", icon: "🔀", levelRequired: 4, description: "Completato Livello 4 — Norme e responsabilità" },
  { id: "pat-pro", name: "Patente Pro", icon: "🏆", levelRequired: 5, description: "Completato Livello 5 — Pronto per l'esame" },
];

export const PATENTE_ACADEMY_LESSONS: CourseLesson[] = [
  {
    id: "pat-l1",
    level: 1,
    title: "Segnaletica: pericolo, obbligo e divieto",
    summary: "Riconoscere forme, colori e significati dei segnali stradali.",
    content:
      "I segnali di pericolo (triangolo rosso) avvisano di un rischio. I segnali di obbligo (tondo blu) impongono un comportamento. I segnali di divieto (tondo rosso) vietano un'azione. Imparare a distinguerli a colpo d'occhio è la base dell'esame.",
    footballExample:
      "Come in campo ci sono regole scritte e non scritte, in strada ogni segnale ha un significato preciso da rispettare.",
    quiz: [
      q(
        "Quale forma hanno i segnali di pericolo?",
        ["Triangolo con bordo rosso", "Cerchio blu", "Quadrato giallo", "Ottagono verde"],
        0,
        "Triangolo = pericolo imminente."
      ),
      q(
        "Colore tipico segnali di obbligo?",
        ["Blu con simbolo bianco", "Rosso con barra", "Giallo", "Verde"],
        0,
        "Obbligo = tondo blu."
      ),
    ],
    exercise: {
      title: "Flashcard segnali",
      instructions: "Disegna 6 segnali (2 pericolo, 2 obbligo, 2 divieto) e scrivi il significato sotto ciascuno.",
    },
    xpReward: 60,
  },
  {
    id: "pat-l2",
    level: 2,
    title: "Precedenze, incroci e velocità",
    summary: "Regole di precedenza, incroci e limiti di velocità.",
    content:
      "Stop = arresto completo. Senza segnali: precedenza a destra. In rotonda cedi a chi gira. Limiti: 50 km/h in centro abitato, 90 extraurbano, 110 autostrada con pioggia, 130 autostrada secco.",
    footballExample:
      "Come un passaggio in area: prima guardi, poi agisci — in incrocio prima cedi, poi attraversi.",
    quiz: [
      q(
        "Regola generale in incrocio equivalente?",
        ["Precedenza a destra", "Precedenza a sinistra", "Chi va dritto", "Chi arriva per ultimo"],
        0,
        "Destra-precede salvo segnaletica."
      ),
      q(
        "Limite in centro abitato (salvo segnali)?",
        ["50 km/h", "30 km/h", "70 km/h", "90 km/h"],
        0,
        "Default urbano = 50."
      ),
    ],
    exercise: {
      title: "Schema incrocio",
      instructions: "Disegna un incrocio a 4 vie e indica con frecce chi cede a chi in assenza di segnali.",
    },
    xpReward: 70,
  },
  {
    id: "pat-l3",
    level: 3,
    title: "Sorpasso, distanza, autostrada e gallerie",
    summary: "Manovre di sorpasso, spazio di sicurezza e regole autostradali.",
    content:
      "Sorpasso vietato con striscia continua. Distanza: almeno 2 secondi fuori città. Autostrada: corsia emergenza solo per guasti. Galleria: luci accese, distanza maggiore, no inversione.",
    footballExample:
      "Come non tagliare la corsia dell'avversario in dribbling, non invadere la corsia opposta senza spazio.",
    quiz: [
      q(
        "Quando è vietato sorpassare?",
        ["Con striscia continua", "Di giorno", "Con clacson", "In discesa leggera"],
        0,
        "Continua = no sorpasso."
      ),
      q(
        "In galleria è obbligatorio…",
        ["Accendere le luci", "Spegnere luci", "Fermarsi", "Usare abbaglianti"],
        0,
        "Visibilità in ambiente chiuso."
      ),
    ],
    exercise: {
      title: "Conta i secondi",
      instructions: "In macchina (fermo o passeggero) conta «mille due» tra due punti fissi per stimare 2 secondi di distanza.",
    },
    xpReward: 80,
  },
  {
    id: "pat-l4",
    level: 4,
    title: "Emergenze, assicurazione e documenti",
    summary: "Primo soccorso stradale, RCA e documenti obbligatori.",
    content:
      "112 = emergenze EU. Triangolo a 50 m extraurbano. RCA obbligatoria. A bordo: patente, libretto, assicurazione. Revisione periodica obbligatoria.",
    footballExample:
      "Come il medico di squadra in campo, in strada il soccorso va chiamato subito e in sicurezza.",
    quiz: [
      q(
        "Numero emergenze europeo?",
        ["112", "118", "113", "115"],
        0,
        "112 unifica polizia, ambulanza, vigili."
      ),
      q(
        "Cosa copre la RCA?",
        ["Danni a terzi", "Solo furto", "Multe", "Danni propri auto"],
        0,
        "Responsabilità civile verso altri."
      ),
    ],
    exercise: {
      title: "Check documenti",
      instructions: "Verifica (o simula) di avere patente, libretto e assicurazione validi prima di guidare.",
    },
    xpReward: 90,
  },
  {
    id: "pat-l5",
    level: 5,
    title: "Guida ecologica, alcool, droghe e manutenzione",
    summary: "Guida responsabile, limiti alcol e controlli veicolo.",
    content:
      "Guida eco: anticipare, gomme gonfie, marce basse in città. Alcool: 0,5 g/l (zero neopatentati). Droghe vietate. Pneumatici min 1,6 mm. Controlla luci, liquidi, freni.",
    footballExample:
      "Un atleta controlla scarpe e idratazione: il conducente controlla gomme e luci.",
    quiz: [
      q(
        "Limite alcol conducenti ordinari?",
        ["0,5 g/l", "1,0 g/l", "Zero per tutti", "0,1 g/l"],
        0,
        "Neopatentati: zero tolleranza."
      ),
      q(
        "Battistrada minimo legale?",
        ["1,6 mm", "0,5 mm", "3 mm obbligatori", "10 mm"],
        0,
        "Sotto 1,6 mm = non a norma."
      ),
    ],
    exercise: {
      title: "Simulazione finale",
      instructions: "Completa la simulazione d'esame da 30 domande dalla pagina Patente.",
    },
    xpReward: 100,
  },
];

export const PATENTE_ACADEMY_COURSE: Course = {
  id: "patente-academy",
  slug: "patente-academy",
  title: "Academy Patente",
  description:
    "Percorso in 5 livelli su tutti gli argomenti ministeriali: dalla segnaletica alla simulazione d'esame.",
  icon: "🎓",
  gradient: "from-orange-500 via-amber-600 to-red-700",
  levels: [
    { level: 1, title: "Patente Livello 1", description: "Segnali di pericolo, obbligo e divieto" },
    { level: 2, title: "Patente Livello 2", description: "Precedenze, incroci e velocità" },
    { level: 3, title: "Patente Livello 3", description: "Sorpasso, distanza, autostrada, gallerie" },
    { level: 4, title: "Patente Livello 4", description: "Emergenze, assicurazione, documenti" },
    { level: 5, title: "Patente Livello 5", description: "Guida eco, alcool, droghe, manutenzione" },
  ],
  lessons: PATENTE_ACADEMY_LESSONS,
  badges: PATENTE_ACADEMY_BADGES,
};
