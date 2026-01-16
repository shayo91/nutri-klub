---
name: Dashboard sa autentifikacijom i premium funkcionalnostima - REVIDIRANI PLAN
overview: Implementacija kompletnog sistema autentifikacije, dashboard-a sa premium feature-ima (recepti, e-bookovi, recept dana, AI asistent, community), i Stripe integracije za mesečnu (4€) i godišnju (35€) pretplatu. Planovi (Start/Balans/Transformacija) UKLJUČUJU Premium pristup + personalizovano coaching. Korišćenje besplatnih API-ja i servisa.
version: 2.0
last_updated: 2025-01-15
---

# Plan implementacije Dashboard-a sa autentifikacijom i premium funkcionalnostima

## 🎯 Pregled arhitekture

Aplikacija će imati ČETIRI nivoa pristupa sa jasnom progresijom:

1. **Neregistrovani korisnici (Javni)** - postojeći sadržaj + demo funkcionalnosti
2. **Registrovani korisnici (Free Trial)** - ograničen pristup za testiranje platforme
3. **Premium korisnici** - pun pristup svim self-service alatima
4. **Kupci planova** - Premium pristup + personalizovano coaching

### 🔑 Ključna promena u pristupu

**STARA STRATEGIJA (problem):**
- Premium i Planovi su bili odvojeni proizvodi
- Zbunjujuće za korisnike
- Kanibalizacija prodaje

**NOVA STRATEGIJA (rešenje):**
- Premium = Self-service alati
- Planovi = Premium UKLJUČEN + Coaching sa nutricionistom
- Jasna progresija: Free → Premium → Plan (za one koji žele personalizovanu podršku)

---

## 💎 Faza 1: Autentifikacija i autorizacija

### 1.1 Backend - Auth sistem

**Tehnologije:**
- `bcrypt` za hash lozinki
- `jsonwebtoken` za JWT tokene
- Drizzle ORM za korisnike (već postoji `users` tabela u `shared/schema.ts`)
- Express middleware za zaštitu ruta

**Nove/izmenjene tabele u bazi:**

```typescript
// shared/schema.ts - Proširenja

// Users tabela (extended)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password_hash: text('password_hash').notNull(),
  first_name: text('first_name'),
  last_name: text('last_name'),
  role: text('role').default('free'), // 'free' | 'premium' | 'admin'
  subscription_status: text('subscription_status').default('inactive'), // 'inactive' | 'active' | 'cancelled' | 'expired'
  subscription_tier: text('subscription_tier'), // 'monthly' | 'yearly'
  subscription_expires_at: timestamp('subscription_expires_at'),
  stripe_customer_id: text('stripe_customer_id'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  last_login: timestamp('last_login'),
  onboarding_completed: boolean('onboarding_completed').default(false),
  referral_code: text('referral_code').unique(), // Za referral program
  referred_by: integer('referred_by').references(() => users.id),
});

// User Preferences (alergije, ciljevi, preferencije)
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  goal: text('goal'), // 'lose_weight' | 'gain_muscle' | 'maintain' | 'health'
  target_weight: decimal('target_weight'),
  current_weight: decimal('current_weight'),
  height: decimal('height'),
  age: integer('age'),
  gender: text('gender'), // 'male' | 'female' | 'other'
  activity_level: text('activity_level'), // 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  allergies: text('allergies').array(), // ['laktoza', 'gluten', ...]
  dietary_restrictions: text('dietary_restrictions').array(), // ['vegetarian', 'vegan', 'keto', ...]
  disliked_foods: text('disliked_foods').array(),
  meal_preferences: text('meal_preferences').array(), // ['brzi_obroci', 'meal_prep', ...]
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Subscriptions (Premium i Planovi)
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(), // 'premium_monthly' | 'premium_yearly' | 'plan'
  plan_type: text('plan_type'), // null za premium, 'start' | 'balans' | 'transformacija' za planove
  stripe_subscription_id: text('stripe_subscription_id'),
  stripe_payment_intent_id: text('stripe_payment_intent_id'),
  status: text('status').notNull(), // 'active' | 'cancelled' | 'expired' | 'pending'
  amount_paid: decimal('amount_paid').notNull(),
  currency: text('currency').default('EUR'),
  current_period_start: timestamp('current_period_start'),
  current_period_end: timestamp('current_period_end'),
  cancel_at_period_end: boolean('cancel_at_period_end').default(false),
  purchased_at: timestamp('purchased_at').defaultNow(),
  expires_at: timestamp('expires_at'), // Za planove (one-time)
  cancelled_at: timestamp('cancelled_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Usage Tracking (rate limiting za Free tier)
export const usageTracking = pgTable('usage_tracking', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  feature: text('feature').notNull(), // 'recipe_view' | 'ai_message' | 'ebook_download'
  count: integer('count').default(0),
  reset_date: timestamp('reset_date'), // Kada se resetuje brojač (daily/monthly)
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// AI Chat History
export const aiChatHistory = pgTable('ai_chat_history', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  response: text('response').notNull(),
  context: jsonb('context'), // User preferences za personalizaciju
  created_at: timestamp('created_at').defaultNow(),
});

// Referrals
export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  referrer_id: integer('referrer_id').references(() => users.id).notNull(),
  referred_id: integer('referred_id').references(() => users.id).notNull(),
  status: text('status').default('pending'), // 'pending' | 'completed'
  reward_granted: boolean('reward_granted').default(false),
  created_at: timestamp('created_at').defaultNow(),
});

// Gamification - Achievements
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  achievement_type: text('achievement_type').notNull(), // 'first_recipe' | '7_day_streak' | 'lost_5kg'
  unlocked_at: timestamp('unlocked_at').defaultNow(),
});

// Streaks
export const streaks = pgTable('streaks', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  streak_type: text('streak_type').notNull(), // 'login' | 'meal_log' | 'water'
  current_streak: integer('current_streak').default(0),
  longest_streak: integer('longest_streak').default(0),
  last_activity: timestamp('last_activity'),
  updated_at: timestamp('updated_at').defaultNow(),
});
```

