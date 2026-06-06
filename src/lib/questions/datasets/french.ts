export const vocabulary: {
  fr: string;
  it: string;
  wrong: string[];
  topic: string;
}[] = [
  { fr: "bonjour", it: "ciao / buongiorno", wrong: ["arrivederci", "grazie", "per favore"], topic: "vocaboli base" },
  { fr: "salut", it: "ciao", wrong: ["buonanotte", "scusa", "prego"], topic: "vocaboli base" },
  { fr: "merci", it: "grazie", wrong: ["prego", "scusa", "ciao"], topic: "vocaboli base" },
  { fr: "au revoir", it: "arrivederci", wrong: ["ciao", "buongiorno", "grazie"], topic: "vocaboli base" },
  { fr: "oui", it: "sì", wrong: ["no", "forse", "mai"], topic: "vocaboli base" },
  { fr: "non", it: "no", wrong: ["sì", "sempre", "tutto"], topic: "vocaboli base" },
  { fr: "chien", it: "cane", wrong: ["gatto", "uccello", "pesce"], topic: "vocaboli base" },
  { fr: "chat", it: "gatto", wrong: ["cane", "topo", "coniglio"], topic: "vocaboli base" },
  { fr: "maison", it: "casa", wrong: ["scuola", "strada", "albero"], topic: "vocaboli base" },
  { fr: "école", it: "scuola", wrong: ["ospedale", "negozio", "parco"], topic: "scuola" },
  { fr: "livre", it: "libro", wrong: ["quaderno", "penna", "banco"], topic: "scuola" },
  { fr: "crayon", it: "matita", wrong: ["penna", "gomma", "riga"], topic: "scuola" },
  { fr: "eau", it: "acqua", wrong: ["latte", "succo", "vino"], topic: "cibo" },
  { fr: "pain", it: "pane", wrong: ["formaggio", "carne", "frutta"], topic: "cibo" },
  { fr: "pomme", it: "mela", wrong: ["pera", "banana", "arancia"], topic: "cibo" },
  { fr: "football", it: "calcio", wrong: ["basket", "tennis", "nuoto"], topic: "sport" },
  { fr: "ballon", it: "palla", wrong: ["rete", "porta", "campo"], topic: "sport" },
  { fr: "équipe", it: "squadra", wrong: ["giocatore", "allenatore", "arbitro"], topic: "sport" },
  { fr: "mère", it: "madre", wrong: ["padre", "sorella", "nonna"], topic: "famiglia" },
  { fr: "père", it: "padre", wrong: ["madre", "zio", "cugino"], topic: "famiglia" },
  { fr: "frère", it: "fratello", wrong: ["sorella", "cugino", "zio"], topic: "famiglia" },
  { fr: "sœur", it: "sorella", wrong: ["fratello", "cugina", "zia"], topic: "famiglia" },
  { fr: "le", it: "articolo determinativo maschile singolare", wrong: ["la", "les", "un"], topic: "articoli" },
  { fr: "la", it: "articolo determinativo femminile singolare", wrong: ["le", "un", "des"], topic: "articoli" },
  { fr: "les", it: "articolo determinativo plurale", wrong: ["le", "la", "un"], topic: "articoli" },
  { fr: "un", it: "articolo indeterminativo maschile", wrong: ["une", "le", "des"], topic: "articoli" },
  { fr: "une", it: "articolo indeterminativo femminile", wrong: ["un", "la", "le"], topic: "articoli" },
  { fr: "je", it: "io", wrong: ["tu", "lui", "noi"], topic: "pronomi" },
  { fr: "tu", it: "tu", wrong: ["io", "lui", "voi"], topic: "pronomi" },
  { fr: "il", it: "lui", wrong: ["io", "tu", "lei"], topic: "pronomi" },
  { fr: "elle", it: "lei", wrong: ["lui", "noi", "loro"], topic: "pronomi" },
  { fr: "nous", it: "noi", wrong: ["voi", "loro", "tu"], topic: "pronomi" },
  { fr: "vous", it: "voi (formale o plurale)", wrong: ["noi", "tu", "loro"], topic: "pronomi" },
  { fr: "ils", it: "loro (maschile)", wrong: ["noi", "voi", "elle"], topic: "pronomi" },
  { fr: "bonsoir", it: "buonasera", wrong: ["buongiorno", "arrivederci", "grazie"], topic: "vocaboli base" },
  { fr: "s'il vous plaît", it: "per favore", wrong: ["grazie", "scusa", "prego"], topic: "vocaboli base" },
  { fr: "pardon", it: "scusa", wrong: ["grazie", "ciao", "arrivederci"], topic: "vocaboli base" },
  { fr: "fromage", it: "formaggio", wrong: ["pane", "carne", "frutta"], topic: "cibo" },
  { fr: "viande", it: "carne", wrong: ["pesce", "verdura", "pane"], topic: "cibo" },
  { fr: "poisson", it: "pesce", wrong: ["carne", "formaggio", "frutta"], topic: "cibo" },
  { fr: "lait", it: "latte", wrong: ["acqua", "succo", "vino"], topic: "cibo" },
  { fr: "orange", it: "arancia", wrong: ["mela", "pera", "banana"], topic: "cibo" },
  { fr: "banane", it: "banana", wrong: ["mela", "pera", "arancia"], topic: "cibo" },
  { fr: "grand", it: "grande", wrong: ["piccolo", "alto", "corto"], topic: "vocaboli base" },
  { fr: "petit", it: "piccolo", wrong: ["grande", "alto", "lungo"], topic: "vocaboli base" },
  { fr: "heureux", it: "felice", wrong: ["triste", "stanco", "arrabbiato"], topic: "vocaboli base" },
  { fr: "triste", it: "triste", wrong: ["felice", "stanco", "arrabbiato"], topic: "vocaboli base" },
  { fr: "professeur", it: "professore", wrong: ["studente", "medico", "poliziotto"], topic: "scuola" },
  { fr: "élève", it: "studente", wrong: ["professore", "direttore", "bidello"], topic: "scuola" },
  { fr: "classe", it: "classe (scolastica)", wrong: ["corridoio", "mensa", "palestra"], topic: "scuola" },
  { fr: "tennis", it: "tennis", wrong: ["calcio", "nuoto", "basket"], topic: "sport" },
  { fr: "natation", it: "nuoto", wrong: ["calcio", "tennis", "corsa"], topic: "sport" },
  { fr: "course", it: "corsa", wrong: ["nuoto", "salto", "lotta"], topic: "sport" },
  { fr: "grand-mère", it: "nonna", wrong: ["nonno", "zia", "cugina"], topic: "famiglia" },
  { fr: "grand-père", it: "nonno", wrong: ["nonna", "zio", "cugino"], topic: "famiglia" },
  { fr: "oncle", it: "zio", wrong: ["zia", "cugino", "fratello"], topic: "famiglia" },
  { fr: "tante", it: "zia", wrong: ["zio", "cugina", "sorella"], topic: "famiglia" },
  { fr: "des", it: "articolo indeterminativo plurale", wrong: ["les", "le", "la"], topic: "articoli" },
  { fr: "du", it: "di + il (partitivo maschile)", wrong: ["de la", "des", "le"], topic: "articoli" },
  { fr: "de la", it: "di + la (partitivo femminile)", wrong: ["du", "des", "un"], topic: "articoli" },
  { fr: "manger", it: "mangiare", wrong: ["bere", "dormire", "correre"], topic: "verbi" },
  { fr: "boire", it: "bere", wrong: ["mangiare", "dormire", "parlare"], topic: "verbi" },
  { fr: "dormir", it: "dormire", wrong: ["mangiare", "correre", "studiare"], topic: "verbi" },
  { fr: "parler", it: "parlare", wrong: ["ascoltare", "scrivere", "leggere"], topic: "verbi" },
  { fr: "écrire", it: "scrivere", wrong: ["leggere", "parlare", "cantare"], topic: "verbi" },
  { fr: "lire", it: "leggere", wrong: ["scrivere", "disegnare", "correre"], topic: "verbi" },
  { fr: "aimer", it: "amare / piacere", wrong: ["odiare", "dimenticare", "perdere"], topic: "verbi" },
  { fr: "regarder", it: "guardare", wrong: ["ascoltare", "toccare", "odorare"], topic: "verbi" },
  { fr: "écouter", it: "ascoltare", wrong: ["guardare", "parlare", "scrivere"], topic: "verbi" },
  { fr: "zéro", it: "zero", wrong: ["uno", "dieci", "cento"], topic: "numeri" },
  { fr: "quatre", it: "quattro", wrong: ["tre", "cinque", "sei"], topic: "numeri" },
  { fr: "six", it: "sei", wrong: ["cinque", "sette", "otto"], topic: "numeri" },
  { fr: "sept", it: "sette", wrong: ["sei", "otto", "nove"], topic: "numeri" },
  { fr: "huit", it: "otto", wrong: ["sette", "nove", "dieci"], topic: "numeri" },
  { fr: "neuf", it: "nove", wrong: ["otto", "dieci", "undici"], topic: "numeri" },
  { fr: "onze", it: "undici", wrong: ["dieci", "dodici", "tredici"], topic: "numeri" },
  { fr: "quinze", it: "quindici", wrong: ["quattordici", "sedici", "venti"], topic: "numeri" },
  { fr: "cent", it: "cento", wrong: ["dieci", "mille", "cinquanta"], topic: "numeri" },
];

