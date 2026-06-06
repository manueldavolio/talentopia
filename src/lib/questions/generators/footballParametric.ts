import { buildMcq, pickRandom } from "@/lib/questions/generator";
import { footballFacts, footballQuickFacts } from "@/lib/questions/datasets/football";
import { isRepetitiveFootballQuestion } from "@/lib/questions/generators/footballFilters";
import type { Question } from "@/types";

const SUBJECT = "Calcio";

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MODULI = ["3-5-2", "4-3-3", "4-4-2", "4-2-3-1", "5-3-2", "3-4-3"];
const TORNEI = ["Champions League", "Serie A", "Mondiali", "Europei", "Europa League"];
const RUOLI = ["mediano", "trequartista", "ala", "difensore centrale", "terzino", "regista"];
const STORICI = [
  { q: "Quale nazionale ha vinto i Mondiali 2006?", a: "Italia", w: ["Brasile", "Francia", "Germania"], topic: "storia calcio" },
  { q: "In che città si giocò la finale dei Mondiali 1990?", a: "Roma", w: ["Milano", "Torino", "Napoli"], topic: "storia calcio" },
  { q: "Chi è soprannominato «Re Pelé»?", a: "Pelé, attaccante brasiliano", w: ["Maradona", "Cruyff", "Beckenbauer"], topic: "storia calcio" },
  { q: "Quale torneo europeo per club è il più prestigioso?", a: "Champions League (ex Coppa Campioni)", w: ["Conference League", "Supercoppa italiana", "Coppa del Mondo per club"], topic: "competizioni" },
  { q: "Cosa indica la Coppa del Mondo FIFA?", a: "Torneo mondiale tra nazionali ogni 4 anni", w: ["Campionato solo europeo", "Torneo per club", "Amichevole estiva"], topic: "competizioni" },
];
const ARBITRO = [
  { q: "Quando l'arbitro fischia un calcio di punizione indiretta?", a: "Per infrazioni non punibili con rigore", w: ["Per ogni fallo", "Per fuorigioco", "Per corner"], topic: "arbitro" },
  { q: "Cosa fa l'arbitro di porta?", a: "Aiuta su gol, rigori e fuori area", w: ["Sostituisce il portiere", "Decide i cambi", "Segna i gol"], topic: "arbitro" },
  { q: "Quando si può riprendere il gioco dopo un fuorigioco?", a: "Con punizione indiretta per la squadra in difesa", w: ["Con rigore", "Con corner", "Con rinvio dal fondo"], topic: "arbitro" },
];
const TECNICA = [
  { q: "Cosa significa «controllo orientato»?", a: "Ricevere e girare la palla verso lo spazio utile", w: ["Colpire di testa", "Parare un rigore", "Fare fallo tattico"], topic: "tecnica individuale" },
  { q: "Un «tunnel» (nutmeg) consiste nel:", a: "Passare la palla tra le gambe dell'avversario", w: ["Tirare sopra la traversa", "Fare un'autorete", "Simulare un fallo"], topic: "tecnica individuale" },
  { q: "Il «controllo di petto» serve a:", a: "Fermare una palla alta e preparare il gesto successivo", w: ["Parare con le mani", "Segnare di testa", "Fischare l'arbitro"], topic: "tecnica individuale" },
];

const ALL_FACTS = [...footballFacts, ...footballQuickFacts];

