import { buildMcq, pickRandom } from "@/lib/questions/generator";
import {
  days,
  etreAvoir,
  months,
  numbers,
  presentIndicatif,
  simplePhrases,
  translations,
  vocabulary,
} from "@/lib/questions/datasets/french";
import type { Question } from "@/types";

const SUBJECT = "Francese";

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const NAMES = ["Marie", "Lucas", "Emma", "Paul", "Léa", "Hugo"];
const PLACES = ["Paris", "Lyon", "Marseille", "Rome", "école", "parc"];

export function generateParametricFrenchQuestion(): Question {
  const kind = ri(0, 15);
  const name = pickRandom(NAMES);
  const place = pickRandom(PLACES);

  switch (kind) {
    case 0:
    case 1: {
      const v = pickRandom(vocabulary);
      const wrongIt = vocabulary
        .filter((x) => x.it !== v.it)
        .map((x) => x.it.split(" / ")[0])
        .slice(0, 3);
      return buildMcq(
        "francese",
        SUBJECT,
        v.topic,
        "media",
        `Come si traduce «${v.fr}»?`,
        v.it.split(" / ")[0],
        wrongIt.length >= 3 ? wrongIt : v.wrong,
        `«${v.fr}» = ${v.it}.`,
        {
          curiosity: "Ripeti la parola in una frase per fissarla.",
          memoryTip: `${v.fr} → ${v.it.split(" / ")[0]}.`,
        }
      );
    }
    case 2: {
      const e = pickRandom(etreAvoir);
      return buildMcq(
        "francese",
        SUBJECT,
        e.topic,
        "media",
        e.sentence,
        e.correct,
        e.wrong,
        `Risposta: ${e.correct}.`,
        {
          curiosity: "Être e avoir sono irregolari al presente.",
          memoryTip: "Controlla il pronome prima del verbo.",
        }
      );
    }
    case 3: {
      const p = pickRandom(presentIndicatif);
      return buildMcq(
        "francese",
        SUBJECT,
        p.topic,
        "media",
        p.sentence,
        p.correct,
        p.wrong,
        `Presente: ${p.correct}.`,
        {
          curiosity: "I verbi -er, -ir, -re hanno desinenze diverse.",
          memoryTip: "Trova il soggetto, poi la desinenza.",
        }
      );
    }
    case 4: {
      const n = pickRandom(numbers);
      return buildMcq(
        "francese",
        SUBJECT,
        "numeri",
        "facile",
        `Traduci in italiano: «${n.fr}»`,
        n.it,
        n.wrong,
        `${n.fr} = ${n.it}.`,
        {
          curiosity: "I numeri compaiono spesso in compiti di matematica in francese.",
          memoryTip: "Impara i numeri a coppie.",
        }
      );
    }
    case 5: {
      const d = pickRandom(days);
      return buildMcq(
        "francese",
        SUBJECT,
        "giorni",
        "facile",
        `«${d.fr}» significa:`,
        d.it,
        d.wrong,
        `${d.fr} = ${d.it}.`,
        {
          curiosity: "Lundi è il primo giorno lavorativo in Francia.",
          memoryTip: "Ordina i giorni a memoria.",
        }
      );
    }
    case 6: {
      const m = pickRandom(months);
      return buildMcq(
        "francese",
        SUBJECT,
        "mesi",
        "facile",
        `Il mese «${m.fr}» in italiano:`,
        m.it,
        m.wrong,
        `${m.fr} = ${m.it}.`,
        {
          curiosity: "Mars (marzo) ricorda il pianeta Marte.",
          memoryTip: "Molti mesi suonano simili all'italiano.",
        }
      );
    }
    case 7: {
      const s = pickRandom(simplePhrases);
      return buildMcq(
        "francese",
        SUBJECT,
        "frasi semplici",
        "media",
        `Traduzione di «${s.fr}»:`,
        s.it,
        s.wrong,
        `«${s.fr}» = ${s.it}.`,
        {
          curiosity: "Usa queste frasi per conversazioni base.",
          memoryTip: "Ripeti la frase intera ad alta voce.",
        }
      );
    }
    case 8: {
      const t = pickRandom(translations);
      return buildMcq(
        "francese",
        SUBJECT,
        t.topic,
        "media",
        `«${t.fr}» in italiano:`,
        t.it,
        t.wrong,
        `${t.fr} → ${t.it}.`,
        {
          curiosity: "Tradurre frasi intere aiuta più che singole parole.",
          memoryTip: "Cerca il verbo principale prima.",
        }
      );
    }
    case 9: {
      const age = ri(8, 16);
      return buildMcq(
        "francese",
        SUBJECT,
        "frasi semplici",
        "media",
        `${name} a ${age} ans. Come si dice in italiano?`,
        `${name} ha ${age} anni`,
        [`${name} ha ${age + 2} anni`, `${name} va a scuola`, `${name} ha fame`],
        `«avoir X ans» = avere X anni.`,
        {
          curiosity: "In francese si «ha» l'età, non si «è».",
          memoryTip: "J'ai ... ans = ho ... anni.",
        }
      );
    }
    case 10: {
      const v = pickRandom(vocabulary);
      const wrongFr = vocabulary.filter((x) => x.fr !== v.fr).map((x) => x.fr).slice(0, 3);
      return buildMcq(
        "francese",
        SUBJECT,
        "traduzione italiano-francese",
        "media",
        `Traduci in francese: «${v.it.split(" / ")[0]}»`,
        v.fr,
        wrongFr.length >= 3 ? wrongFr : v.wrong,
        `${v.it} → ${v.fr}.`,
        { curiosity: "Ripeti ad alta voce.", memoryTip: `${v.fr} = ${v.it.split(" / ")[0]}.` }
      );
    }
    case 11: {
      const n = ri(1, 12);
      const frNum = pickRandom(numbers);
      return buildMcq(
        "francese",
        SUBJECT,
        "numeri",
        "facile",
        `Quale numero francese corrisponde a «${frNum.it}»?`,
        frNum.fr,
        frNum.wrong,
        `${frNum.it} = ${frNum.fr}.`,
        { curiosity: "I numeri si imparano a gruppi.", memoryTip: "Associa suono e scrittura." }
      );
    }
    case 12: {
      const d = pickRandom(days);
      const wrongFr = days.filter((x) => x.fr !== d.fr).map((x) => x.fr).slice(0, 3);
      return buildMcq(
        "francese",
        SUBJECT,
        "giorni",
        "facile",
        `Come si dice «${d.it}» in francese?`,
        d.fr,
        wrongFr,
        `${d.it} = ${d.fr}.`,
        { curiosity: "I giorni sono minuscoli.", memoryTip: "Ripeti la settimana in ordine." }
      );
    }
    case 13: {
      const m = pickRandom(months);
      const wrongFr = months.filter((x) => x.fr !== m.fr).map((x) => x.fr).slice(0, 3);
      return buildMcq(
        "francese",
        SUBJECT,
        "mesi",
        "facile",
        `«${m.it}» in francese:`,
        m.fr,
        wrongFr,
        `${m.it} = ${m.fr}.`,
        { curiosity: "Molti mesi suonano simili.", memoryTip: "Gennaio-janvier." }
      );
    }
    case 14: {
      const p = pickRandom(presentIndicatif);
      return buildMcq(
        "francese",
        SUBJECT,
        p.topic,
        "media",
        `Presente: ${p.sentence}`,
        p.correct,
        p.wrong,
        `Corretto: ${p.correct}.`,
        { curiosity: "Identifica il soggetto.", memoryTip: "Je/tu/il/nous..." }
      );
    }
    case 15: {
      const s = pickRandom(simplePhrases);
      const wrongFr = simplePhrases.filter((x) => x.fr !== s.fr).map((x) => x.fr).slice(0, 3);
      return buildMcq(
        "francese",
        SUBJECT,
        "frasi semplici",
        "media",
        `Traduci: «${s.fr}»`,
        s.it,
        s.wrong,
        `${s.fr} = ${s.it}.`,
        { curiosity: "Frasi utili per conversare.", memoryTip: "Impara frasi intere." }
      );
    }
    default: {
      const v = pickRandom(vocabulary);
      return buildMcq(
        "francese",
        SUBJECT,
        v.topic,
        "media",
        `«${v.fr}» significa:`,
        v.it.split(" / ")[0],
        v.wrong,
        `${v.fr} = ${v.it}.`,
        {
          curiosity: "Contesto aiuta la memoria.",
          memoryTip: `${v.fr} ↔ ${v.it.split(" / ")[0]}.`,
        }
      );
    }
  }
}

export function generateParametricFrenchBatch(count: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 80) {
    guard++;
    const q = generateParametricFrenchQuestion();
    const key = q.question.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