export const etreAvoir: { sentence: string; correct: string; wrong: string[]; topic: string }[] = [
  { sentence: "Je ___ étudiant.", correct: "suis", wrong: ["es", "est", "sommes"], topic: "verbi essere e avere" },
  { sentence: "Tu ___ fatigué.", correct: "es", wrong: ["suis", "est", "êtes"], topic: "verbi essere e avere" },
  { sentence: "Il ___ professeur.", correct: "est", wrong: ["suis", "es", "sommes"], topic: "verbi essere e avere" },
  { sentence: "Nous ___ italiens.", correct: "sommes", wrong: ["êtes", "sont", "es"], topic: "verbi essere e avere" },
  { sentence: "J'___ faim.", correct: "ai", wrong: ["as", "a", "avons"], topic: "verbi essere e avere" },
  { sentence: "Tu ___ un livre.", correct: "as", wrong: ["ai", "a", "avez"], topic: "verbi essere e avere" },
  { sentence: "Elle ___ quinze ans.", correct: "a", wrong: ["ai", "as", "ont"], topic: "verbi essere e avere" },
  { sentence: "Nous ___ deux chats.", correct: "avons", wrong: ["avez", "ont", "as"], topic: "verbi essere e avere" },
];

export const presentIndicatif: { sentence: string; correct: string; wrong: string[]; topic: string }[] = [
  { sentence: "Je ___ au parc (aller).", correct: "vais", wrong: ["va", "allez", "allons"], topic: "presente indicativo" },
  { sentence: "Il ___ le français (parler).", correct: "parle", wrong: ["parles", "parlons", "parlez"], topic: "presente indicativo" },
  { sentence: "Nous ___ à l'école (habiter).", correct: "habitons", wrong: ["habite", "habites", "habitent"], topic: "presente indicativo" },
  { sentence: "Ils ___ du football (jouer).", correct: "jouent", wrong: ["joue", "joues", "jouons"], topic: "presente indicativo" },
  { sentence: "Tu ___ la télé (regarder).", correct: "regardes", wrong: ["regarde", "regardons", "regardent"], topic: "presente indicativo" },
];

