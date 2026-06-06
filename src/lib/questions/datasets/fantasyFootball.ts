export const fantaFacts: {
  q: string;
  a: string;
  wrong: string[];
  topic: string;
  diff: "facile" | "media" | "difficile";
}[] = [
  { q: "Cosa significa bonus gol?", a: "+3 o +4 punti per gol segnato", wrong: ["-3 punti", "Nessun punto", "Solo al portiere"], topic: "bonus", diff: "facile" },
  { q: "Malus autogol di solito?", a: "Punti negativi", wrong: ["Bonus", "Zero fisso", "Doppio gol"], topic: "malus", diff: "facile" },
  { q: "L'asta serve a?", a: "Comprare i giocatori con crediti", wrong: ["Vedere la partita", "Cambiare modulo in campo", "Fare rigori"], topic: "asta", diff: "facile" },
  { q: "Modulo 3-5-2 ha?", a: "3 difensori, 5 centrocampisti, 2 attaccanti", wrong: ["3 attaccanti", "5 portieri", "2 difensori"], topic: "modulo", diff: "media" },
  { q: "Il capitano di solito?", a: "Raddoppia i punti (regola comune)", wrong: ["Non conta", "Fa malus doppio", "È sempre portiere"], topic: "capitano", diff: "media" },
  { q: "Titolari sono?", a: "Giocatori schierati dall'inizio", wrong: ["In panchina", "Allenatori", "Arbitri"], topic: "formazione", diff: "facile" },
  { q: "Panchina serve a?", a: "Sostituzioni durante la giornata", wrong: ["Asta iniziale", "Calcolo modulo", "Voto arbitro"], topic: "formazione", diff: "facile" },
  { q: "Crediti in asta classic?", a: "Budget per acquistare calciatori", wrong: ["Punti partita", "Malus", "Rigori"], topic: "asta", diff: "facile" },
  { q: "Portiere che para rigore può avere?", a: "Bonus", wrong: ["Solo malus", "Nulla", "Espulsione"], topic: "bonus", diff: "media" },
  { q: "Ammonizione spesso dà?", a: "Malus", wrong: ["+10 gol", "Capitano automatico", "Modulo 4-4-2"], topic: "malus", diff: "facile" },
  { q: "Assist di solito?", a: "Bonus all'assistman", wrong: ["Malus", "Sostituisce gol", "Cancella modulo"], topic: "bonus", diff: "facile" },
  { q: "Voto 6 in fantacalcio è?", a: "Sufficienza/base", wrong: ["Espulsione", "Gol", "Rigore parato"], topic: "voti", diff: "facile" },
  { q: "Voto 10 di solito?", a: "Prestazione top con bonus", wrong: ["Malus", "Non gioca", "0 punti"], topic: "voti", diff: "facile" },
  { q: "Lega privata significa?", a: "Torneo tra amici", wrong: ["Solo Serie A TV", "Partita vera", "Allenamento"], topic: "lega", diff: "facile" },
  { q: "Svincolato in asta significa?", a: "Giocatore ancora comprabile", wrong: ["Espulso", "Infortunato sempre", "Capitano"], topic: "asta", diff: "difficile" },
];

export const fantaScenarios = [
  { q: "Hai 1 credito e serve un attaccante. Cosa fai?", a: "Prendi l'ultimo attaccante utile", wrong: ["Compri tre portieri", "Non schieri nessuno", "Abbandoni la lega"] },
  { q: "Il tuo capitano fa voto 4. Effetto tipico?", a: "Punti bassi raddoppiati", wrong: ["Bonus doppio", "Zero in lega", "Vittoria automatica"] },
  { q: "Giornata con 3 infortunati titolari.", a: "Usi la panchina", wrong: ["Giochi senza portiere", "Modulo 0-0-11", "Cambi regolamento"] },
];

export const roles = ["Portiere", "Difensore", "Centrocampista", "Attaccante"];