**API endpointi:**

```
AUTH:
POST   /api/auth/register           - Registracija
POST   /api/auth/login              - Prijava
POST   /api/auth/logout             - Odjava
GET    /api/auth/me                 - Trenutni korisnik
POST   /api/auth/refresh            - Refresh token
POST   /api/auth/forgot-password    - Reset lozinke
POST   /api/auth/reset-password     - Potvrda reset-a

SUBSCRIPTION:
GET    /api/subscription/status     - Premium status
GET    /api/subscription/usage      - Usage limits (za free tier)
POST   /api/subscription/cancel     - Otkazivanje premium-a

ONBOARDING:
POST   /api/onboarding/preferences  - Čuvanje preferenci
GET    /api/onboarding/status       - Da li je završen onboarding
```

**Fajlovi:**
- `server/middleware/auth.ts` - JWT middleware
- `server/middleware/checkSubscription.ts` - Provera premium statusa
- `server/middleware/rateLimit.ts` - Rate limiting za free tier
- `server/routes/auth.ts` - Auth rute
- `server/routes/onboarding.ts` - Onboarding wizard rute
- `server/utils/password.ts` - Hash/verify lozinki
- `server/utils/jwt.ts` - JWT generisanje/verifikacija

### 1.2 Frontend - Auth UI

**Komponente:**
- `client/src/pages/Login.tsx` - Login stranica
- `client/src/pages/Register.tsx` - Registracija
- `client/src/pages/ForgotPassword.tsx` - Zaboravljena lozinka
- `client/src/pages/Onboarding.tsx` - Multi-step onboarding wizard
- `client/src/components/auth/ProtectedRoute.tsx` - Zaštita ruta
- `client/src/components/auth/PremiumRoute.tsx` - Zaštita premium ruta
- `client/src/contexts/AuthContext.tsx` - Globalno auth stanje
- `client/src/hooks/useAuth.ts` - Auth hook
- `client/src/hooks/useSubscription.ts` - Subscription hook

**Rute:**
- `/login` - Prijava
- `/register` - Registracija
- `/forgot-password` - Reset lozinke
- `/onboarding` - Setup wizard (posle registracije)
- `/dashboard` - Glavni dashboard (zaštićeno)

**State management:**
- React Context za auth stanje
- httpOnly cookie za JWT token (sigurnije od localStorage)
- React Query za server state

---

## 🎨 Faza 2: Dashboard struktura i nivoi pristupa

### 2.1 Dashboard layout

