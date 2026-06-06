import { PATENTE_TOPICS, type PatenteTopic } from "./constants";
import type { TopicStat } from "./progress";

export interface PatenteStudyStats {
  strongTopics: { topic: PatenteTopic; accuracy: number; total: number }[];
  weakTopics: { topic: PatenteTopic; accuracy: number; total: number }[];
  suggestions: string[];
  overallAccuracy: number;
}

const TOPIC_SUGGESTIONS: Record<PatenteTopic, string> = {
  "segnali di pericolo":
    "Ripassa i triangoli rossi: forma, colore e significato di ogni segnale.",
  "segnali di obbligo":
    "I segnali di obbligo sono rotondi e blu: impara a riconoscerli a colpo d'occhio.",
  "segnali di divieto":
    "Cerchio rosso con barra = divieto. Associa ogni simbolo al comportamento vietato.",
  precedenze:
    "Studia stop, dare precedenza e incroci equivalenti con schemi disegnati.",
  incroci:
    "Esercitati con incroci a T, rotonde e strade principali/secondarie.",
  velocità:
    "Memorizza i limiti per tipo di strada: 50, 90, 110, 130 km/h.",
  sorpasso:
    "Ricorda: sorpasso vietato con striscia continua e in curva senza visibilità.",
  "distanza di sicurezza":
    "Regola pratica: almeno 1 secondo in città, 2 secondi fuori città.",
  autostrada:
    "Ripassa corsia di emergenza, sosta e velocità minima in autostrada.",
  gallerie:
    "In galleria: luci accese, distanza aumentata, divieto inversione e sosta.",
  emergenze:
    "Triangolo a 50 m, giubbotto e numeri utili: 112, 118, soccorso stradale.",
  assicurazione:
    "Confronta RCA obbligatoria, franchigia e massimali con esempi concreti.",
  documenti:
    "Patente, libretto, assicurazione e revisione: scadenze e sanzioni.",
  "guida ecologica":
    "Anticipa, cambia marcia presto, evita accelerazioni brusche.",
  "alcool e droghe":
    "Zero alcool per neopatentati; tasso 0,5 g/l per gli altri (0 g/l sotto 21 anni).",
  "manutenzione veicolo":
    "Controlla pneumatici, luci, liquidi e freni prima di ogni viaggio lungo.",
};

function accuracy(stat: TopicStat | undefined): number {
  if (!stat || stat.total === 0) return 0;
  return stat.correct / stat.total;
}

export function computePatenteStats(
  topicStats: Record<string, TopicStat>
): PatenteStudyStats {
  const ranked = PATENTE_TOPICS.map((topic) => {
    const stat = topicStats[topic];
    return {
      topic,
      accuracy: Math.round(accuracy(stat) * 100),
      total: stat?.total ?? 0,
    };
  }).filter((r) => r.total > 0);

  const sorted = [...ranked].sort((a, b) => b.accuracy - a.accuracy);
  const strongTopics = sorted.filter((r) => r.accuracy >= 70).slice(0, 5);
  const weakTopics = [...ranked]
    .filter((r) => r.total > 0 && r.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  const totalCorrect = ranked.reduce((s, r) => {
    const stat = topicStats[r.topic];
    return s + (stat?.correct ?? 0);
  }, 0);
  const totalAnswered = ranked.reduce((s, r) => s + r.total, 0);
  const overallAccuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const suggestions: string[] = [];
  for (const weak of weakTopics.slice(0, 3)) {
    suggestions.push(TOPIC_SUGGESTIONS[weak.topic]);
  }
  if (suggestions.length === 0 && totalAnswered === 0) {
    suggestions.push(
      "Inizia con il Quiz patente ufficiale per raccogliere statistiche sugli argomenti."
    );
  } else if (suggestions.length === 0) {
    suggestions.push("Ottimo lavoro! Prova la simulazione d'esame da 30 domande.");
  }

  return { strongTopics, weakTopics, suggestions, overallAccuracy };
}
