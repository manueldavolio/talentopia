import type { Difficulty } from "@/types";

export type FootballFact = {
  q: string;
  a: string;
  wrong: string[];
  topic: string;
  diff: Difficulty;
  explanationShort: string;
  curiosity: string;
  memoryTip: string;
};

export const footballFacts: FootballFact[] = [
  {
    q: "Quando un giocatore può essere in fuorigioco?",
    a: "Nel momento in cui il pallone gli viene giocato da un compagno",
    wrong: [
      "Solo se tocca la palla",
      "Solo in area avversaria senza pallone",
      "Quando è dietro l'ultimo difensore in qualsiasi momento",
    ],
    topic: "fuorigioco",
    diff: "difficile",
    explanationShort:
      "Il fuorigioco si valuta al momento del passaggio, non quando il giocatore riceve o tocca.",
    curiosity:
      "La regola moderna del fuorigioco nasce in Inghilterra nel 1863 per evitare gol 'in agguato'.",
    memoryTip: "Pensa al PASSAGGIO, non al tocco: è lì che conta la posizione.",
  },
  {
    q: "Quale ruolo ha il mediano davanti alla difesa?",
    a: "Intercettare e distribuire il gioco tra difesa e centrocampo",
    wrong: [
      "Segnare il maggior numero di gol",
      "Parare i rigori",
      "Marcare solo l'esterno avversario",
    ],
    topic: "ruoli",
    diff: "media",
    explanationShort:
      "Il mediano (o regista difensivo) collega la linea difensiva al centrocampo offensivo.",
    curiosity:
      "Pirlo e Busquets sono esempi famosi di mediani che hanno cambiato il ruolo in chiave moderna.",
    memoryTip: "Mediano = ponte tra difensori e compagni più avanzati.",
  },
  {
    q: "In un 4-3-3 quanti attaccanti puri ci sono di solito?",
    a: "Tre (due esterni e un centravanti)",
    wrong: ["Uno", "Due", "Quattro"],
    topic: "moduli",
    diff: "media",
    explanationShort:
      "Il 4-3-3 prevede tre linee di movimento in attacco: due ali e un punto centrale.",
    curiosity:
      "Il Barcellona di Guardiola ha reso famoso il falso nueve, variante tattica del 4-3-3.",
    memoryTip: "4-3-3: il numero finale «3» sono i giocatori più alti in campo.",
  },
  {
    q: "Cosa succede se il portiere prende con le mani un retropassaggio volontario di piede da un compagno?",
    a: "Fallo: si fischia punizione indiretta dall'area piccola",
    wrong: [
      "Rigore",
      "Corner per la squadra in difesa",
      "Si ripete il retropassaggio",
    ],
    topic: "regolamento",
    diff: "difficile",
    explanationShort:
      "Dopo il 1992 il portiere non può raccogliere con le mani un passaggio indietro volontario di piede.",
    curiosity:
      "La regola fu introdotta per evitare il gioco troppo lento e il 'tempo morto' difensivo.",
    memoryTip: "Retropassaggio di piede + mani del portiere = punizione indiretta.",
  },
  {
    q: "Da dove si batte una punizione indiretta commessa in area di rigore dalla difesa?",
    a: "Dal punto più vicino dove è avvenuta l'infrazione, dentro l'area",
    wrong: [
      "Sempre dal dischetto",
      "Dal centrocampo",
      "Dal punto del rigore",
    ],
    topic: "punizioni",
    diff: "difficile",
    explanationShort:
      "L'indiretta in area non è rigore: si batte dal punto del fallo, non dal dischetto.",
    curiosity:
      "Un gol su punizione indiretta in area è valido solo se un altro giocatore tocca prima la palla.",
    memoryTip: "Indiretta ≠ rigore: niente dischetto se non è fallo punibile con rigore.",
  },
  {
    q: "Quanti giocatori di movimento (escluso portiere) schiera un modulo 3-5-2?",
    a: "10",
    wrong: ["9", "11", "8"],
    topic: "moduli",
    diff: "media",
    explanationShort: "3+5+2 = 10 giocatori di movimento, più il portiere in campo.",
    curiosity:
      "Il 3-5-2 con esterni a tutta fascia è stato molto usato in Serie A negli anni 90.",
    memoryTip: "Somma i tre numeri del modulo: è il totale fuori dal portiere.",
  },
  {
    q: "Cosa indica il VAR in una partita ufficiale?",
    a: "Video Assistant Referee che supporta l'arbitro su errori chiari",
    wrong: [
      "Un secondo arbitro in campo",
      "Solo per i fuorigioco",
      "Sostituisce l'arbitro principale",
    ],
    topic: "VAR",
    diff: "media",
    explanationShort:
      "Il VAR rivede situazioni su gol, rigori, rossi e identità del sanzionato.",
    curiosity: "Il VAR è usato nella Champions League dal 2019-20.",
    memoryTip: "VAR = supporto video, non arbitro in campo.",
  },
  {
    q: "Quando l'arbitro assegna un calcio di rigore?",
    a: "Quando in area c'è un fallo che impedisce un'occasione da gol",
    wrong: [
      "Per ogni fallo in area",
      "Per fuorigioco in area",
      "Per mano involontaria fuori area",
    ],
    topic: "rigore",
    diff: "media",
    explanationShort:
      "Serve un fallo punibile (es. contrasto, mano deliberata) commesso in area di rigore.",
    curiosity:
      "Il rigore fu introdotto nel 1891; prima si poteva reclamare solo un'ingiustizia generica.",
    memoryTip: "Rigore = fallo grave + dentro l'area.",
  },
  {
    q: "Da quale angolo del campo si esegue un calcio d'angolo?",
    a: "Dall'archetto più vicino al punto dove la palla è uscita",
    wrong: [
      "Dal centrocampo",
      "Dal punto del rigore",
      "Da qualsiasi angolo a scelta",
    ],
    topic: "angolo",
    diff: "facile",
    explanationShort:
      "L'angolo si batte dalla bandierina del lato in cui la palla ha superato la linea di fondo.",
    curiosity:
      "I calci d'angolo sono tra le azioni più pericolose: molti gol nascono da seconda palla.",
    memoryTip: "Palla uscita sulla fondo → angolo sul lato corrispondente.",
  },
  {
    q: "Quante sostituzioni sono consentite nella maggior parte delle competizioni FIFA attuali?",
    a: "Fino a 5 cambi su 3 interruzioni (o più con regolamento esteso)",
    wrong: ["3 cambi fissi", "Illimitate", "Solo 2"],
    topic: "regolamento",
    diff: "media",
    explanationShort:
      "Dal 2020 molte competizioni permettono 5 sostituzioni per gestire calendari intensi.",
    curiosity:
      "Durante il COVID-19 la FIFA ha esteso temporaneamente il limite delle sostituzioni.",
    memoryTip: "5 giocatori possono entrare, ma non sempre in 5 stop separati.",
  },
  {
    q: "Cosa significa pressing alto?",
    a: "Recuperare la palla subito nella metà campo avversaria",
    wrong: [
      "Difendere vicino alla propria porta",
      "Giocare solo in contropiede",
      "Tenere il possesso senza pressare",
    ],
    topic: "pressing",
    diff: "media",
    explanationShort:
      "Il pressing alto stringe gli spazi avanti per costringere errori vicino alla porta avversaria.",
    curiosity: "Klopp e Guardiola hanno reso celebre il gegenpressing e il pressing organizzato.",
    memoryTip: "Alto = vicino alla porta avversaria, non alla tua.",
  },
  {
    q: "Quale modulo ha due trequartisti dietro un centravanti (4-2-3-1)?",
    a: "Quattro difensori, due mediani, tre attaccanti dietro il nove",
    wrong: [
      "Tre difensori e cinque attaccanti",
      "Solo due centrocampisti totali",
      "Nessun trequartista",
    ],
    topic: "moduli",
    diff: "difficile",
    explanationShort:
      "Il 4-2-3-1 separa due mediani dalla linea di tre dietro il centravanti.",
    curiosity:
      "Il 4-2-3-1 è molto usato in Premier League per equilibrio tra fasce e centrale.",
    memoryTip: "4-2-3-1: il «3» centrale sono i trequartisti, non tre punte pure.",
  },
  {
    q: "In marcatura a uomo cosa fa ogni difensore?",
    a: "Segue un avversario assegnato in tutto il campo",
    wrong: [
      "Copre solo una zona",
      "Marca solo sui calci piazzati",
      "Non segue mai gli spostamenti",
    ],
    topic: "marcatura",
    diff: "media",
    explanationShort:
      "La marcatura a uomo richiede cambi di assegnazione quando gli attaccanti si scambiano.",
    curiosity:
      "La zona mista (zona + uomo sui pali) è comune sui calci piazzati in Serie A.",
    memoryTip: "Uomo = hai un nome avversario da seguire ovunque.",
  },
  {
    q: "Cosa caratterizza il contropiede?",
    a: "Attaccare rapidamente appena recuperata la palla",
    wrong: [
      "Possesso lungo a ritmo lento",
      "Pressing solo nella propria area",
      "Giocare sempre con tre difensori",
    ],
    topic: "contropiede",
    diff: "facile",
    explanationShort:
      "Il contropiede sfrutta gli spazi lasciati dalla squadra avversaria spinta in avanti.",
    curiosity:
      "Il Real Madrid degli anni 2010 era famoso per transizioni velocissime.",
    memoryTip: "Contropiede = difesa → attacco in pochi secondi.",
  },
  {
    q: "Chi organizza ufficialmente la UEFA Champions League?",
    a: "UEFA",
    wrong: ["FIFA", "CONMEBOL", "Serie A"],
    topic: "Champions League",
    diff: "facile",
    explanationShort: "La Champions è il torneo per club europeo organizzato dall'UEFA.",
    curiosity:
      "La Coppa dei Campioni è diventata Champions League nel 1992-93.",
    memoryTip: "Champions europea = UEFA, non FIFA.",
  },
  {
    q: "Ogni quanti anni si disputa la Coppa del Mondo FIFA?",
    a: "4",
    wrong: ["2", "3", "5"],
    topic: "Mondiali",
    diff: "facile",
    explanationShort: "I Mondiali si giocano ogni quattro anni (salvo eccezioni storiche).",
    curiosity: "Il Mondiale 2022 in Qatar è stato il primo invernale per il caldo estivo.",
    memoryTip: "Mondiali = ciclo olimpico: 4 anni.",
  },
  {
    q: "Quante squadre partecipano al campionato di Serie A?",
    a: "20",
    wrong: ["18", "22", "16"],
    topic: "Serie A",
    diff: "facile",
    explanationShort: "La Serie A a girone unico ha 20 club per stagione.",
    curiosity: "Dal 2004-05 la Serie A è tornata a 20 squadre dopo un periodo a 18.",
    memoryTip: "Serie A attuale = venti squadre, tre punti vittoria.",
  },
  {
    q: "Quanti punti vale una vittoria in campionato?",
    a: "3",
    wrong: ["2", "1", "4"],
    topic: "Serie A",
    diff: "facile",
    explanationShort: "Vittoria 3, pareggio 1, sconfitta 0 dal 1994-95 in molti campionati.",
    curiosity: "Prima si davano 2 punti per la vittoria: il cambio ha incentivato il gioco offensivo.",
    memoryTip: "V-P-S: 3-1-0 è lo schema da ricordare.",
  },
  {
    q: "Quando un giocatore riceve il secondo cartellino giallo nella stessa partita?",
    a: "Viene espulso (equivalente al rosso)",
    wrong: [
      "Continua a giocare",
      "Rigore subito",
      "Solo ammonizione scritta",
    ],
    topic: "cartellini",
    diff: "facile",
    explanationShort: "Due gialli = espulsione; la squadra resta in dieci.",
    curiosity: "Il doppio giallo è tra le cause più frequenti di espulsione in Serie A.",
    memoryTip: "Giallo + giallo = rosso (via dal campo).",
  },
  {
    q: "Cosa succede dopo un fallo laterale battuto male dall'avversario?",
    a: "Rimessa laterale per l'altra squadra",
    wrong: ["Corner", "Rigore", "Punizione indiretta"],
    topic: "rimesse",
    diff: "media",
    explanationShort:
      "La rimessa laterale non può essere rigiocata: errore = cambio possesso.",
    curiosity:
      "Dal 2019 in molte competizioni la rimessa si può ricevere anche da compagno in area.",
    memoryTip: "Rimessa sbagliata → palla all'avversario, non rigore.",
  },
  {
    q: "Quale record detiene la nazionale brasiliana ai Mondiali?",
    a: "Cinque titoli mondiali",
    wrong: ["Tre titoli", "Sette titoli", "Nessun titolo"],
    topic: "record storici",
    diff: "media",
    explanationShort: "Il Brasile ha vinto i Mondiali nel 1958, 1962, 1970, 1994 e 2002.",
    curiosity: "Pelé ha vinto tre Mondiali con il Brasile (unico giocatore in questa fascia).",
    memoryTip: "Brasile = 5 stelle sulla maglia verde.",
  },
  {
    q: "Chi ha vinto i Mondiali 2006 in Germania?",
    a: "Italia ai rigori sulla Francia",
    wrong: ["Germania", "Brasile", "Spagna"],
    topic: "Mondiali",
    diff: "media",
    explanationShort: "Finale 1-1, Italia vince 5-3 ai rigori con gol di Materazzi e Totti tra gli altri.",
    curiosity: "È l'ultimo Mondiale vinto dall'Italia; Zidane espulso per testata a Materazzi.",
    memoryTip: "2006 + Berlino = azzurri campioni del mondo.",
  },
  {
    q: "In un 4-2-3-1 quanti centrocampisti difensivi (mediani) ci sono di solito?",
    a: "Due",
    wrong: ["Uno", "Tre", "Nessuno"],
    topic: "moduli",
    diff: "media",
    explanationShort: "Il «2» nel modulo indica la coppia di mediani davanti alla difesa a quattro.",
    curiosity:
      "Coppie famose: Xabi Alonso e Modrić al Real, Jorginho e Kanté al Chelsea.",
    memoryTip: "4-2-3-1 → il «2» sono i due davanti alla difesa.",
  },
  {
    q: "Quando si fischia il fuorigioco su un attaccante?",
    a: "Se, al momento del passaggio, è più vicino alla porta avversaria rispetto a palla e penultimo avversario",
    wrong: [
      "Se è in campo avversario",
      "Solo se segna",
      "Se corre più veloce del difensore",
    ],
    topic: "fuorigioco",
    diff: "difficile",
    explanationShort:
      "Servono almeno due avversari (di solito portiere + difensore) tra attaccante e porta al passaggio.",
    curiosity:
      "Il VAR controlla spesso la linea del penultimo difensore frame per frame.",
    memoryTip: "Penultimo avversario + palla al passaggio = regola base.",
  },
  {
    q: "Cosa è un fallo di mano deliberato in area da parte di un difensore?",
    a: "Punizione che può essere rigore se impedisce gol o occasioni",
    wrong: [
      "Sempre punizione indiretta",
      "Solo ammonizione",
      "Sempre corner",
    ],
    topic: "falli",
    diff: "difficile",
    explanationShort:
      "La mano deve essere voluntaria o in posizione innaturale; in area spesso è rigore.",
    curiosity:
      "Dopo il Mondiale 2022 la IFAB ha chiarito ancora i criteri per mano e braccio.",
    memoryTip: "Mano «deliberata» in area → pensa subito al rigore.",
  },
  {
    q: "Quale squadra italiana ha vinto più scudetti?",
    a: "Juventus",
    wrong: ["Milan", "Inter", "Roma"],
    topic: "Serie A",
    diff: "media",
    explanationShort:
      "La Juventus detiene il record di titoli in Serie A (oltre 30, con revoche storiche).",
    curiosity:
      "Milan e Inter seguono nel podio italiano insieme al derby della Madonnina.",
    memoryTip: "Record scudetti bianconeri = Juventus.",
  },
  {
    q: "Durata regolamentare di un tempo di gioco?",
    a: "45 minuti",
    wrong: ["30 minuti", "40 minuti", "60 minuti"],
    topic: "regolamento",
    diff: "facile",
    explanationShort: "Due tempi da 45 minuti più recupero; eventuali supplementari nei knockout.",
    curiosity: "Il cronometro effettivo in alcune competizioni somma solo il tempo palla in gioco.",
    memoryTip: "45 + 45 = 90 minuti regolamentari.",
  },
  {
    q: "Quanti giocatori per squadra sono in campo (portiere incluso)?",
    a: "11",
    wrong: ["10", "12", "9"],
    topic: "regolamento",
    diff: "facile",
    explanationShort: "Undici titolari; espulsioni riducono il numero fino al minimo consentito.",
    curiosity: "Se scendono sotto 7 giocatori la partita viene sospesa.",
    memoryTip: "11 = 10 di movimento + 1 portiere.",
  },
  {
    q: "Cosa fa l'arbitro assistente (guardalinee) su fuorigioco stretto?",
    a: "Segnala con la bandierina se l'attaccante è oltre la linea difensiva",
    wrong: [
      "Fischia il rigore",
      "Sostituisce il VAR",
      "Conta i falli",
    ],
    topic: "arbitro",
    diff: "media",
    explanationShort:
      "Il guardalinee aiuta su fuorigioco, falli e uscite palla; il VAR integra in TV.",
    curiosity:
      "Dal 2024 molte competizioni usano il semi-automatico offside con sensori.",
    memoryTip: "Bandierina alzata = spesso fuorigioco o fallo laterale.",
  },
  {
    q: "Euro 2020 (giocato nel 2021) è stata vinta da quale nazionale?",
    a: "Italia",
    wrong: ["Inghilterra", "Spagna", "Francia"],
    topic: "Europei",
    diff: "media",
    explanationShort: "Finale a Wembley: Italia batte l'Inghilterra ai rigori 3-2.",
    curiosity: "È stato il primo Europeo con sedi in più paesi.",
    memoryTip: "Wembley 2021 + rigori = Italia campione d'Europa.",
  },
  {
    q: "In Champions League, la fase a gironi (storica) è stata sostituita da quale formato recente?",
    a: "Lega unica con più squadre e classifica globale (nuovo formato)",
    wrong: [
      "Solo eliminazione diretta",
      "Nessuna competizione europea",
      "Solo nazionali",
    ],
    topic: "Champions League",
    diff: "difficile",
    explanationShort:
      "Dal 2024-25 la Champions ha una fase lega con 36 squadre e più partite per club.",
    curiosity:
      "Il nuovo formato aumenta il numero minimo di gare per ogni qualificato.",
    memoryTip: "36 squadre + lega = cambio recente UEFA.",
  },
  {
    q: "Quale nazionale ha vinto l'Euro 2016 in Francia?",
    a: "Portogallo",
    wrong: ["Francia", "Germania", "Italia"],
    topic: "Europei",
    diff: "media",
    explanationShort: "Portogallo batte la Francia 1-0 in finale dopo i tempi supplementari.",
    curiosity: "Ronaldo uscì infortunato ma la squadra vinse comunque.",
    memoryTip: "Euro 2016 finale Parigi = Portugal.",
  },
  {
    q: "Cosa succede se un difensore tocca la palla ultimo prima che esca sulla linea laterale?",
    a: "Rimessa laterale per la squadra che attaccava quel lato",
    wrong: ["Corner", "Punizione", "Rigore"],
    topic: "rimesse",
    diff: "media",
    explanationShort: "L'ultimo a toccare decide chi batte la rimessa laterale.",
    curiosity: "Le rimesse laterali moderne permettono il passaggio a un compagno in area.",
    memoryTip: "Ultimo tocco = rimessa all'avversario.",
  },
  {
    q: "In un 5-3-2 quanti difensori centrali ci sono di solito?",
    a: "Tre centrali con due esterni a tutta fascia",
    wrong: ["Due", "Quattro", "Nessuno"],
    topic: "moduli",
    diff: "media",
    explanationShort: "Il 5-3-2 schiera linea a cinque con tre centrali e due ali difensive.",
    curiosity: "Conte ha reso famoso il 3-5-2/5-3-2 in Serie A con Juventus e Inter.",
    memoryTip: "5 nel modulo = cinque dietro, di cui tre centrali.",
  },
  {
    q: "Quando si può entrare in area avversaria su calcio di punizione diretta?",
    a: "Solo quando la palla è stata giocata o esce dall'area",
    wrong: [
      "Subito dopo il fischio",
      "Mai",
      "Solo il portiere",
    ],
    topic: "punizioni",
    diff: "difficile",
    explanationShort:
      "Su punizione diretta gli avversari devono restare a 9,15 m finché la palla non è in gioco.",
    curiosity: "Le pareti umane sui calci piazzati sono regolamentate con distanza precisa.",
    memoryTip: "9,15 metri = distanza della barriera standard.",
  },
  {
    q: "Chi detiene il record di gol in una singola stagione di Champions League (circa 17)?",
    a: "Cristiano Ronaldo",
    wrong: ["Messi", "Lewandowski", "Benzema"],
    topic: "record storici",
    diff: "difficile",
    explanationShort: "Ronaldo ha stabilito numerosi record europei con Real e United.",
    curiosity: "Ha vinto 5 Champions, quattro con il Real Madrid.",
    memoryTip: "CR7 + Champions = record gol stagionali.",
  },
  {
    q: "Cosa indica il cartellino giallo?",
    a: "Ammonizione per fallo o comportamento antisportivo",
    wrong: ["Espulsione immediata", "Rigore automatico", "Gol annullato"],
    topic: "cartellini",
    diff: "facile",
    explanationShort: "Il giallo avvisa; il secondo giallo porta all'espulsione.",
    curiosity: "I cartellini furono introdotti ai Mondiali 1970 per superare le barriere linguistiche.",
    memoryTip: "Giallo = attenzione, non via dal campo (da solo).",
  },
  {
    q: "Quale club ha vinto più Coppe dei Campioni/Champions League?",
    a: "Real Madrid",
    wrong: ["Milan", "Liverpool", "Bayern Monaco"],
    topic: "Champions League",
    diff: "media",
    explanationShort: "Il Real Madrid detiene il record assoluto di titoli europei per club.",
    curiosity: "La prima Coppa dei Campioni fu vinta dal Real nel 1956.",
    memoryTip: "Blancos = re d'Europa.",
  },
  {
    q: "Se la palla tocca il braccio di un difensore in area dopo un tiro ravvicinato senza tempo di reazione?",
    a: "L'arbitro valuta se la posizione del braccio è innaturale o ingrandita",
    wrong: [
      "Rigore automatico sempre",
      "Mai sanzione",
      "Solo corner",
    ],
    topic: "VAR",
    diff: "difficile",
    explanationShort:
      "Non ogni tocco di mano è rigore: serve deliberazione o posizione non giustificata.",
    curiosity: "L'IFAB aggiorna spesso le linee guida su mano e braccio.",
    memoryTip: "Mano in area ≠ sempre rigore: guarda intenzione e posizione.",
  },
  {
    q: "Quale ruolo svolge l'ala in un 4-3-3?",
    a: "Stendere il gioco sulle fasce e creare 1v1",
    wrong: [
      "Solo difendere in area",
      "Sostituire il portiere",
      "Marcare il centravanti avversario in zona",
    ],
    topic: "ruoli",
    diff: "media",
    explanationShort:
      "Le ali portano ampiezza e servono cross o tagli verso il centravanti.",
    curiosity: "Vinícius e Salah sono ali moderne con dribbling e gol.",
    memoryTip: "Ala = fascia + dribbling verso la porta.",
  },
  {
    q: "Cosa significa «linea alta» difensiva?",
    a: "Difensori posizionati vicino al centrocampo per stringere gli spazi",
    wrong: [
      "Difesa sulla linea di porta",
      "Nessun fuorigioco",
      "Solo contropiede",
    ],
    topic: "marcatura",
    diff: "media",
    explanationShort:
      "La linea alta aiuta il pressing ma lascia spazio dietro per i contropiedi.",
    curiosity: "Il fuorigioco con linea alta è una trappola tattica usata da molti allenatori.",
    memoryTip: "Linea alta = difesa avanzata, attenzione al contropiede.",
  },
];

