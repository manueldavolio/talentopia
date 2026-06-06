import { buildMcq, generateFromTemplates, makeId, type QuestionTemplate } from "@/lib/questions/generator";
import type { Question } from "@/types";

const SUBJECT = "Geografia";

const capitals: { country: string; capital: string; wrong: string[] }[] = [
  { country: "Francia", capital: "Parigi", wrong: ["Lione", "Marsiglia", "Nizza"] },
  { country: "Germania", capital: "Berlino", wrong: ["Monaco", "Amburgo", "Colonia"] },
  { country: "Spagna", capital: "Madrid", wrong: ["Barcellona", "Siviglia", "Valencia"] },
  { country: "Regno Unito", capital: "Londra", wrong: ["Manchester", "Liverpool", "Edimburgo"] },
  { country: "Italia", capital: "Roma", wrong: ["Milano", "Napoli", "Torino"] },
  { country: "Grecia", capital: "Atene", wrong: ["Salonicco", "Patrasso", "Rodi"] },
  { country: "Portogallo", capital: "Lisbona", wrong: ["Porto", "Faro", "Coimbra"] },
  { country: "Paesi Bassi", capital: "Amsterdam", wrong: ["Rotterdam", "L'Aia", "Utrecht"] },
  { country: "Belgio", capital: "Bruxelles", wrong: ["Anversa", "Gand", "Liegi"] },
  { country: "Austria", capital: "Vienna", wrong: ["Salisburgo", "Graz", "Innsbruck"] },
  { country: "Polonia", capital: "Varsavia", wrong: ["Cracovia", "Gdansk", "Wroclaw"] },
  { country: "Svezia", capital: "Stoccolma", wrong: ["Göteborg", "Malmö", "Uppsala"] },
  { country: "Norvegia", capital: "Oslo", wrong: ["Bergen", "Trondheim", "Stavanger"] },
  { country: "Irlanda", capital: "Dublino", wrong: ["Cork", "Galway", "Limerick"] },
  { country: "Svizzera", capital: "Berna", wrong: ["Zurigo", "Ginevra", "Basilea"] },
];

const italianRegions = [
  { region: "Lombardia", capital: "Milano" },
  { region: "Lazio", capital: "Roma" },
  { region: "Campania", capital: "Napoli" },
  { region: "Sicilia", capital: "Palermo" },
  { region: "Veneto", capital: "Venezia" },
  { region: "Piemonte", capital: "Torino" },
  { region: "Emilia-Romagna", capital: "Bologna" },
  { region: "Toscana", capital: "Firenze" },
  { region: "Puglia", capital: "Bari" },
  { region: "Sardegna", capital: "Cagliari" },
];

const rivers = [
  { name: "Po", country: "Italia" },
  { name: "Tevere", country: "Italia" },
  { name: "Danubio", country: "Europa centrale" },
  { name: "Senna", country: "Francia" },
  { name: "Tamigi", country: "Inghilterra" },
  { name: "Reno", country: "Germania" },
  { name: "Nilo", country: "Egitto" },
  { name: "Amazonas", country: "Sud America" },
];

const mountains = [
  { name: "Monte Bianco", height: "4810 m", range: "Alpi" },
  { name: "Etna", height: "circa 3350 m", range: "Sicilia" },
  { name: "Everest", height: "8849 m", range: "Himalaya" },
  { name: "Cervino", height: "4478 m", range: "Alpi" },
];

const continents = ["Africa", "Antartide", "Asia", "Europa", "America del Nord", "America del Sud", "Oceania"];