function genFromFact(): Question {
  const f = pickRandom(ALL_FACTS);
  const explanationShort =
    "explanationShort" in f && f.explanationShort
      ? f.explanationShort
      : `Regola chiave: ${f.a}.`;
  const curiosity =
    "curiosity" in f && f.curiosity
      ? f.curiosity
      : `Curiosità (${f.topic}): ${f.a}.`;
  const memoryTip =
    "memoryTip" in f && f.memoryTip
      ? f.memoryTip
      : `Ricorda: ${f.a}.`;
  const meta = { explanationShort, curiosity, memoryTip };
  const style = ri(0, 4);
  if (style === 0) {
    return buildMcq(
      "calcio",
      SUBJECT,
      f.topic,
      f.diff,
      f.q,
      f.a,
      f.wrong,
      explanationShort,
      meta
    );
  }
  if (style === 1) {
    const wrong = pickRandom(f.wrong);
    return buildMcq(
      "calcio",
      SUBJECT,
      f.topic,
      f.diff,
      `Su «${f.topic}», quale affermazione è falsa?`,
      wrong,
      [f.a, f.wrong.find((w) => w !== wrong) ?? f.a, "Tutte vere"],
      `Corretto: ${f.a}.`,
      meta
    );
  }
  if (style === 2) {
    return buildMcq(
      "calcio",
      SUBJECT,
      f.topic,
      f.diff,
      `Tema ${f.topic}: ${f.q}`,
      f.a,
      f.wrong,
      explanationShort,
      meta
    );
  }
  if (style === 3) {
    return buildMcq(
      "calcio",
      SUBJECT,
      f.topic,
      f.diff,
      `Risposta corretta per: ${f.q}`,
      f.a,
      f.wrong,
      explanationShort,
      meta
    );
  }
  return buildMcq(
    "calcio",
    SUBJECT,
    f.topic,
    f.diff,
    `Calcio — ${f.topic}: ${f.q}`,
    f.a,
    f.wrong,
    explanationShort,
    meta
  );
}

/** Pesi: più regolamento/ruoli/tattica, meno scenari situazionali */
const WEIGHTS = [
  { fn: () => genFromFact(), w: 28 },
  { fn: () => genModulo(), w: 10 },
  { fn: () => genRuolo(), w: 14 },
  { fn: () => genRegolamento(), w: 12 },
  { fn: () => genVar(), w: 10 },
  { fn: () => genTorneo(), w: 10 },
  { fn: () => genStorico(), w: 10 },
  { fn: () => genArbitro(), w: 10 },
  { fn: () => genTecnica(), w: 10 },
  { fn: () => genFuorigioco(), w: 8 },
  { fn: () => genCartellini(), w: 6 },
  { fn: () => genPressing(), w: 6 },
  { fn: () => genTatticaVaria(), w: 8 },
  { fn: () => genScenarioRaro(), w: 2 },
];

function genModulo(): Question {
  const mod = pickRandom(MODULI);
  const sum = mod.split("-").reduce((a, b) => a + Number(b), 0);
  const alt = pickRandom(MODULI.filter((m) => m !== mod));
  const altSum = alt.split("-").reduce((a, b) => a + Number(b), 0);
  const variant = ri(0, 2);
  const questions = [
    `Squadra schierata in ${mod}: quanti giocatori di movimento (senza portiere)?`,
    `Modulo ${mod}: totale fuori dal portiere?`,
    `In ${mod}, somma difesa-centrocampo-attacco (senza portiere)?`,
  ];
  return buildMcq(
    "calcio",
    SUBJECT,
    "moduli",
    "media",
    questions[variant],
    String(sum),
    [String(sum + 1), String(Math.max(6, sum - 1)), String(altSum)],
    `Nel ${mod} la somma ${mod.replace(/-/g, "+")} = ${sum}.`,
    {
      curiosity: `Il modulo ${mod} compare spesso in ${pickRandom(TORNEI)}.`,
      memoryTip: "Somma i tre numeri del modulo.",
    }
  );
}

function genRuolo(): Question {
  const ruolo = pickRandom(RUOLI);
  const compiti: Record<string, string> = {
    mediano: "Proteggere la difesa e ripartire",
    trequartista: "Collegare centrocampo e attacco",
    ala: "Allargare il gioco e crossare o tagliare",
    "difensore centrale": "Marcare e anticipare in area",
    terzino: "Coprire la fascia e supportare l'attacco",
    regista: "Dettare ritmo e distribuire",
  };
  return buildMcq(
    "calcio",
    SUBJECT,
    "ruoli",
    "media",
    `Compito principale del ${ruolo}:`,
    compiti[ruolo],
    ["Segnare almeno 2 gol a partita", "Parare rigori", "Arbitrare la partita"],
    `Il ${ruolo} ha funzioni tattiche specifiche.`,
    {
      curiosity: `${ruolo} può cambiare interpretazione tra moduli diversi.`,
      memoryTip: "Collega il nome del ruolo al compito principale.",
    }
  );
}

