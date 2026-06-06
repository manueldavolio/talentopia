export const sportFacts: {
  q: string;
  a: string;
  wrong: string[];
  topic: string;
  diff: "facile" | "media" | "difficile";
}[] = [
  { q: "Quanti giocatori in una squadra di basket in campo?", a: "5", wrong: ["6", "7", "11"], topic: "basket", diff: "facile" },
  { q: "Il tennis si gioca con?", a: "Racchetta e pallina", wrong: ["Solo i piedi", "Un bastone", "Un disco"], topic: "tennis", diff: "facile" },
  { q: "Olimpiadi si tengono ogni?", a: "4 anni (estate/inverno alternate)", wrong: ["1 anno", "2 anni", "10 anni"], topic: "olimpiadi", diff: "media" },
  { q: "Maratona è una gara di?", a: "Corsa su strada", wrong: ["Nuoto", "Ciclismo", "Salto in alto"], topic: "atletica", diff: "facile" },
  { q: "Il pugilato si combatte in?", a: "Ring", wrong: ["Piscina", "Campo da golf", "Pista di ghiaccio"], topic: "pugilato", diff: "facile" },
  { q: "Formula 1: i piloti guidano?", a: "Monoposto da corsa", wrong: ["Auto da rally", "Moto", "Bici"], topic: "motori", diff: "facile" },
  { q: "Il nuoto alle Olimpiadi si fa in?", a: "Piscina o acque libere", wrong: ["Solo in mare", "Solo su terra", "In palestra senza acqua"], topic: "nuoto", diff: "facile" },
  { q: "Rugby: meta vale?", a: "5 punti (poi conversione)", wrong: ["1 punto", "3 punti come rigore calcio", "10 punti fissi"], topic: "rugby", diff: "difficile" },
  { q: "Ciclismo Tour de France è in?", a: "Francia (e dintorni)", wrong: ["Solo Italia", "Antartide", "Solo Spagna"], topic: "ciclismo", diff: "media" },
  { q: "Pallavolo: quanti tocchi massimo di fila?", a: "3", wrong: ["2", "5", "Illimitati"], topic: "pallavolo", diff: "media" },
  { q: "Sci alpino si pratica su?", a: "Neve in montagna", wrong: ["Sabbia", "Asfalto", "Acqua calda"], topic: "sci", diff: "facile" },
  { q: "Ginnastica artistica usa?", a: "Corpo e attrezzi (trave, parallele...)", wrong: ["Solo la palla", "Solo il casco", "Solo la bici"], topic: "ginnastica", diff: "media" },
  { q: "Handball (pallamano) si gioca con?", a: "Le mani", wrong: ["I piedi solo", "La racchetta", "Il bastone"], topic: "pallamano", diff: "facile" },
  { q: "Baseball: colpire la palla con?", a: "Mazza", wrong: ["Piede", "Testa", "Palo di legno da hockey"], topic: "baseball", diff: "media" },
  { q: "Triathlon comprende?", a: "Nuoto, ciclismo, corsa", wrong: ["Solo salto", "Solo scherma", "Solo golf"], topic: "triathlon", diff: "media" },
];

export const sportScenarios = [
  { sport: "basket", q: "Ultimi 10 secondi, -2 punti. Strategia?", a: "Tiro da 3 o fallo strategico", wrong: ["Abbandonare", "Difesa a 0", "Cambiare sport"] },
  { sport: "tennis", q: "Tie-break significa?", a: "Punto decisivo nel set", wrong: ["Fine partita", "Sostituzione", "Pioggia"] },
];