export const numbers: { fr: string; it: string; wrong: string[] }[] = [
  { fr: "un", it: "uno", wrong: ["due", "tre", "zero"] },
  { fr: "deux", it: "due", wrong: ["tre", "quattro", "uno"] },
  { fr: "trois", it: "tre", wrong: ["due", "quattro", "cinque"] },
  { fr: "cinq", it: "cinque", wrong: ["quattro", "sei", "sette"] },
  { fr: "dix", it: "dieci", wrong: ["nove", "undici", "otto"] },
  { fr: "vingt", it: "venti", wrong: ["trenta", "quindici", "dodici"] },
];

export const days: { fr: string; it: string; wrong: string[] }[] = [
  { fr: "lundi", it: "lunedì", wrong: ["martedì", "domenica", "venerdì"] },
  { fr: "mardi", it: "martedì", wrong: ["lunedì", "mercoledì", "sabato"] },
  { fr: "mercredi", it: "mercoledì", wrong: ["giovedì", "martedì", "domenica"] },
  { fr: "jeudi", it: "giovedì", wrong: ["venerdì", "mercoledì", "lunedì"] },
  { fr: "vendredi", it: "venerdì", wrong: ["sabato", "giovedì", "martedì"] },
  { fr: "samedi", it: "sabato", wrong: ["domenica", "venerdì", "lunedì"] },
  { fr: "dimanche", it: "domenica", wrong: ["sabato", "lunedì", "venerdì"] },
];