**Komponente:**
- `client/src/pages/Dashboard.tsx` - Glavni dashboard
- `client/src/components/dashboard/DashboardNav.tsx` - Sidebar navigacija
- `client/src/components/dashboard/DashboardHeader.tsx` - Top header sa user menu
- `client/src/components/dashboard/UpgradeBanner.tsx` - Banner za upgrade (free korisnici)
- `client/src/components/dashboard/FeatureLock.tsx` - Overlay za zaključane feature-e
- `client/src/components/dashboard/UsageMeter.tsx` - Prikaz usage limita (free tier)
- `client/src/components/dashboard/WelcomeWidget.tsx` - Dobrodošli widget
- `client/src/components/dashboard/QuickStats.tsx` - Brza statistika

### 2.2 Feature-e po nivoima pristupa

#### **NIVO 1: Neregistrovani korisnici (Javni pristup)**

**Pristup:**
- Blog postovi (čitanje)
- Testimonials (pregled)
- BMI kalkulator (javno dostupan)
- Kontakt forma
- Informacije o planovima (Start, Balans, Transformacija)
- Preview recepti (samo 3 recepti bez detalja)
- **Call-to-action za registraciju na SVAKOJ stranici**

**UI Elementi:**
- Banner: "Registruj se besplatno i isprobaj Premium 7 dana!"
- Blur overlay na premium sadržaju
- Feature comparison tabela (Free vs Premium vs Planovi)

---

#### **NIVO 2: Registrovani korisnici (Free Trial)**

**VAŽNA IZMENA:** Free tier je sada TRIAL, ne puna funkcionalnost!

**Pristup:**

**RECEPTI:**
- ✅ Samo **3 recepta UKUPNO** (ne dnevno!) kao demo
- ✅ Bez filtera
- ✅ Bez mogućnosti čuvanja favorita
- ❌ Nema meal planner-a
- ❌ Nema shopping list-e

**E-BOOKOVI:**
- ✅ Samo **1 besplatni mini e-book** ("Vodič za početnike" - 10 strana)
- ❌ Nema pristupa premium e-bookovima (15+ knjiga)

**RECEPT DANA:**
- ✅ Vidi naslov i sliku
- ❌ Ne vidi sastojke i instrukcije (blur overlay)
- ❌ Ne može da sačuva

**AI ASISTENT:**
- ✅ **2 AI poruke UKUPNO** (trial)
- ❌ Bez personalizacije
- ❌ Bez context history
- ❌ Generičke odgovore

**PROFIL I POSTAVKE:**
- ✅ Pregled i edit profila
- ✅ Osnovne postavke (alergije, ciljevi - ali ne utiču na AI)
- ✅ BMI kalkulator

**TRACKING:**
- ✅ Unos težine (samo trenutna, bez historije)
- ❌ Nema grafova napretka
- ❌ Nema merenja (obim struka, grudi, itd.)
- ❌ Nema progress photos

**GAMIFICATION:**
- ❌ Nema achievements
- ❌ Nema streaks
- ❌ Nema leaderboard

**COMMUNITY:**
- ❌ Nema pristupa zajednici

**UI Elementi:**
- **Konstantan upgrade banner** na svakoj stranici
- Usage meter: "Iskoristio si 2/3 recepta. Upgrade za neograničeno!"
- Modal nakon svake akcije: "Želiš više? Probaj Premium!"
- Blur overlay + lock ikona na premium sadržaju
- Countdown timer: "Premium trial ističe za 7 dana"

---

#### **NIVO 3: Premium korisnici (4€/mesec ili 35€/godišnje)**

**PUNA FUNKCIONALNOST - SELF-SERVICE ALATI:**

**RECEPTI:**
- ✅ **Neograničeni pristup** svim receptima (500+ recepata)
- ✅ Napredno filtriranje (kategorija, kalorije, alergije, vreme pripreme)
- ✅ Pretraga po sastojcima
- ✅ **Neograničeni favoriti**
- ✅ Personalizovane preporuke na osnovu preferenci
- ✅ **7-dnevni meal planner** (drag & drop)
- ✅ **Auto-generisana shopping lista** iz meal plana
- ✅ Recipe collections ("Moji brzi doručci", "Low carb večere")

