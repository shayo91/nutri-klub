# Autentifikacija - Faza 1 ✅

## Šta je implementirano

### Backend

1. **Database Schema** - Proširene tabele:
   - `users` - Dodati novi polja (firstName, lastName, role, subscriptionStatus, onboardingCompleted, referralCode, itd.)
   - `userPreferences` - Proširena sa goal, weights, heights, gender, activity level
   - `usageTracking` - Nova tabela za rate limiting free tier korisnika
   - `aiChatHistory` - Nova tabela za AI chat istoriju
   - `referrals` - Nova tabela za referral program
   - `achievements` - Nova tabela za gamification
   - `streaks` - Nova tabela za tracking streak-ova

2. **Auth Utils**:
   - `server/utils/password.ts` - Hash i verifikacija lozinki sa bcrypt
   - `server/utils/jwt.ts` - Generisanje i verifikacija JWT tokena

3. **Middleware**:
   - `server/middleware/auth.ts` - JWT autentifikacija, role-based access
   - `server/middleware/checkSubscription.ts` - Premium/Plan provera
   - `server/middleware/rateLimit.ts` - Rate limiting za free tier (3 recepta, 2 AI poruke, 1 ebook)

4. **API Rute**:
   - `/api/auth/register` - Registracija (email, password, firstName, lastName)
   - `/api/auth/login` - Prijava
   - `/api/auth/logout` - Odjava
   - `/api/auth/me` - Trenutni korisnik
   - `/api/auth/refresh` - Refresh token
   - `/api/subscription/status` - Premium status i usage stats
   - `/api/subscription/usage` - Usage limiti
   - `/api/subscription/cancel` - Otkazivanje premium-a
   - `/api/onboarding/preferences` - Čuvanje preferenci
   - `/api/onboarding/status` - Status onboarding-a

### Frontend

1. **Context & Hooks**:
   - `client/src/contexts/AuthContext.tsx` - Globalno auth stanje
   - `client/src/hooks/useSubscription.ts` - Subscription status hook

2. **Komponente**:
   - `client/src/components/auth/ProtectedRoute.tsx` - Zaštita ruta (auth, premium, admin)

3. **Stranice**:
   - `/login` - Login stranica
   - `/register` - Registracija
   - `/forgot-password` - Zaboravljena lozinka (placeholder)
   - `/onboarding` - Multi-step wizard (cilj, info, preferencije)
   - `/dashboard` - Dashboard sa feature kartima

## Setup

### 1. Dodajte JWT_SECRET u `.env`

```bash
# Dodajte ovu liniju u vaš .env fajl
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**⚠️ VAŽNO:** Generišite siguran JWT secret za production:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Pokrenite migraciju baze

```bash
npm run db:push
```

### 3. (Opcionalno) Seed test data

```bash
npx tsx server/seed.ts
```

Ovo će kreirati test korisnika:
- **Email:** test@example.com
- **Password:** test123
- **Role:** Free (trial)

### 4. Pokrenite aplikaciju

```bash
npm run dev
```

## Testiranje

1. Idite na [http://localhost:5000/register](http://localhost:5000/register)
2. Registrujte se sa email-om i lozinkom
3. Prođite kroz onboarding wizard
4. Bićete redirektovani na Dashboard

## Nivoi pristupa

### 1. Free Tier (Trial)
- **3 recepta ukupno** (ne dnevno!)
- **2 AI poruke ukupno**
- **1 besplatni ebook**
- Preview recept dana (blur overlay)
- Osnovno tracking (bez grafova)
- **Konstantan upgrade banner**

### 2. Premium (4€/mesec ili 35€/godišnje)
- Neograničeni recepti
- Neograničen AI chat
- 15+ premium e-bookova
- Meal planner (7 dana)
- Shopping lista
- Progress tracking sa grafovima
- Community access
- Achievements & Streaks

### 3. Plan Buyers (Start/Balans/Transformacija)
- **Sve iz Premium +**
- Personalizovani plan ishrane
- 1-6 konsultacija sa nutricionistom
- WhatsApp podrška
- Prilagođavanje plana

## Rate Limiting

Free tier korisnici imaju ograničenja koja se prate u `usageTracking` tabeli:

```typescript
const FREE_TIER_LIMITS = {
  recipe_view: 3,     // Ukupno 3 recepta (ne resetuje se)
  ai_message: 2,      // Ukupno 2 AI poruke
  ebook_download: 1,  // 1 besplatan ebook
};
```

Premium korisnici nemaju limite.

## API Primeri

### Registracija
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "Ana",
    "lastName": "Marković"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Current User (sa token-om)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Cookie: accessToken=YOUR_TOKEN"
```

## Sledeći koraci (Faza 2)

- [ ] Dashboard layout sa sidebar navigacijom
- [ ] Upgrade modal/page za free tier
- [ ] Recipe API integracija (Edamam/Spoonacular)
- [ ] Notion integration za custom recepte
- [ ] E-book management
- [ ] Recept dana feature
- [ ] AI asistent (Hugging Face/OpenRouter)

## Tehnologije

- **Backend:** Express.js, Drizzle ORM, bcrypt, jsonwebtoken, cookie-parser
- **Frontend:** React, Wouter (routing), TanStack Query, Shadcn UI
- **Database:** SQLite (dev), PostgreSQL (production via NeonDB)
- **Auth:** JWT sa httpOnly cookies

## Napomene

- Tokeni se čuvaju u httpOnly cookies (sigurnije od localStorage)
- Passwords se hash-uju sa bcrypt (10 salt rounds)
- JWT tokeni expire nakon 7 dana (access) i 30 dana (refresh)
- Rate limiting je implementiran na backend-u (ne može se zaobići)
- Subscription status se proverava na svakom zahtevу za premium sadržaj