function genRegolamento(): Question {
  const items = [
    {
      q: "Quanti giocatori minimo deve avere una squadra in campo?",
      a: "7 (incluso portiere)",
      w: ["5", "9", "11 obbligatori sempre"],
    },
    {
      q: "Distanza minima avversari su rinvio dal fondo del portiere?",
      a: "Fuori dall'area di rigore",
      w: ["Metà campo", "Area piccola", "Solo area grande"],
    },
    {
      q: "Quante sostituzioni sono comuni nelle competizioni FIFA attuali?",
      a: "Fino a 5 giocatori in molte competizioni",
      w: ["Solo 1", "Illimitate", "Nessuna"],
    },
  ];
  const item = pickRandom(items);
  return buildMcq("calcio", SUBJECT, "regolamento", "media", item.q, item.a, item.w, item.a, {
    curiosity: "Il regolamento IFAB si aggiorna ogni anno.",
    memoryTip: "Elimina opzioni che violano regole base FIFA.",
  });
}

function genVar(): Question {
  const items = [
    {
      q: "Il VAR può intervenire su un fallo in area non visto in diretta?",
      a: "Sì, per errori chiari e gravi su rigore/rosso/gol",
      w: ["No, mai", "Solo su corner", "Solo su fuorigioco"],
    },
    {
      q: "Su quali situazioni interviene tipicamente il VAR?",
      a: "Gol, rigori, espulsioni dirette, identità sanzionato",
      w: ["Ogni fallo", "Solo sostituzioni", "Solo corner"],
    },
  ];
  const item = pickRandom(items);
  return buildMcq("calcio", SUBJECT, "VAR", "difficile", item.q, item.a, item.w, item.a, {
    curiosity: "Il protocollo VAR distingue check automatici e review on-field.",
    memoryTip: "VAR = gol, rigore, rosso, identità.",
  });
}

function genTorneo(): Question {
  const torneo = pickRandom(TORNEI);
  return buildMcq(
    "calcio",
    SUBJECT,
    "competizioni",
    "media",
    `Cosa distingue ${torneo} da un campionato nazionale?`,
    torneo.includes("Mondiali") || torneo.includes("Europei")
      ? "Torneo tra nazionali con regolamento proprio"
      : "Torneo tra club con fasi a gironi o eliminazione",
    ["Solo amichevoli", "Senza arbitro", "Senza regolamento"],
    `${torneo} ha formato e regole specifiche.`,
    {
      curiosity: `${torneo} ha criteri propri su spareggi e qualificazioni.`,
      memoryTip: "Nazionali vs club: due mondi diversi.",
    }
  );
}

function genStorico(): Question {
  const s = pickRandom(STORICI);
  return buildMcq("calcio", SUBJECT, s.topic, "media", s.q, s.a, s.w, s.a, {
    curiosity: "La storia del calcio collega tornei, icone e regole.",
    memoryTip: "Ripassa date e tornei famosi.",
  });
}

function genArbitro(): Question {
  const a = pickRandom(ARBITRO);
  return buildMcq("calcio", SUBJECT, a.topic, "media", a.q, a.a, a.w, a.a, {
    curiosity: "L'arbitro coordina anche il tempo di recupero.",
    memoryTip: "Arbitro = regole e sicurezza in campo.",
  });
}

function genTecnica(): Question {
  const t = pickRandom(TECNICA);
  return buildMcq("calcio", SUBJECT, t.topic, "facile", t.q, t.a, t.w, t.a, {
    curiosity: "La tecnica individuale si allenano fin da giovanili.",
    memoryTip: "Ogni gesto ha un nome preciso.",
  });
}

function genFuorigioco(): Question {
  return buildMcq(
    "calcio",
    SUBJECT,
    "regolamento",
    "difficile",
    "Da calcio d'angolo battuto corto: può esserci fuorigioco al ricezione?",
    "No, da angolo non si può essere fuorigioco",
    ["Sì, sempre", "Solo in area", "Solo se segna"],
    "Da angolo, rimessa e punizione propria non c'è fuorigioco.",
    {
      curiosity: "Eccezioni al fuorigioco evitano sanzioni su rimesse fisse.",
      memoryTip: "Angolo/rimessa/punizione propria = no fuorigioco.",
    }
  );
}