**E-BOOKOVI:**
- ✅ Pristup **15+ premium e-bookovima**:
  - "7 Dana Zdravih Doručaka"
  - "Meal Prep Za Početnike"
  - "Vodič Za Čitanje Nutritivnih Deklaracija"
  - "50 Zdravih Zamjena"
  - "Keto Vodič Za Balkanski Način Ishrane"
  - "Brze Večere Za Radne Dane"
  - "Recepti Sa 5 Sastojaka"
  - + mesečno novi e-book
- ✅ PDF download
- ✅ Printable templates (meal prep, shopping list)
- ✅ Food swap charts

**RECEPT DANA:**
- ✅ **Pun pristup** receptu dana (sastojci, instrukcije, nutritivne vrednosti)
- ✅ Mogućnost čuvanja u favorite
- ✅ Dodavanje u meal planner
- ✅ Historie recepata dana

**AI ASISTENT (NUTRI AI):**
- ✅ **Neograničen AI chat**
- ✅ **Personalizovani odgovori** na osnovu profila (ciljevi, alergije, preferenci)
- ✅ **Context-aware** (AI pamti prethodne razgovore)
- ✅ Može da generiše meal plans
- ✅ Može da prilagodi recepte ("Zameni piletinu sa tofuom")
- ✅ Može da odgovori na pitanja o ishrani
- ✅ **PDF export konverzacija**
- ✅ Branded kao "Tvoj AI Nutritionist"

**TRACKING NAPRETKA:**
- ✅ **Tracking težine** (sa grafovima i trendovima)
- ✅ **Body measurements** (obim struka, grudi, bedra, ruka)
- ✅ **Progress photos** (before/after galerija)
- ✅ **Weekly/Monthly insights**:
  - "Izgubio si 2kg ovog meseca!"
  - "Prosečan unos kalorija: 1800kcal/dan"
- ✅ Goal tracking (postavljanje ciljeva i praćenje napretka)
- ✅ **Export podataka** (PDF report)

**HABIT TRACKERS:**
- ✅ **Water intake tracker** (dnevni cilj, podsetnici)
- ✅ **Meal timing tracker** (kada jedeš obroke)
- ✅ Sleep tracker (kvalitet sna vs ishrana)
- ✅ Mood & Energy tracker (kako se osećaš)
- ✅ **AI insights**: "Primetio sam da kada spavaš <6h, unosiš više kalorija"

**GAMIFICATION:**
- ✅ **Achievement sistem**:
  - 🏆 "First Recipe Saved"
  - 🔥 "7 Day Login Streak"
  - 🎯 "Lost First 5kg"
  - 💎 "30 Days Premium Member"
  - ⭐ "Helped 10 Community Members"
- ✅ **Streak system** (login, meal logging, water intake)
- ✅ **Leaderboards**:
  - Najdosljedniji korisnici meseca
  - Najveći progress meseca
  - Najkorisniji član zajednice
- ✅ **Badge collection** (unlock special badges)

**COMMUNITY (NOVA FUNKCIONALNOST):**
- ✅ **Podeli napredak** (progress photos, merenja, achievements)
- ✅ **Like i komentariši** druge korisnike
- ✅ **Weekly challenges** (npr. "30 dana bez šećera")
- ✅ **Success stories** (featured transformacije)
- ✅ **Recipe sharing** (podeli svoje kolekcije)
- ✅ **Support sistem** (pitaj zajednicu)
- ✅ **Accountability partners** (pronađi workout buddy-ja)

**NOTIFIKACIJE (SMART):**
- ✅ **Personalizovani podsetnici**:
  - "Nisi uneo obrok danas"
  - "Vreme je za čašu vode!"
  - "Sutra je utorak, pripremi meal prep"
- ✅ **Weekly progress report** (email summary)
- ✅ **Motivacione poruke** (na osnovu tvog napretka)
- ✅ **Community notifications** (neko te je lajkovao, novi komentar)

**CONTENT:**
- ✅ **Premium blog članci** (weekly insights, research)
- ✅ **Seasonal eating guides**
- ✅ **Newsletter** (1x nedeljno, ekskluzivan sadržaj)

**PODRŠKA:**
- ✅ **Prioritetna email podrška** (odgovor u 24h)
- ✅ **FAQ i Help Center**