export const months: { fr: string; it: string; wrong: string[] }[] = [
  { fr: "janvier", it: "gennaio", wrong: ["febbraio", "marzo", "dicembre"] },
  { fr: "février", it: "febbraio", wrong: ["gennaio", "marzo", "aprile"] },
  { fr: "mars", it: "marzo", wrong: ["aprile", "maggio", "febbraio"] },
  { fr: "avril", it: "aprile", wrong: ["maggio", "marzo", "giugno"] },
  { fr: "mai", it: "maggio", wrong: ["giugno", "aprile", "luglio"] },
  { fr: "juin", it: "giugno", wrong: ["luglio", "maggio", "agosto"] },
];

export const simplePhrases: { fr: string; it: string; wrong: string[] }[] = [
  { fr: "Comment ça va?", it: "Come stai?", wrong: ["Come ti chiami?", "Quanti anni hai?", "Dove abiti?"] },
  { fr: "Je m'appelle Marco.", it: "Mi chiamo Marco.", wrong: ["Ho fame", "Vado a scuola", "Arrivederci"] },
  { fr: "J'ai douze ans.", it: "Ho dodici anni.", wrong: ["Ho fame", "Sono stanco", "Vado al parco"] },
  { fr: "Où est la gare?", it: "Dov'è la stazione?", wrong: ["Quanto costa?", "Che ore sono?", "Come ti chiami?"] },
  { fr: "C'est bon.", it: "Va bene / È buono.", wrong: ["Non capisco", "Ho freddo", "Arrivederci"] },
];

export const translations: { fr: string; it: string; wrong: string[]; topic: string }[] = [
  { fr: "je suis", it: "io sono", wrong: ["io ho", "tu sei", "lui è"], topic: "traduzione francese-italiano" },
  { fr: "j'ai", it: "io ho", wrong: ["io sono", "tu hai", "noi abbiamo"], topic: "traduzione francese-italiano" },
  { fr: "nous avons", it: "noi abbiamo", wrong: ["noi siamo", "voi avete", "loro hanno"], topic: "traduzione francese-italiano" },
  { fr: "il fait beau", it: "fa bel tempo", wrong: ["piove", "fa freddo", "nevica"], topic: "traduzione francese-italiano" },
  { fr: "j'aime le sport", it: "mi piace lo sport", wrong: ["odio lo sport", "vado a scuola", "ho fame"], topic: "traduzione francese-italiano" },
];

export const articleExercises: { noun: string; gender: "m" | "f"; correct: string; wrong: string[] }[] = [
  { noun: "école", gender: "f", correct: "l'école", wrong: ["le école", "un école", "des école"] },
  { noun: "maison", gender: "f", correct: "la maison", wrong: ["le maison", "un maison", "les maison"] },
  { noun: "livre", gender: "m", correct: "le livre", wrong: ["la livre", "une livre", "les livre"] },
  { noun: "chat", gender: "m", correct: "le chat", wrong: ["la chat", "une chat", "des chat"] },
  { noun: "table", gender: "f", correct: "la table", wrong: ["le table", "un table", "des table"] },
];