/** Fatto compatto per template procedurali (senza meta estesa). */
export const footballQuickFacts: {
  q: string;
  a: string;
  wrong: string[];
  topic: string;
  diff: Difficulty;
}[] = [
  {
    q: "Il portiere può toccare con le mani un passaggio indietro di petto da compagno?",
    a: "Sì, se non è stato giocato volontariamente di piede",
    wrong: [
      "Mai, in nessun caso",
      "Solo fuori area",
      "Solo su corner",
    ],
    topic: "regolamento",
    diff: "difficile",
  },
  {
    q: "Un rigore battuto a sinistra della porta è valido se entra?",
    a: "Sì, se la palla supera completamente la linea di porta",
    wrong: [
      "No, deve essere al centro",
      "Solo se tocca il palo alto",
      "No se l'arbitro non approva",
    ],
    topic: "rigore",
    diff: "media",
  },
  {
    q: "La rima di porta (area piccola) serve principalmente a?",
    a: "Delimitare dove il portiere può prendere con le mani su punizioni",
    wrong: [
      "Segnare i rigori",
      "Calcolare il fuorigioco",
      "Disegnare il centrocampo",
    ],
    topic: "regolamento",
    diff: "media",
  },
  {
    q: "Quale ruolo copre tradizionalmente il terzino destro in un 4-4-2?",
    a: "Banda destra difensiva con salite in sovrapposizione",
    wrong: [
      "Centravanti",
      "Portiere",
      "Solo mediano centrale",
    ],
    topic: "ruoli",
    diff: "media",
  },
  {
    q: "Cosa significa «zona mista» in difesa?",
    a: "Combinazione di marcatura a zona e a uomo su situazioni chiave",
    wrong: [
      "Solo fuorigioco",
      "Solo pressing basso",
      "Nessuna marcatura",
    ],
    topic: "marcatura",
    diff: "difficile",
  },
];