function genCartellini(): Question {
  const n = ri(2, 4);
  return buildMcq(
    "calcio",
    SUBJECT,
    "cartellini",
    "difficile",
    `${n} falli tattici in pochi minuti: cosa rischia il giocatore?`,
    "Ammonizione o espulsione se già ammonito",
    ["Rigore automatico", "Gol annullato", "Corner obbligatorio"],
    "Falli ripetuti portano cartellini.",
    {
      curiosity: "L'arbitro può richiamare verbalmente prima del giallo.",
      memoryTip: "Falli tattici ripetuti → cartellino.",
    }
  );
}

function genPressing(): Question {
  return buildMcq(
    "calcio",
    SUBJECT,
    "pressing",
    "media",
    "Pressing a uomo sul regista avversario: obiettivo principale?",
    "Impedire la costruzione e forzare errore",
    ["Far correre solo il portiere", "Ottenere corner automatico", "Segnare rigore"],
    "Il pressing a uomo segue un giocatore chiave.",
    {
      curiosity: "Guardiola e Klopp hanno popularizzato pressing e gegenpressing.",
      memoryTip: "Pressing a uomo = segui un giocatore, non una zona.",
    }
  );
}

function genTatticaVaria(): Question {
  const items = [
    {
      q: "Cos'è il «contropiede»?",
      a: "Transizione rapida dopo recupero palla",
      w: ["Possesso lento", "Solo calci piazzati", "Difesa passiva"],
    },
    {
      q: "Cos'è la «linea alta» difensiva?",
      a: "Difensori posizionati vicino al centrocampo",
      w: ["Portiere fuori area", "Solo tre difensori", "Nessun pressing"],
    },
    {
      q: "Cosa significa «ampiezza» in attacco?",
      a: "Usare le fasce per allargare il campo",
      w: ["Giocare solo al centro", "Tenere tutti in area", "Non passare"],
    },
  ];
  const item = pickRandom(items);
  return buildMcq("calcio", SUBJECT, "tattica", "media", item.q, item.a, item.w, item.a, {
    curiosity: "I moduli moderni enfatizzano transizioni e superiorità numerica.",
    memoryTip: "Tattica = dove e come si muove la squadra.",
  });
}

/** Scenario raro e vario — niente pattern minuto/avversario chiuso */
function genScenarioRaro(): Question {
  const items = [
    {
      q: "Espulsione del difensore centrale: quale adattamento è più logico?",
      a: "Passare a modulo più compatto (es. 5-3-1)",
      w: ["Togliere il portiere", "Giocare senza centrocampo", "Mettere 4 attaccanti puri"],
    },
    {
      q: "Superiorità numerica 3 contro 2 sulle fasce: cosa sfrutta la squadra?",
      a: "Ampiezza e sovrapposizioni per cross o taglio",
      w: ["Possesso lento al centro", "Rinvii lunghi solo", "Perdere tempo"],
    },
    {
      q: "Rigore in finale: cosa studia spesso il portiere?",
      a: "Abitudini del tiratore su angolo e potenza",
      w: ["Il modulo avversario", "Il fuorigioco", "Il recupero"],
    },
  ];
  const item = pickRandom(items);
  return buildMcq("calcio", SUBJECT, "tattica", "difficile", item.q, item.a, item.w, item.a, {
    curiosity: "Le scelte tattiche dipendono dal contesto, non da formule fisse.",
    memoryTip: "Leggi modulo, spazi e risultato — non solo il minuto.",
  });
}

function pickWeighted(): Question {
  const total = WEIGHTS.reduce((s, x) => s + x.w, 0);
  let r = Math.random() * total;
  for (const entry of WEIGHTS) {
    r -= entry.w;
    if (r <= 0) return entry.fn();
  }
  return WEIGHTS[0].fn();
}

export function generateParametricFootballQuestion(): Question {
  let guard = 0;
  while (guard < 40) {
    guard++;
    const q = pickWeighted();
    if (!isRepetitiveFootballQuestion(q.question)) return q;
  }
  return genRegolamento();
}

export function generateParametricFootballBatch(count: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  const maxGuard = count * 120;
  while (out.length < count && guard < maxGuard) {
    guard++;
    const q = generateParametricFootballQuestion();
    const key = q.question.trim().toLowerCase();
    if (seen.has(key)) continue;
    if (isRepetitiveFootballQuestion(q.question)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
