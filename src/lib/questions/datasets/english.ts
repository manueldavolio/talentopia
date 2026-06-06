export const vocabulary: {
  en: string;
  it: string;
  wrong: string[];
  topic: string;
}[] = [
  { en: "dog", it: "cane", wrong: ["gatto", "uccello", "pesce"], topic: "vocaboli" },
  { en: "cat", it: "gatto", wrong: ["cane", "topo", "coniglio"], topic: "vocaboli" },
  { en: "house", it: "casa", wrong: ["scuola", "strada", "albero"], topic: "vocaboli" },
  { en: "school", it: "scuola", wrong: ["ospedale", "negozio", "parco"], topic: "vocaboli" },
  { en: "book", it: "libro", wrong: ["quaderno", "penna", "banco"], topic: "vocaboli" },
  { en: "water", it: "acqua", wrong: ["latte", "succo", "vino"], topic: "vocaboli" },
  { en: "mother", it: "madre", wrong: ["padre", "sorella", "nonna"], topic: "vocaboli" },
  { en: "father", it: "padre", wrong: ["madre", "zio", "cugino"], topic: "vocaboli" },
  { en: "happy", it: "felice", wrong: ["triste", "arrabbiato", "stanco"], topic: "vocaboli" },
  { en: "big", it: "grande", wrong: ["piccolo", "alto", "lungo"], topic: "vocaboli" },
  { en: "football", it: "calcio", wrong: ["basket", "tennis", "nuoto"], topic: "vocaboli sportivi" },
  { en: "ball", it: "palla", wrong: ["rete", "porta", "campo"], topic: "vocaboli sportivi" },
  { en: "team", it: "squadra", wrong: ["giocatore", "allenatore", "arbitro"], topic: "vocaboli sportivi" },
  { en: "run", it: "correre", wrong: ["saltare", "camminare", "nuotare"], topic: "verbi" },
  { en: "eat", it: "mangiare", wrong: ["bere", "dormire", "giocare"], topic: "verbi" },
  { en: "write", it: "scrivere", wrong: ["leggere", "disegnare", "cantare"], topic: "verbi" },
  { en: "go", it: "andare", wrong: ["venire", "restare", "tornare"], topic: "verbi" },
  { en: "children", it: "bambini", wrong: ["bambino", "adulti", "ragazzi"], topic: "plurali" },
  { en: "mice", it: "topi", wrong: ["topo", "gatti", "cani"], topic: "plurali" },
  { en: "feet", it: "piedi", wrong: ["piede", "mani", "gambe"], topic: "plurali" },
  { en: "teeth", it: "denti", wrong: ["dente", "occhi", "orecchie"], topic: "plurali" },
  { en: "the", it: "articolo determinativo", wrong: ["un", "una", "preposizione"], topic: "articoli" },
  { en: "an", it: "articolo indeterminativo (vocale)", wrong: ["the", "verbo", "avverbio"], topic: "articoli" },
  { en: "a", it: "articolo indeterminativo", wrong: ["the", "an", "due"], topic: "articoli" },
];

export const irregularVerbs: { base: string; past: string; wrong: string[] }[] = [
  { base: "go", past: "went", wrong: ["goed", "gone", "going"] },
  { base: "see", past: "saw", wrong: ["seed", "seen", "seeing"] },
  { base: "eat", past: "ate", wrong: ["eated", "eaten", "eating"] },
  { base: "have", past: "had", wrong: ["haved", "has", "having"] },
  { base: "do", past: "did", wrong: ["doed", "done", "doing"] },
];

export const presentSimple: { sentence: string; correct: string; wrong: string[] }[] = [
  { sentence: "He ___ to school every day.", correct: "goes", wrong: ["go", "going", "gone"] },
  { sentence: "They ___ football on Sundays.", correct: "play", wrong: ["plays", "playing", "played"] },
  { sentence: "She ___ English very well.", correct: "speaks", wrong: ["speak", "speaking", "spoke"] },
  { sentence: "I ___ pizza (like).", correct: "like", wrong: ["likes", "liking", "liked"] },
  { sentence: "We ___ in Rome (live).", correct: "live", wrong: ["lives", "living", "lived"] },
];

export const presentContinuous: { sentence: string; correct: string; wrong: string[] }[] = [
  { sentence: "I ___ now (study).", correct: "am studying", wrong: ["study", "studied", "studies"] },
  { sentence: "We ___ TV (watch).", correct: "are watching", wrong: ["watch", "watches", "watched"] },
  { sentence: "She ___ a book (read).", correct: "is reading", wrong: ["reads", "read", "reading"] },
];

export const fillInBlanks: { sentence: string; correct: string; wrong: string[]; topic: string }[] = [
  { sentence: "My name ___ Marco.", correct: "is", wrong: ["are", "am", "be"], topic: "frasi da completare" },
  { sentence: "There ___ two cats.", correct: "are", wrong: ["is", "am", "be"], topic: "frasi da completare" },
  { sentence: "I ___ twelve years old.", correct: "am", wrong: ["is", "are", "be"], topic: "frasi da completare" },
  { sentence: "She ___ from London.", correct: "is", wrong: ["are", "am", "be"], topic: "frasi da completare" },
];