**REFERRAL PROGRAM:**
- ✅ **Pozovi prijatelja**:
  - Prijatelj dobija 20% popust
  - Ti dobijaš 1 mesec FREE
  - 5 referrala = cela godina FREE
- ✅ Unique referral link
- ✅ Tracking referrala

---

#### **NIVO 4: Kupci planova (Start/Balans/Transformacija)**

**KLJUČNA IZMENA:** Planovi UKLJUČUJU Premium pristup + personalizovano coaching!

**ŠTA DOBIJAJU:**

**SVE IZ PREMIUM TIER-a + COACHING:**

**START PLAN (90 KM = ~46€):**
- ✅ **Premium membership UKLJUČEN** (godišnji, vrednost 35€)
- ✅ **1 personalizovana konsultacija** (60 minuta, video call)
- ✅ **Prilagođen plan ishrane** (1 mesec)
- ✅ **Email podrška** (odgovor u 24h)
- ✅ **Calendly link** za zakazivanje termina (nakon kupovine)
- ✅ **Tracking napretka** sa tvojim pregledom
- ✅ **Pristup Notion planu** (ako koristiš Notion za klijente)

**BALANS PLAN (190 KM = ~97€):**
- ✅ **Premium membership UKLJUČEN** (godišnji)
- ✅ **3 konsultacije** (inicijalna + 2 follow-up)
- ✅ **Prilagođen plan ishrane** (3 meseca)
- ✅ **Bi-weekly check-ins** (email ili WhatsApp)
- ✅ **WhatsApp podrška** (brži odgovori)
- ✅ **Prilagođavanje plana** tokom trajanja
- ✅ **Weekly progress reviews**

**TRANSFORMACIJA PLAN (390 KM = ~199€):**
- ✅ **Premium membership UKLJUČEN** (godišnji)
- ✅ **6 konsultacija** (mesečno + po potrebi)
- ✅ **Prilagođen plan ishrane** (6 meseci)
- ✅ **Weekly check-ins** (WhatsApp ili video)
- ✅ **WhatsApp podrška** (prioritetna, odgovor isti dan)
- ✅ **Meal prep coaching** (kako da pripremiš obroke)
- ✅ **Accountability coaching** (motivacija, podrška)
- ✅ **Prilagođavanje plana** bilo kada
- ✅ **Progress milestones** (celebration i rewards)
- ✅ **LIFETIME Premium pristup** nakon završetka 6 meseci!

**DODATNE FUNKCIONALNOSTI ZA KUPCE PLANOVA:**

**DASHBOARD SEKCIJA: "Moj Plan"**
- ✅ Pregled trenutnog plana (koje feature-e imaš)
- ✅ Preostale konsultacije
- ✅ Calendly link (zakaži sledeći termin)
- ✅ Chat sa nutricionistom (za Balans i Transformacija)
- ✅ Upload progress photos (direktno tebi)
- ✅ Deljenje napretka sa nutricionistom
- ✅ Milestones i ciljevi (koje si postavio u konsultacijama)

**INTEGRACIJA SA NOTION (Backend):**
- Kada neko kupi plan, automatski se kreira:
  - Notion stranica za tog klijenta
  - Tracking database
  - Plan ishrane template
  - Ti dobijaš notifikaciju da imaš novog klijenta

---

### 2.3 Dashboard Sekcije (Navigation)

**SIDEBAR NAVIGACIJA:**

```
🏠 Dashboard (home)
📖 Recepti
📚 E-bookovi
🍽️ Recept Dana
🤖 AI Asistent
👥 Zajednica (Premium/Planovi)
📊 Napredak (Premium/Planovi)
🎯 Moj Plan (samo kupci planova)
⚙️ Postavke
```

**DASHBOARD HOME:**
- Welcome widget (personalizovano pozdrav)
- Daily recipe featured (velika kartica)
- Quick stats (recepti sačuvani, streak, progress)
- Upcoming features (teaser za premium ako si free)
- Community highlights (ako si premium)
- Usage meter (ako si free)

---

## 🍳 Faza 3: Premium Feature 1 - Besplatni zdravi recepti

### 3.1 API integracija

**Koristi srpsku bazu podataka + besplatne API-je:**

**GLAVNI SOURCES:**