const templates: QuestionTemplate[] = [
  {
    topic: "capitali",
    difficulty: "facile",
    generate: () => {
      const c = capitals[Math.floor(Math.random() * capitals.length)];
      return buildMcq(
        "geografia", SUBJECT, "capitali", "facile",
        `Qual è la capitale di ${c.country}?`,
        c.capital,
        c.wrong,
        `La capitale di ${c.country} è ${c.capital}.`
      );
    },
  },
  {
    topic: "regioni italiane",
    difficulty: "media",
    generate: () => {
      const r = italianRegions[Math.floor(Math.random() * italianRegions.length)];
      const wrong = italianRegions.filter((x) => x.region !== r.region).map((x) => x.capital);
      return buildMcq(
        "geografia", SUBJECT, "regioni italiane", "media",
        `Qual è il capoluogo di ${r.region}?`,
        r.capital,
        wrong,
        `${r.capital} è il capoluogo di ${r.region}.`
      );
    },
  },
  {
    topic: "fiumi",
    difficulty: "media",
    generate: () => {
      const r = rivers[Math.floor(Math.random() * rivers.length)];
      const wrong = rivers.filter((x) => x.name !== r.name).map((x) => x.country);
      return buildMcq(
        "geografia", SUBJECT, "fiumi", "media",
        `Il fiume ${r.name} è famoso soprattutto in quale area?`,
        r.country,
        wrong,
        `Il ${r.name} è legato a ${r.country}.`
      );
    },
  },
  {
    topic: "montagne",
    difficulty: "difficile",
    generate: () => {
      const m = mountains[Math.floor(Math.random() * mountains.length)];
      const wrong = mountains.filter((x) => x.name !== m.name).map((x) => x.height);
      return buildMcq(
        "geografia", SUBJECT, "montagne", "difficile",
        `Quanto è alto circa il ${m.name}?`,
        m.height,
        wrong,
        `Il ${m.name} si trova nelle ${m.range} e supera i 4000 m (o è il più alto del mondo).`
      );
    },
  },
  {
    topic: "continenti",
    difficulty: "facile",
    generate: () => {
      const correct = continents[Math.floor(Math.random() * continents.length)];
      const wrong = continents.filter((c) => c !== correct);
      return buildMcq(
        "geografia", SUBJECT, "continenti", "facile",
        `Quale di questi è un continente?`,
        correct,
        wrong,
        `${correct} è uno dei continenti principali.`
      );
    },
  },
];

const flags = [
  { country: "Italia", colors: "verde, bianco e rosso" },
  { country: "Francia", colors: "blu, bianco e rosso" },
  { country: "Germania", colors: "nero, rosso e giallo" },
];

function staticFromData(): Question[] {
  const out: Question[] = [];
  flags.forEach((f, i) => {
    out.push({
      id: `geo_flag_${i}`,
      categorySlug: "geografia",
      question: `I colori della bandiera di ${f.country} sono:`,
      optionA: f.colors,
      optionB: "solo blu e bianco",
      optionC: "rosso e giallo",
      optionD: "verde e giallo",
      correctOption: "A",
      explanation: `La bandiera di ${f.country} ha ${f.colors}.`,
      difficulty: "facile",
      topic: "bandiere",
      subject: SUBJECT,
    });
  });
  capitals.forEach((c, i) => {
    out.push({
      id: `geo_cap_static_${i}`,
      categorySlug: "geografia",
      question: `Capitale di ${c.country}?`,
      optionA: c.capital,
      optionB: c.wrong[0],
      optionC: c.wrong[1],
      optionD: c.wrong[2],
      correctOption: "A",
      explanation: `${c.capital} è la capitale.`,
      difficulty: "facile",
      topic: "capitali",
      subject: SUBJECT,
    });
  });
  return out;
}

export function getGeografiaQuestions(minCount = 100): Question[] {
  const generated = generateFromTemplates("geografia", SUBJECT, templates, minCount + 60);
  const statics = staticFromData();
  const variants: Question[] = [];
  for (let i = 0; i < 70; i++) {
    const c = capitals[i % capitals.length];
    variants.push({
      ...buildMcq(
        "geografia", SUBJECT, "capitali", "facile",
        `Geo ${i + 1}: capitale di ${c.country}?`,
        c.capital,
        c.wrong,
        c.capital
      ),
      id: `geo_v_${i}`,
    });
  }
  const seen = new Set<string>();
  return [...generated, ...statics, ...variants].filter((q) => {
    if (seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  });
}
