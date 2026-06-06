import { buildMcq, pickRandom } from "@/lib/questions/generator";
import {
  capitals,
  italianProvinces,
  italianRegions,
  mountains,
  rivers,
} from "@/lib/questions/datasets/geography";
import type { Question } from "@/types";

const SUBJECT = "Geografia";

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateParametricGeographyQuestion(): Question {
  const kind = ri(0, 6);
  switch (kind) {
    case 0: {
      const c = pickRandom(capitals);
      return buildMcq(
        "geografia",
        SUBJECT,
        "capitali",
        "facile",
        `Capitale di ${c.country}: quale città è corretta?`,
        c.capital,
        c.wrong,
        `${c.capital} è la capitale di ${c.country}.`,
        {
          curiosity: `${c.country} ha anche altre città importanti oltre alla capitale.`,
          memoryTip: `Ripeti: ${c.country} → ${c.capital}.`,
        }
      );
    }
    case 1: {
      const r = pickRandom(rivers);
      const wrong = rivers
        .filter((x) => x.name !== r.name)
        .map((x) => x.country)
        .slice(0, 3);
      return buildMcq(
        "geografia",
        SUBJECT,
        "fiumi",
        "media",
        `Il fiume ${r.name} attraversa principalmente quale stato/area?`,
        r.country,
        wrong,
        `${r.name} scorre in ${r.country}.`,
        {
          curiosity: "I fiumi segnano confini naturali e rotte commerciali storiche.",
          memoryTip: "Collega nome fiume e stato principale.",
        }
      );
    }
    case 2: {
      const m = pickRandom(mountains);
      const wrong = mountains
        .filter((x) => x.name !== m.name)
        .map((x) => x.range)
        .slice(0, 3);
      return buildMcq(
        "geografia",
        SUBJECT,
        "monti",
        "media",
        `A quale catena appartiene ${m.name} (altezza ${m.height})?`,
        m.range,
        wrong,
        `${m.name} è nella catena ${m.range}.`,
        {
          curiosity: "Catene montuose influenzano clima e confini regionali.",
          memoryTip: "Montagna → catena o stato ospite.",
        }
      );
    }
    case 3: {
      const reg = pickRandom(italianRegions);
      const wrong = italianRegions
        .filter((x) => x.region !== reg.region)
        .map((x) => x.capital)
        .slice(0, 3);
      return buildMcq(
        "geografia",
        SUBJECT,
        "regioni italiane",
        "media",
        `Capoluogo della regione ${reg.region}?`,
        reg.capital,
        wrong,
        `${reg.capital} è capoluogo di ${reg.region}.`,
        {
          curiosity: "L'Italia ha 20 regioni a statuto ordinario o speciale.",
          memoryTip: "Regione → capoluogo amministrativo.",
        }
      );
    }
    case 4: {
      const p = pickRandom(italianProvinces);
      const wrong = italianProvinces
        .filter((x) => x.province !== p.province)
        .map((x) => x.city)
        .slice(0, 3);
      return buildMcq(
        "geografia",
        SUBJECT,
        "province",
        "media",
        `Quale città è capoluogo della provincia di ${p.province}?`,
        p.city,
        wrong,
        `${p.city} è capoluogo di ${p.province}.`,
        {
          curiosity: "Le province organizzano servizi su scala intermedia.",
          memoryTip: "Provincia e capoluogo vanno memorizzati a coppie.",
        }
      );
    }
    case 5: {
      const km = ri(120, 890);
      return buildMcq(
        "geografia",
        SUBJECT,
        "economia",
        "difficile",
        `Un treno merci percorre ${km} km in Italia: quale regione attraversa spesso il Brennero verso nord?`,
        "Trentino-Alto Adige / confine alpino",
        ["Sicilia", "Sardegna", "Puglia"],
        "Il Brennero collega Italia e Austria nel Nord-Est.",
        {
          curiosity: "Il Brennero è uno dei valichi alpini più trafficati.",
          memoryTip: "Brennero = Nord-Est, non isole.",
        }
      );
    }
    default: {
      const a = pickRandom(capitals);
      const b = pickRandom(capitals.filter((x) => x.country !== a.country));
      return buildMcq(
        "geografia",
        SUBJECT,
        "confini",
        "difficile",
        `Tra ${a.country} e ${b.country}, quale affermazione è più plausibile geograficamente?`,
        "Possono essere confinanti o separati da altri stati europei",
        [
          `${a.country} è un'isola nel Pacifico vicino a ${b.country}`,
          "Non esistono vie di collegamento terrestre in Europa",
          "Hanno la stessa capitale",
        ],
        "In Europa molti stati condividono frontiere terrestri o sono vicini.",
        {
          curiosity: "L'UE ha abolito molti controlli alle frontiere interne.",
          memoryTip: "Usa la mappa mentale dell'Europa, non ipotesi assurde.",
        }
      );
    }
  }
}

export function generateParametricGeographyBatch(count: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 80) {
    guard++;
    const q = generateParametricGeographyQuestion();
    const key = q.question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
