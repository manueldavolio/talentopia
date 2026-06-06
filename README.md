# Talentopia

Piattaforma educativa per ragazzi 10-13 anni: quiz, minigiochi, XP, monete e badge.

## Installazione

```bash
npm install
```

## Avvio in locale

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000). Alla prima visita inserisci il nome giocatore su `/login`.

## Collegare Supabase

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Copia `.env.local.example` in `.env.local` e inserisci URL e anon key
3. Nel SQL Editor esegui `supabase/schema.sql`
4. Installa il client (già in package.json): `@supabase/supabase-js`
5. Le funzioni in `src/lib/supabase/queries.ts` sono pronte per salvare tentativi quando configuri le env

## Aggiungere nuove domande

- **Statiche**: modifica i file in `src/lib/questions/banks/`
- **Template infiniti**: aggiungi template in `generator.ts` / `generateFromTemplates` per categoria
- **Database**: inserisci righe nella tabella `questions` su Supabase

## Pubblicazione online

Deploy consigliato su [Vercel](https://vercel.com):

```bash
npm run build
```

Collega il repo GitHub a Vercel e aggiungi le variabili `NEXT_PUBLIC_SUPABASE_*` se usi Supabase.
