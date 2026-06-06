import { buildMcq, pickRandom } from "@/lib/questions/generator";
import { fantaFacts, fantaScenarios, roles } from "@/lib/questions/datasets/fantasyFootball";
import type { Question } from "@/types";

const SUBJECT = "Fantacalcio";

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MODULI = ["3-4-3", "3-5-2", "4-3-3", "4-4-2", "4-2-3-1"];

export function generateParametricFantasyQuestion(): Question {
  const kind = ri(0, 8);
  const budget = ri(280, 520);
  const crediti = ri(1, 80);
  const mod = pickRandom(MODULI);
  const role = pickRandom(roles);

  switch (kind) {
    case 0: {
      const s = pickRandom(fantaScenarios);
      return buildMcq(
        "fantacalcio",
        SUBJECT,
        "scenari",
        "difficile",
        s.q,
        s.a,
        s.wrong,
        `Fantacalcio: ${s.a}.`,
        {
          curiosity: "Formazione e sostituzioni cambiano i voti della giornata.",
          memoryTip: "Leggi infortuni e squalifiche prima del ballottaggio.",
        }
      );
    }
    case 1:
      return buildMcq(
        "fantacalcio",
        SUBJECT,
        "asta",
        "media",
        `In asta con budget ${budget} crediti, spendere ${crediti} su un solo top player comporta:`,
        "Meno crediti per completare la rosa",
        [
          "Più crediti automatici",
          "Esclusione dal campionato",
          "Voto fisso 10 a tutti",
        ],
        `Budget limitato: ${crediti} crediti su un giocatore riducono il resto.`,
        {
          curiosity: "Le aste classiche hanno budget totale da distribuire.",
          memoryTip: "Budget − spesa = crediti rimasti.",
        }
      );
    case 2:
      return buildMcq(
        "fantacalcio",
        SUBJECT,
        "modificatore difesa",
        "difficile",
        `Modulo ${mod}: il modificatore difesa di solito premia:`,
        "Portiere e difensori che non subiscono gol",
        [
          "Solo gli attaccanti",
          "Solo i cartellini",
          "Solo i rigori sbagliati",
        ],
        "Modificatore difesa legato a porta inviolata e voti della linea difensiva.",
        {
          curiosity: "Il modificatore varia tra leghe classiche e Mantra.",
          memoryTip: "Difesa stretta → bonus modificatore.",
        }
      );
    case 3:
      return buildMcq(
        "fantacalcio",
        SUBJECT,
        "bonus",
        "media",
        `Bonus gol (+3/+4) si applica tipicamente a:`,
        "Gol segnati da attaccanti/centrocampisti (regolamento lega)",
        [
          "Solo autogol",
          "Solo ammonizioni",
          "Solo falli laterali",
        ],
        "Il bonus gol premia le reti, con valori definiti dal regolamento.",
        {
          curiosity: "Alcune leghe danno +4 al centravanti o ai difensori in porta inviolata.",
          memoryTip: "Gol segnato → controlla tabella bonus della lega.",
        }
      );
    case 4:
      return buildMcq(
        "fantacalcio",
        SUBJECT,
        "malus",
        "media",
        `Malus autogol di solito:`,
        "Sottrae punti al giocatore che lo subisce",
        ["Aggiunge +5", "Annulla la giornata", "Raddoppia il capitano"],
        "Autogol è tra i malus più pesanti del fantacalcio.",
        {
          curiosity: "Alcuni regolamenti malusano anche rigori parati dal proprio portiere.",
          memoryTip: "Autogol = punti negativi.",
        }
      );
    case 5:
      return buildMcq(
        "fantacalcio",
        SUBJECT,
        "capitano",
        "facile",
        `Il capitano in classica di solito:`,
        "Moltiplica i suoi punti (es. ×2)",
        ["Non conta", "Elimina l'avversario", "Cambia modulo in campo"],
        "Il capitano raddoppia (o aumenta) l'impatto del voto.",
        {
          curiosity: "Il vice capitano entra se il capitano non gioca.",
          memoryTip: "Capitano = moltiplicatore punti.",
        }
      );
    case 6:
      return buildMcq(
        "fantacalcio",
        SUBJECT,
        "rigoristi",
        "media",
        `Scegliere un rigorista di squadra in ${mod} aiuta perché:`,
        "Può portare gol e bonus anche con poco gioco",
        [
          "Non riceve mai malus",
          "Gioca sempre 90 minuti garantiti",
          "Non ha voti",
        ],
        "I rigoristi sono spesso bersagli utili per gol e bonus.",
        {
          curiosity: "Lista rigoristi va aggiornata se cambia in partita.",
          memoryTip: "Rigorista = potenziale gol + bonus.",
        }
      );
    case 7:
      return buildMcq(
        "fantacalcio",
        SUBJECT,
        "ballottaggi",
        "difficile",
        `Ballottaggio tra due ${role} con dubbio di titolarità: cosa conviene?`,
        "Valutare forma, avversario e minuti attesi",
        [
          "Scegliere sempre il più costoso",
          "Ignorare le probabili formazioni",
          "Schierare entrambi in porta",
        ],
        "Nei ballottaggi contano indiscrezioni e ruolo in campo.",
        {
          curiosity: "Siti e formazioni probabili aiutano nelle ultime ore.",
          memoryTip: "Titolarità probabile > solo nome famoso.",
        }
      );
    default: {
      const f = pickRandom(fantaFacts);
      return buildMcq(
        "fantacalcio",
        SUBJECT,
        f.topic,
        f.diff,
        f.q,
        f.a,
        f.wrong,
        `${f.topic}: ${f.a}.`,
        {
          curiosity: `Regolamento fanta: ${f.topic}.`,
          memoryTip: `${f.topic} → ${f.a}.`,
        }
      );
    }
  }
}

export function generateParametricFantasyBatch(count: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 200) {
    guard++;
    const q = generateParametricFantasyQuestion();
    const key = q.question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
