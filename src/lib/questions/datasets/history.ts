export const timelineEvents: { year: number; event: string; era: string; person?: string }[] = [
  { year: -2560, event: "Piramidi di Giza", era: "Egizi" },
  { year: -776, event: "Primi Giochi Olimpici greci", era: "Greci" },
  { year: -509, event: "Nascita della Repubblica romana", era: "Romani" },
  { year: -1184, event: "Guerra di Troia (tradizione)", era: "Greci" },
  { year: -49, event: "Cesare attraversa il Rubicone", era: "Romani", person: "Giulio Cesare" },
  { year: 27, event: "Augusto imperatore", era: "Romani", person: "Augusto" },
  { year: 476, event: "Caduta dell'Impero romano d'Occidente", era: "Medioevo" },
  { year: 800, event: "Incoronazione di Carlo Magno", era: "Medioevo", person: "Carlo Magno" },
  { year: 1453, event: "Caduta di Costantinopoli", era: "Medioevo" },
  { year: 1492, event: "Scoperta dell'America da Colombo", era: "Età moderna", person: "Cristoforo Colombo" },
  { year: 1517, event: "95 tesi di Lutero", era: "Età moderna", person: "Martin Lutero" },
  { year: 1789, event: "Presa della Bastiglia", era: "Età moderna" },
  { year: 1815, event: "Congresso di Vienna", era: "Età moderna" },
  { year: 1861, event: "Proclamazione Regno d'Italia", era: "Risorgimento" },
  { year: 1914, event: "Inizio Prima guerra mondiale", era: "Guerre mondiali" },
  { year: 1939, event: "Inizio Seconda guerra mondiale", era: "Guerre mondiali" },
  { year: 1945, event: "Fine Seconda guerra mondiale", era: "Guerre mondiali" },
  { year: 1969, event: "Sbarco sulla Luna", era: "Età contemporanea", person: "Neil Armstrong" },
];

export const historyFacts: {
  q: string;
  a: string;
  wrong: string[];
  topic: string;
  diff: "facile" | "media" | "difficile";
}[] = [
  { q: "Chi costruì le piramidi?", a: "Gli antichi Egizi", wrong: ["I Romani", "I Greci", "I Maya"], topic: "Egizi", diff: "facile" },
  { q: "Dove nacque la democrazia?", a: "Atene", wrong: ["Roma", "Sparta", "Cartagine"], topic: "Greci", diff: "media" },
  { q: "Chi fu Giulio Cesare?", a: "Condottiero e dittatore romano", wrong: ["Faraone", "Re greco", "Papa"], topic: "Romani", diff: "facile" },
  { q: "Cosa significa 'Risorgimento'?", a: "Unità d'Italia nel XIX secolo", wrong: ["Rinascimento artistico", "Caduta di Roma", "Guerra fredda"], topic: "Risorgimento", diff: "media" },
  { q: "Chi era Garibaldi?", a: "Eroe del Risorgimento italiano", wrong: ["Pittore rinascimentale", "Faraone", "Re di Francia"], topic: "Risorgimento", diff: "facile" },
  { q: "Cosa furono le Crociate?", a: "Spedizioni medievali in Terrasanta", wrong: ["Guerre mondiali", "Olimpiadi", "Viaggi di Colombo"], topic: "Medioevo", diff: "media" },
  { q: "Chi era Cleopatra?", a: "Regina d'Egitto", wrong: ["Imperatrice romana", "Dea greca", "Saga vichinga"], topic: "Egizi", diff: "facile" },
  { q: "Dove si trovava il Colosseo?", a: "Roma", wrong: ["Atene", "Parigi", "Cartagine"], topic: "Romani", diff: "facile" },
  { q: "Chi fu Napoleone Bonaparte?", a: "Imperatore francese", wrong: ["Papa medievale", "Faraone", "Re inglese"], topic: "Età moderna", diff: "facile" },
  { q: "Chi scrisse la Divina Commedia?", a: "Dante Alighieri", wrong: ["Petrarca", "Boccaccio", "Omero"], topic: "Medioevo", diff: "media" },
  { q: "Chi fu Mussolini?", a: "Leader del fascismo italiano", wrong: ["Pittore rinascimentale", "Faraone", "Re spagnolo"], topic: "Età contemporanea", diff: "media" },
  { q: "Cosa fu il Muro di Berlino?", a: "Barriera durante la Guerra fredda", wrong: ["Muro romano", "Piramide", "Castello medievale"], topic: "Età contemporanea", diff: "media" },
];

export const historicalFigures: { name: string; role: string; wrong: string[]; era: string }[] = [
  { name: "Leonardo da Vinci", role: "Artista e inventore rinascimentale", wrong: ["Imperatore romano", "Faraone", "Esploratore vichingo"], era: "Rinascimento" },
  { name: "Galileo Galilei", role: "Scienziato italiano", wrong: ["Pittore egizio", "Re francese", "Condottiero medievale"], era: "Età moderna" },
  { name: "Winston Churchill", role: "Primo ministro britannico in WWII", wrong: ["Faraone", "Papa", "Calciatore"], era: "Guerre mondiali" },
  { name: "Martin Luther King", role: "Leader diritti civili USA", wrong: ["Imperatore romano", "Faraone", "Esploratore"], era: "Età contemporanea" },
];
