import {
  buildMcq,
  generateFromTemplates,
  makeId,
  pickRandom,
  type QuestionTemplate,
} from "@/lib/questions/generator";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import {
  footballFacts,
  footballQuickFacts,
} from "@/lib/questions/datasets/football";
import { generateParametricFootballBatch } from "@/lib/questions/generators/footballParametric";
import { filterFootballQuestions } from "@/lib/questions/generators/footballFilters";
import type { Difficulty, Question } from "@/types";

const SUBJECT = "Calcio";

function factToQuestion(
  f: (typeof footballFacts)[0],
  id: string
): Question {
  const q = buildMcq(
    "calcio",
    SUBJECT,
    f.topic,
    f.diff,
    f.q,
    f.a,
    f.wrong,
    f.explanationShort,
    {
      explanationShort: f.explanationShort,
      curiosity: f.curiosity,
      memoryTip: f.memoryTip,
    }
  );
  return { ...q, id };
}

export function getFootballTemplates(): QuestionTemplate[] {
  const mods = ["3-5-2", "4-3-3", "4-4-2", "4-2-3-1", "5-3-2", "3-4-3"];
  const topics = [
    "fuorigioco",
    "rigore",
    "angolo",
    "cartellini",
    "VAR",
    "pressing",
    "contropiede",
    "Serie A",
    "Mondiali",
  ];

  const templates: QuestionTemplate[] = [
    {
      topic: "moduli",
      difficulty: "difficile",
      generate: () => {
        const mod = pickRandom(mods);
        const parts = mod.split("-").map(Number);
        const total = parts.reduce((a, b) => a + b, 0);
        const wrongMods = [
          ...new Set(
            mods
              .filter((m) => m !== mod)
              .map((m) => String(m.split("-").reduce((a, b) => a + Number(b), 0)))
          ),
        ];
        while (wrongMods.length < 3) {
          wrongMods.push(String(total + wrongMods.length + 1));
        }
        return buildMcq(
          "calcio",
          SUBJECT,
          "moduli",
          "difficile",
          `Nel modulo ${mod}, quanti giocatori di movimento (senza portiere) ci sono in campo?`,
          String(total),
          wrongMods,
          `Somma ${mod}: ${total} giocatori di movimento oltre al portiere.`,
          {
            curiosity: `Il ${mod} è usato in Serie A e in Champions con interpretazioni diverse.`,
            memoryTip: "Somma i tre numeri del modulo per il totale fuori porta.",
          }
        );
      },
    },
    {
      topic: "fuorigioco",
      difficulty: "difficile",
      generate: () => {
        const variants = [
          {
            q: "Un attaccante è in fuorigioco se, al passaggio, è oltre quale riferimento?",
            a: "Palla e penultimo avversario",
            w: ["Solo il portiere", "Il centrocampo", "La linea del centrocampo"],
          },
          {
            q: "Il fuorigioco si fischia quando l'attaccante riceve la palla da?",
            a: "Da un compagno in posizione irregolare al momento del tocco del passante",
            w: [
              "Da un avversario",
              "Da un calcio d'angolo battuto corto",
              "Da una rimessa del portiere avversario",
            ],
          },
        ];
        const v = pickRandom(variants);
        return buildMcq(
          "calcio",
          SUBJECT,
          "fuorigioco",
          "difficile",
          v.q,
          v.a,
          v.w,
          "Il fuorigioco si valuta al momento del passaggio del compagno.",
          {
            curiosity: "Il semi-automatico offside usa tracciamento per ridurre errori.",
            memoryTip: "Passaggio + penultimo avversario = formula base.",
          }
        );
      },
    },
    {
      topic: "regolamento",
      difficulty: "media",
      generate: () => {
        const qf = pickRandom(footballQuickFacts);
        return buildMcq(
          "calcio",
          SUBJECT,
          qf.topic,
          qf.diff,
          qf.q,
          qf.a,
          qf.wrong,
          `Regola chiave: ${qf.a}.`,
          {
            curiosity: "Il regolamento IFAB si aggiorna ogni anno a febbraio.",
            memoryTip: "Elimina le opzioni che violano una regola base FIFA.",
          }
        );
      },
    },
    {
      topic: "tattica",
      difficulty: "media",
      generate: () => {
        const t = pickRandom(topics);
        const q = `Quale descrizione è corretta per il tema «${t}» nel calcio moderno?`;
        const answers: Record<string, { a: string; w: string[] }> = {
          fuorigioco: {
            a: "Regola che limita il vantaggio posizionale in attacco",
            w: ["Regola solo sui rigori", "Vietato in Champions", "Solo per i portieri"],
          },
          rigore: {
            a: "Punizione da dischetto per falli certi in area",
            w: ["Si batte dal centrocampo", "Vale doppio gol", "Solo su corner"],
          },
          angolo: {
            a: "Calcio piazzato dall'archetto dopo uscita palla sulla fondo",
            w: ["Si batte a metà campo", "Sostituisce il rigore", "Solo difesa"],
          },
          cartellini: {
            a: "Giallo ammonisce, rosso espelle",
            w: ["Giallo espelle subito", "Rosso è solo avviso", "Non esistono"],
          },
          VAR: {
            a: "Supporto video per errori chiari e gravi",
            w: ["Sostituisce l'arbitro", "Solo per fuorigioco", "Decide i rigori al sorteggio"],
          },
          pressing: {
            a: "Recupero palla con pressione organizzata",
            w: ["Solo difesa passiva", "Vietato in Serie A", "Solo contropiede"],
          },
          contropiede: {
            a: "Transizione rapida dopo recupero",
            w: ["Possesso lento", "Solo calci piazzati", "Modulo difensivo"],
          },
          "Serie A": {
            a: "Massimo campionato italiano a 20 squadre",
            w: ["Torneo europeo per club", "Coppa mondiale per nazionali", "Campionato inglese"],
          },
          Mondiali: {
            a: "Torneo FIFA ogni quattro anni tra nazionali",
            w: ["Torneo solo europeo", "Si gioca ogni anno", "Solo per club"],
          },
        };
        const data = answers[t] ?? answers.fuorigioco;
        return buildMcq("calcio", SUBJECT, t, "media", q, data.a, data.w, data.a, {
          curiosity: `Il calcio a 11 regola anche ${t} in modo preciso.`,
          memoryTip: `Collega «${t}» a una regola o torneo reale, non a un gioco inventato.`,
        });
      },
    },
    {
      topic: "4-3-3",
      difficulty: "media",
      generate: () => {
        return buildMcq(
          "calcio",
          SUBJECT,
          "moduli",
          "media",
          "In un 4-3-3 classico, quanti centrocampisti centrali ci sono di solito nel «3»?",
          "Un regista/centrale e due mezzali (variante comune)",
          [
            "Nessuno, solo attaccanti",
            "Cinque mediani",
            "Solo due portieri",
          ],
          "Il trio centrale può essere 1+2 o tre box-to-box a seconda del modulo.",
          {
            curiosity: "Il 4-3-3 del Barcellona usava spesso un falso nueve al posto del centravanti.",
            memoryTip: "4-3-3: 4 difesa, 3 centrocampo, 3 attacco.",
          }
        );
      },
    },
    {
      topic: "portiere",
      difficulty: "difficile",
      generate: () => {
        const items = [
          {
            q: "Il portiere può tenere la palla in mano quanto tempo massimo (circa)?",
            a: "Circa 6 secondi dalla presa in mano",
            w: ["30 secondi", "1 minuto", "Illimitato"],
          },
          {
            q: "Su punizione indiretta in area, quando può entrare il portiere?",
            a: "Quando la palla è in gioco e non è ancora toccata due volte",
            w: ["Subito alla battuta", "Mai", "Solo dopo gol"],
          },
        ];
        const item = pickRandom(items);
        return buildMcq(
          "calcio",
          SUBJECT,
          "regolamento",
          "difficile",
          item.q,
          item.a,
          item.w,
          item.a,
          {
            curiosity: "Il portiere è l'unico che può toccare con le mani in area propria.",
            memoryTip: "Portiere = regole speciali su tempo e rinvii.",
          }
        );
      },
    },
  ];

  return templates;
}

function staticFacts(): Question[] {
  return footballFacts.map((f, i) => factToQuestion(f, `calcio_fact_${i}`));
}

export function generateFootballQuestions(count: number): Question[] {
  const statics = staticFacts();
  const templates = generateFromTemplates(
    "calcio",
    SUBJECT,
    getFootballTemplates(),
    Math.min(80, count)
  );
  const parametric = generateParametricFootballBatch(Math.max(count, 800));
  const merged = filterFootballQuestions(
    filterQualityQuestions([...statics, ...templates, ...parametric])
  );
  return finalizeQuestions(merged, count);
}

export function generateOneFootballQuestion(difficulty?: Difficulty): Question {
  const pool = filterFootballQuestions(
    filterQualityQuestions([
      ...staticFacts(),
      ...getFootballTemplates().map((t) => t.generate()),
      generateParametricFootballBatch(5),
    ].flat())
  );
  const filtered = difficulty
    ? pool.filter((q) => q.difficulty === difficulty)
    : pool;
  const pick = filtered.length > 0 ? filtered : pool;
  const q = pick[Math.floor(Math.random() * pick.length)];
  return { ...q, id: makeId("calcio") };
}
