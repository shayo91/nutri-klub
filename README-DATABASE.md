# Database Setup Guide

## Hibridni pristup: Notion CMS + SQLite/PostgreSQL

Aplikacija koristi hibridni pristup za skladištenje podataka:

### Notion CMS (Content Management)
- **Blog Posts** - članci i blog postovi
- **Testimonials** - testimonijali klijenata
- **Announcements** - obaveštenja
- **Ebooks** - e-book biblioteka
- **Videos** - video sadržaj
- **Podcasts** - podcast epizode
- **SocialMedia** - društvene mreže postovi

**Prednosti:**
- Lako upravljanje sadržajem bez kod promena
- Ne zahteva migracije baze za CMS sadržaj
- Ne-technical korisnici mogu da upravljaju sadržajem

### Database (User Data)
- **SQLite** - za lokalni development (automatski se koristi)
- **PostgreSQL** - za produkciju (NeonDB ili drugi hosting)

**Šta se čuva u bazi:**
- Korisnici i autentifikacija
- User preferences (alergije, ciljevi, preferencije)
- Subscriptions (Stripe pretplate i kupovine)
- User favorites (sačuvani recepti)
- Contact messages (kontakt forme)
- Newsletter subscriptions

## Lokalni Development Setup

### 1. SQLite (Automatski)

SQLite se automatski koristi za lokalni development. Nema potrebe za dodatnom konfiguracijom.

```bash
# Kreiraj bazu i tabele
npm run db:push

# (Opcionalno) Dodaj test podatke
npm run db:seed
```

Baza će biti kreirana u `local.db` fajlu u root direktorijumu.

### 2. Environment Variables

Za lokalni development, samo Notion varijable su potrebne:

```env
NOTION_INTEGRATION_SECRET=your_secret
NOTION_PAGE_URL=https://www.notion.so/your-page-url
```

**Opcionalno:**
```env
SQLITE_DB_PATH=./local.db  # Default path
DATABASE_TYPE=sqlite       # Eksplicitno specificiraj SQLite
```

## Produkcija Setup

### PostgreSQL (NeonDB ili drugi)

Za produkciju, postavi `DATABASE_URL`:

```env
DATABASE_URL=postgresql://user:password@host:port/database
NOTION_INTEGRATION_SECRET=your_secret
NOTION_PAGE_URL=https://www.notion.so/your-page-url
```

Zatim pokreni migracije:

```bash
npm run db:push
```

## Database Komande

- `npm run db:push` - Kreira/update tabele u bazi
- `npm run db:generate` - Generiše migracije
- `npm run db:migrate` - Pokreće migracije
- `npm run db:studio` - Otvara Drizzle Studio (GUI za bazu)
- `npm run db:seed` - Dodaje test podatke

## Schema Fajlovi

- `shared/schema-sqlite.ts` - SQLite schema za lokalni development
- `shared/schema-pg.ts` - PostgreSQL schema za produkciju
- `shared/schema.ts` - Glavni export (automatski bira između SQLite/PG)

## Migracija sa MemStorage na Database

Postojeći kod koristi `storage` iz `server/storage.ts` koji sada eksportuje `dbStorage` iz `server/db-storage.ts`. Nema potrebe za promenama u postojećem kodu.

## Napomene

- SQLite baza (`local.db`) je u `.gitignore` - ne commit-uj je
- Za produkciju, koristi PostgreSQL (NeonDB je preporučeno)
- Notion CMS se koristi za sve marketing/content podatke
- Database se koristi samo za user-specific podatke