1. **Serbian Food Composition Database (FCDB)**
   - URL: http://104.155.19.23/serbianfood/
   - 1,046+ srpskih namirnica i 129 tradicionalnih jela
   - FREE pristup (kontaktiraj za API pristup)

2. **Edamam Recipe API**
   - FREE tier: 5,000 poziva/mesec
   - Recipe search, nutrition data
   - Filter po alergijama, diet type

3. **Spoonacular API**
   - FREE tier: 150 poziva/dan
   - Bolja dokumentacija
   - Nutrition analysis

4. **TheMealDB**
   - Potpuno BESPLATNO
   - 283 meals sa slikama
   - Može se koristiti kao fallback

5. **Tvoji custom recepti (Notion baza)**
   - Najbolje za srpsku kuhinju
   - Potpuna kontrola

**STRATEGIJA:**
- Kombiniraj sve sources
- Cache sve rezultate u database
- Korisnici prvo vide tvoje recepte (srpski)
- Zatim API recepte (prevedene na srpski preko DeepL)

### 3.2 Backend

**Fajlovi:**
- `server/routes/recipes.ts` - Recipe API rute
- `server/services/recipeService.ts` - Logika za filtriranje i kombinovanje sources
- `server/services/translationService.ts` - DeepL integracija za prevod
- `server/services/cacheService.ts` - Redis ili memory cache

**API Endpointi:**

```
GET    /api/recipes                  - Lista recepata (sa paginacijom)
GET    /api/recipes/:id              - Detalji recepta
POST   /api/recipes/search           - Pretraga recepata
GET    /api/recipes/categories       - Kategorije
GET    /api/recipes/daily            - Recept dana
POST   /api/recipes/:id/favorite     - Dodaj u favorite (Premium)
DELETE /api/recipes/:id/favorite     - Ukloni iz favorita
GET    /api/recipes/favorites        - Moji favoriti (Premium)
POST   /api/recipes/collections      - Kreiraj kolekciju (Premium)
GET    /api/recipes/recommendations  - Personalizovane preporuke (Premium)
```

**Rate Limiting za FREE tier:**
```javascript
// server/middleware/rateLimit.ts
const recipeLimiter = {
  free: {
    total: 3, // Samo 3 recepta ukupno
    period: 'lifetime', // Ne resetuje se
  },
  premium: {
    unlimited: true,
  }
};
```

### 3.3 Funkcionalnosti

**ZA SVE KORISNIKE (Basic Info):**
- Pretraga recepata (samo 3 rezultata za free)
- Kategorije (doručak, ručak, večera, užina, desert)

**ZA PREMIUM:**
- Filteri:
  - Kategorije
  - Alergije (automatski iz profila)
  - Dijetni tip (keto, vegan, low-carb, itd.)
  - Vreme pripreme
  - Težina (lako, srednje, teško)
  - Kalorije (range slider)
  - Makronutrijenti (proteini, ugljeni hidrati, masti)
- Favoriti (neograničeno)
- Kolekcije (kreiraj svoje grupe recepata)
- Meal planner (dodaj recepte u nedelju)
- Shopping list generator
- Recipe history (šta si spremao)

### 3.4 Frontend

**Komponente:**
- `client/src/pages/dashboard/Recipes.tsx` - Lista recepata
- `client/src/components/recipes/RecipeCard.tsx` - Kartica recepta
- `client/src/components/recipes/RecipeFilters.tsx` - Filteri (samo Premium)
- `client/src/components/recipes/RecipeDetail.tsx` - Detalji recepta
- `client/src/components/recipes/RecipeDetailLocked.tsx` - Zaključan recept (Free tier)
- `client/src/components/recipes/FavoriteButton.tsx` - Favorite dugme
- `client/src/components/recipes/AddToMealPlan.tsx` - Dodaj u planer (Premium)
- `client/src/components/recipes/RecipeCollections.tsx` - Kolekcije (Premium)
- `client/src/components/recipes/MealPlanner.tsx` - 7-dnevni planer (Premium)
- `client/src/components/recipes/ShoppingList.tsx` - Shopping lista (Premium)

**UI Design (koristi postojeće boje):**
```css
.recipe-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #E5E7EB;
  transition: all 0.3s;
}

.recipe-card:hover {
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  transform: translateY(-4px);
}

.recipe-locked {
  position: relative;
  filter: blur(4