export const players = [
  "Barella",
  "Leão",
  "Haaland",
  "Mbappé",
  "Modrić",
  "De Bruyne",
  "Salah",
  "Vinícius",
  "Lautaro",
  "Kane",
];

export const teams = [
  "Inter",
  "Milan",
  "Juventus",
  "Napoli",
  "Roma",
  "Atalanta",
  "Real Madrid",
  "Manchester City",
  "Bayern Monaco",
  "Liverpool",
];

export const scenarios = [
  {
    setup:
      "Squadra in svantaggio 0-1 all'85' con avversario chiuso in difesa bassa",
    action: "Alzare il pressing e inserire un trequartista",
    wrong: [
      "Togliere un attaccante per sei difensori",
      "Far uscire il portiere",
      "Perdere tempo senza pressare",
    ],
  },
  {
    setup: "Difensore centrale espulso, modulo 4-4-2",
    action: "Passare a 5-3-1 o 4-4-1 con mediano aggiuntivo",
    wrong: [
      "Restare in 4-4-2 senza cambi",
      "Giocare senza portiere",
      "Mettere tre punte pure",
    ],
  },
  {
    setup: "Rigore decisivo, portiere studia i precedenti del tiratore",
    action: "Scegliere angolo o restare centrali in base alle statistiche",
    wrong: [
      "Lasciare la porta vuota",
      "Fischare l'arbitro",
      "Mandare via il tiratore",
    ],
  },
];
