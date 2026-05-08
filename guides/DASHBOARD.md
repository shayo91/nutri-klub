# Korisnički panel (dashboard)

## Uključivanje / isključivanje

Postavite na serveru (ili u `.env`):

```bash
ENABLE_DASHBOARD=true
```

- `false` ili prazno: javni sajt (`/`, `/blog`, članci, lokacije…) radi kao i do sad; `/login` i ostale auth strane su vidljive ali submit je blokiran/obavješten; zaštićene putanje kao `/dashboard` prikazuju poruku „uskoro“, umjesto API-ja koji zahtijevaju SQLite.
- `true`: učitava se SQLite (`local.db` ili `SQLITE_DB_PATH`), registruju se `/api/auth`, recepti, AI, Stripe itd.

Klijentska aplikacija čita **`GET /api/public-config`** koji vraća `{ dashboardEnabled: boolean }`, nezavisno od builda.

## Baza i migracije

- Lokalno (preporuka): SQLite `local.db`
- Produkcija: možete držati SQLite ili migrirati na PostgreSQL; `drizzle.config.ts` koristi `DATABASE_URL` ako nije SQLite mod.

Prazan `local.db` nema tabele dok ne primjenite šemu: prvo **`db:push`**, pa **`db:seed`**.

```bash
npm run db:push
npm run db:seed
```

Za prvi korak odjednom (`push` + seed; `--force` potvrđuje promjene u šemi):

```bash
npm run db:bootstrap
```

## Bezbednosne varijable (samo ako je panel uključen)

| Varijabla | Opis |
|-----------|------|
| `JWT_SECRET` | Obavezno u produkciji za sesiju/cookies |
| `STRIPE_SECRET_KEY` | Plaćanja (opcionalno za dev) |
| `GEMINI_API_KEY` | AI asistent |
| Spoonacular / TheMealDB | po potrebi — vidi kod u `server/services/` |

## Napomena

Javni blog ostaje Markdown u `content/blog/` — Notion je uklonjen iz ovog projekta.
