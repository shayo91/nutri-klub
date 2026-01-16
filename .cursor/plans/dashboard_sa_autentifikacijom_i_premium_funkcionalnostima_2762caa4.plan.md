---
name: Dashboard sa autentifikacijom i premium funkcionalnostima
overview: Implementacija kompletnog sistema autentifikacije, dashboard-a sa 5 premium feature-a (recepti, e-bookovi, recept dana, AI asistent, dodatni feature), i Stripe integracije za godišnju pretplatu od 35€. Koristićemo besplatne API-je i servise gde je moguće.
todos: []
---

# Plan implementacije Dashboard-a sa autentifikacijom i premium funkcionalnostima

## Pregled arhitekture

Aplikacija će imati četiri nivoa pristupa:

1. **Neregistrovani korisnici (Javni)** - postojeći sadržaj (blog, testimonials, kontakt, BMI kalkulator)
2. **Registrovani korisnici (Free)** - osnovni dashboard pristup sa ograničenim feature-ima
3. **Premium korisnici** - pristup svim feature-ima (35€/godišnje subscription)
4. **Kupci planova** - korisnici koji su kupili postojeće planove (Start, Balans, Transformacija) preko Stripe-a

## Faza 1: Autentifikacija i autorizacija

### 1.1 Backend - Auth sistem

**Tehnologije:**

- `bcrypt` za hash lozinki
- `jsonwebtoken` za JWT tokene
- Drizzle ORM za korisnike (već postoji `users` tabela u `shared/schema.ts`)
- Express middleware za zaštitu ruta

**Nove tabele u bazi:**

- Proširiti `users` tabelu: dodati `email`, `password_hash`, `role` (user/premium), `subscription_status`, `subscription_expires_at`, `created_at`
- `user_preferences` tabela: alergije, nepoželjne namirnice, ciljevi
- `subscriptions` tabela: Stripe subscription ID, status, payment history

**API endpointi:**

- `POST /api/auth/register` - registracija
- `POST /api/auth/login` - prijava
- `POST /api/auth/logout` - odjava
- `GET /api/auth/me` - trenutni korisnik
- `POST /api/auth/refresh` - refresh token
- `GET /api/auth/check-subscription` - provera premium statusa

**Fajlovi:**

- `server/middleware/auth.ts` - JWT middleware
- `server/routes/auth.ts` - auth rute
- `server/utils/password.ts` - hash/verify lozinki
- `server/utils/jwt.ts` - JWT generisanje/verifikacija

### 1.2 Frontend - Auth UI

**Komponente:**

- `client/src/pages/Login.tsx` - login stranica
- `client/src/pages/Register.tsx` - registracija
- `client/src/components/auth/ProtectedRoute.tsx` - zaštita ruta
- `client/src/contexts/AuthContext.tsx` - globalno auth stanje
- `client/src/hooks/useAuth.ts` - auth hook

**Rute:**

- `/login` - prijava
- `/register` - registracija
- `/dashboard` - glavni dashboard (zaštićeno)

**State management:**

- React Context za auth stanje
- localStorage za JWT token (ili httpOnly cookie za sigurnost)
- React Query za server state

## Faza 2: Dashboard struktura i nivoi pristupa

### 2.1 Dashboard layout

**Komponente:**

- `client/src/pages/Dashboard.tsx` - glavni dashboard
- `client/src/components/dashboard/DashboardNav.tsx` - navigacija
- `client/src/components/dashboard/SubscriptionBanner.tsx` - banner za upgrade
- `client/src/components/dashboard/FeatureLock.tsx` - komponenta za zaključane feature-e

### 2.2 Feature-e po nivoima pristupa

**Neregistrovani korisnici (Javni pristup):**

- Blog postovi (čitati)
- Testimonials (pregled)
- BMI kalkulator
- Kontakt forma
- Informacije o planovima (Start, Balans, Transformacija)
- Call-to-action za registraciju na svim premium feature-ima

**Registrovani korisnici (Free tier):**

- Profil korisnika (pregled i edit)
- Postavke (alergije, preferencije, ciljevi)
- Ograničen pregled recepata (3-5 recepata/dan)
- Ograničen pregled e-bookova (samo besplatni)
- Ograničen AI chat (5 poruka/dan)
- Recept dana (pregled, ali ne može da sačuva)
- Favoriti (do 10 recepata)
- Tracking napretka (osnovni)
- Upgrade banner na svim premium feature-ima

**Premium korisnici (35€/godišnje):**

- Neograničen pristup svim receptima
- Neograničen pristup svim e-bookovima
- Neograničen AI chat
- Recept dana sa opcijom čuvanja
- Neograničeni favoriti
- Meal planning (7-dnevni plan)
- Personalizovani plan ishrane
- Shopping list generator
- Napredno tracking napretka

**Kupci planova (Start/Balans/Transformacija):**

- Pristup specifičnim sadržajima vezanim za kupljeni plan
- Calendly link za rezervaciju termina (nakon uspešne kupovine)
- Tracking napretka za kupljeni plan
- Podrška putem poruka (prema planu)
- Mogućnost upgrade-a na premium

**Dashboard sekcije:**

1. Recepti (free: ograničeno, premium: neograničeno)
2. E-bookovi (free: samo besplatni, premium: svi)
3. Recept dana (free: pregled, premium: sa čuvanjem)
4. AI Asistent (free: 5/dan, premium: neograničeno)
5. Profil korisnika (svi registrovani)
6. Postavke (alergije, preferencije) (svi registrovani)
7. Moji planovi (kupci planova)
8. Tracking napretka (svi registrovani, različiti nivoi)

## Faza 3: Premium feature 1 - Besplatni zdravi recepti

### 3.1 API integracija

**Besplatni API opcije:**

1. **Edamam Recipe API** - 5,000 poziva/mesec besplatno

   - Recepti sa kalorijama, makronutrijentima
   - Filteri po kategorijama, alergijama
   - Pretraga po namirnicama

2. **Spoonacular API** - 150 poziva/dan besplatno

   - Slične funkcionalnosti
   - Bolja dokumentacija

**Backend:**

- `server/routes/recipes.ts` - API rute za recepte
- `server/services/recipeService.ts` - logika za filtriranje
- Cache rezultata (Redis ili memory cache) da smanjimo API pozive

**Funkcionalnosti:**

- Pretraga recepata
- Filteri: kategorije (doručak, ručak, večera), alergije, nepoželjne namirnice
- Prikaz: kalorije, makronutrijenti, vreme pripreme, težina
- Favoriti (čuvanje u bazi)
- Meal planning (predlog za dan/nedelju)

**Frontend:**

- `client/src/pages/dashboard/Recipes.tsx` - lista recepata
- `client/src/components/recipes/RecipeCard.tsx` - kartica recepta
- `client/src/components/recipes/RecipeFilters.tsx` - filteri
- `client/src/components/recipes/RecipeDetail.tsx` - detalji recepta
- `client/src/components/recipes/MealPlanner.tsx` - planer obroka

**Notion integracija:**

- Možeš dodati custom recepte u Notion bazu "Recipes"
- Backend kombinuje Notion recepte + API recepte

## Faza 4: Premium feature 2 - E-book biblioteka

### 4.1 E-book sistem

**Backend:**

- Notion baza "Ebooks" sa poljima: title, description, category, file_url, cover_image, is_premium
- `server/routes/ebooks.ts` - API za e-bookove
- Download tracking u bazi (ko je preuzeo šta)

**Frontend:**

- `client/src/pages/dashboard/Ebooks.tsx` - biblioteka
- `client/src/components/ebooks/EbookCard.tsx` - kartica e-booka
- `client/src/components/ebooks/EbookReader.tsx` - pregled (opcionalno)
- Kategorije: "Zdravlje", "Recepti", "Planovi ishrane", itd.

**Fajl storage:**

- PDF fajlovi u `attached_assets/ebooks/` folderu
- Backend servira fajlove preko `/api/ebooks/:id/download` (zaštićeno)

## Faza 5: Premium feature 3 - Recept dana

### 5.1 Dnevni recept sistem

**Backend:**

- `server/routes/daily-recipe.ts` - API za recept dana
- Logika: random recept iz kategorije ili Notion baze
- Cache za dan (isti recept ceo dan)
- Tracking: ko je video recept dana

**Frontend:**

- `client/src/components/dashboard/DailyRecipe.tsx` - widget na dashboardu
- Prikaz: velika kartica sa receptom, "Spremi u favorit", "Dodaj u planer"

## Faza 6: Premium feature 4 - Nutri AI Asistent

### 6.1 AI Chat integracija

**Besplatni AI opcije:**

1. **Hugging Face Inference API** - besplatno za manje modele

   - Koristi `mistral-7b-instruct` ili sličan model
   - Nutrition-specifičan fine-tuned model ako postoji

2. **Ollama (self-hosted)** - potpuno besplatno

   - Lokalni deployment
   - Koristi `llama2` ili `mistral` model

3. **OpenRouter API** - besplatni tier sa ograničenjima

   - Pristup različitim modelima

**Backend:**

- `server/routes/ai-chat.ts` - chat endpoint
- `server/services/aiService.ts` - AI integracija
- Context management (pamćenje konverzacije)
- Rate limiting (npr. 20 poruka/dan za free tier)

**Frontend:**

- `client/src/components/dashboard/AIChat.tsx` - chat interfejs
- Chat history u bazi ili localStorage
- UI: chat bubbles, typing indicator, message history

**Prompt engineering:**

- System prompt fokusiran na nutricionizam
- Kontekst: korisnikove alergije, ciljevi, preferencije

## Faza 7: Premium feature 5 - Dodatni feature predlog

### 7.1 Predlog: Personalizovani plan ishrane

**Funkcionalnosti:**

- Korisnik unosi: ciljeve (gubitak težine, dobitak mišića, održavanje), aktivnost, preferencije
- AI generiše 7-dnevni plan ishrane
- Integracija sa receptima (koristi recepte iz feature 1)
- Shopping list generator
- Progress tracking (opcionalno)

**Alternativni predlozi:**

- **Nutrični dnevnik** - unos obroka, tracking kalorija
- **Water intake tracker** - praćenje unosa vode
- **Meal prep planner** - planiranje meal prep-a
- **Community forum** - diskusije, deljenje recepata

## Faza 8: Stripe integracija za plaćanje

### 8.1 Stripe setup

**Stripe proizvodi:**

1. **Premium Membership** - 35€/godišnje (recurring subscription)
2. **Start Plan** - 90 KM (one-time payment)
3. **Balans Plan** - 190 KM (one-time payment)
4. **Transformacija Plan** - 390 KM (one-time payment)

**Stripe konfiguracija:**

- Kreiraj Stripe account (besplatno)
- Dodaj sve produkte u Stripe Dashboard
- Webhook endpoint za payment events
- Success/Cancel redirect URL-ovi

### 8.2 Backend - Stripe integracija

**Fajlovi:**

- `server/routes/stripe.ts` - Stripe webhook handler
- `server/routes/payments.ts` - checkout/create session za planove
- `server/routes/subscription.ts` - checkout za premium subscription
- `server/services/stripeService.ts` - Stripe logika

**API endpointi:**

- `POST /api/payments/create-checkout` - kreira Stripe Checkout session za planove
  - Body: `{ planId: 'start' | 'balans' | 'transformacija', userId: number }`
  - Vraća: Stripe Checkout URL
- `POST /api/subscription/create-checkout` - kreira Stripe Checkout za premium
  - Body: `{ userId: number }`
  - Vraća: Stripe Checkout URL
- `POST /api/stripe/webhook` - prima Stripe events
  - Handluje: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- `GET /api/payments/my-plans` - vraća kupljene planove korisnika (zaštićeno)

**Database tabele:**

- `subscriptions` tabela:
  - `user_id`, `stripe_subscription_id`, `type` ('premium' | 'plan'), `status`, `plan_type` ('start' | 'balans' | 'transformacija' | 'premium'), `stripe_payment_intent_id`, `amount_paid`, `currency`, `purchased_at`, `expires_at` (za planove), `current_period_end` (za premium)

**Stripe webhook events:**

- `checkout.session.completed` - uspešna kupovina
  - Ažurira `subscriptions` tabelu
  - Postavlja `user.plan_status`
  - Šalje email sa Calendly linkom (za planove)
- `customer.subscription.updated` - promena premium subscriptiona
- `customer.subscription.deleted` - otkazana premium subscription

### 8.3 Frontend - Stripe integracija

**Komponente:**

- `client/src/pages/Subscription.tsx` - premium subscription stranica
- `client/src/pages/PurchasePlan.tsx` - kupovina planova (modifikacija postojeće)
- `client/src/components/subscription/UpgradeButton.tsx` - CTA dugme za premium
- `client/src/components/payments/PurchaseButton.tsx` - dugme za kupovinu plana
- `client/src/components/payments/PaymentSuccess.tsx` - success stranica sa Calendly linkom
- `client/src/components/payments/PaymentCancel.tsx` - cancel stranica

**Stripe Checkout flow:**

1. Korisnik klikne "Kupi plan" ili "Upgrade na Premium"
2. Frontend poziva backend endpoint (`/api/payments/create-checkout` ili `/api/subscription/create-checkout`)
3. Backend kreira Stripe Checkout session i vraća URL
4. Frontend redirectuje korisnika na Stripe Checkout stranicu
5. Nakon uspešne kupovine, Stripe redirectuje na `/payment/success?session_id=xxx`
6. Frontend poziva backend da verifikuje payment
7. Backend proverava Stripe session i ažurira bazu
8. Za planove: prikazuje Calendly link za rezervaciju termina
9. Za premium: automatski aktivira premium pristup

### 8.4 Calendly integracija

**Backend:**

- `server/services/calendlyService.ts` - Calendly integracija
- Generisanje Calendly linka sa korisničkim podacima
- `GET /api/calendly/link` - vraća Calendly link za korisnika (zaštićeno)

**Frontend:**

- `client/src/components/calendly/CalendlyWidget.tsx` - embed Calendly widget
- Prikaz na `/payment/success` stranici nakon kupovine plana
- Link u dashboard-u za korisnike sa kupljenim planovima

**Calendly setup:**

- Kreiraj Calendly account (besplatno)
- Podesi event types (konsultacije)
- Integriši Calendly API (opcionalno) ili koristi embed widget
- Preporučeno: koristi Calendly embed widget (jednostavnije)

**Flow nakon kupovine:**

1. Korisnik uspešno kupi plan preko Stripe-a
2. Backend ažurira `subscriptions` tabelu
3. Frontend prikazuje success stranicu sa:

   - Porukom o uspešnoj kupovini
   - Calendly embed widget-om ili linkom
   - Informacijama o kupljenom planu
   - Linkom ka dashboard-u

## Faza 9: Notion CMS integracija

### 9.1 Notion baze za dashboard

**Nove Notion baze:**

1. **Recipes** (custom recepti)

   - Title, Description, Category, Ingredients, Instructions, Calories, Macros, Image

2. **Ebooks**

   - Title, Description, Category, File URL, Cover Image, Is Premium

3. **Daily Recipes** (opcionalno)

   - Date, Recipe ID, Featured

**Backend:**

- Proširiti `server/notion.ts` sa novim funkcijama
- Cache Notion podataka (da smanjimo API pozive)

## Faza 10: UI/UX dizajn

### 10.1 Dashboard dizajn

**Dizajn principi:**

- Koristi postojeće Shadcn UI komponente
- Tailwind CSS za styling sa postojećim bojama
- Framer Motion za animacije
- Responsive design (mobile-first)
- Konzistentnost sa postojećim dizajnom

**Postojeće boje (iz `index.css`):**

- Primary: `#1F7A5C` (zelena) - `hsl(153 56% 75%)`
- Primary Light: `hsl(153 56% 82%)`
- Primary Dark: `hsl(153 56% 65%)`
- Secondary: `hsl(120 34% 92%)` (svetlo zelena)
- Accent: `hsl(80 13% 95%)`
- Background: `hsl(var(--tertiary))` - svetlo bež
- Text: `hsl(var(--dark))` - tamno siva
- Bež pozadine: `#F3E6D3`, `#ECF8F2`

**Dashboard layout:**

```
┌─────────────────────────────────────┐
│ Header (Logo, Nav, User Menu)      │
│ Boje: primary (#1F7A5C)           │
├─────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐          │
│ │ Daily    │ │ Quick    │          │
│ │ Recipe   │ │ Stats    │          │
│ │ (widget) │ │ (widget) │          │
│ └──────────┘ └──────────┘          │
│                                     │
│ ┌──────────────────────────────┐   │
│ │ Main Content Area            │   │
│ │ (Recepti/Ebooks/AI Chat)    │   │
│ │ Feature Lock overlay         │   │
│ │ (za free korisnike)          │   │
│ └──────────────────────────────┘   │
│                                     │
│ ┌──────────────────────────────┐   │
│ │ Upgrade Banner               │   │
│ │ (za free korisnike)          │   │
│ └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Feature Lock dizajn:**

- Overlay sa blur efektom na zaključanim feature-ima
- Badge "Premium" ili "Upgrade" na kartama
- Modal sa upgrade opcijom pri kliku
- Koristi postojeće boje: primary za CTA, muted za disabled state

**Komponente sa postojećim stilom:**

- Kartice: `bg-white`, `rounded-xl`, `shadow-lg`, `border border-[#E5E7EB]`
- Dugmad: `bg-[#1F7A5C] hover:bg-[#185F48]` (primary)
- Badge-ovi: `bg-[#ECF8F2]` ili `bg-[#F3E6D3]` sa odgovarajućim tekstom
- Hover efekti: `hover:shadow-xl`, `transition-all duration-300`

## Faza 11: Optimizacija i performanse

### 11.1 Performance optimizacije

- React Query caching za API pozive
- Image optimization (WebP format, lazy loading)
- Code splitting (lazy load dashboard komponente)
- API rate limiting
- Database indexing

### 11.2 Security

- JWT token expiration (15min access, 7d refresh)
- HTTPS u produkciji
- Input sanitization
- SQL injection prevention (Drizzle ORM već štiti)
- XSS prevention
- CSRF tokens

## Implementacioni todo listi

### Backend

- [ ] Proširiti `shared/schema.ts` sa novim tabelama (users, subscriptions, user_preferences, purchases)
- [ ] Implementirati auth middleware
- [ ] Kreirati auth rute (register, login, logout, me)
- [ ] Implementirati role-based access control (neregistrovani/free/premium/plan customer)
- [ ] Integrisati Edamam/Spoonacular API
- [ ] Kreirati recipe service sa filtriranjem i rate limiting za free korisnike
- [ ] Implementirati e-book download sistem sa pristup kontrolom
- [ ] Kreirati daily recipe endpoint
- [ ] Integrisati AI chat (Hugging Face/Ollama) sa rate limiting
- [ ] Implementirati Stripe checkout za planove (one-time payments)
- [ ] Implementirati Stripe checkout za premium (recurring subscription)
- [ ] Kreirati Stripe webhook handler
- [ ] Integrisati Calendly (embed widget ili API)
- [ ] Kreirati endpoint za Calendly link generisanje
- [ ] Proširiti Notion integraciju

### Frontend

- [ ] Kreirati AuthContext i useAuth hook
- [ ] Implementirati Login/Register stranice (sa postojećim dizajnom)
- [ ] Kreirati ProtectedRoute komponentu
- [ ] Implementirati Dashboard layout sa navigacijom
- [ ] Kreirati FeatureLock komponentu za zaključane feature-e
- [ ] Kreirati Recipes stranicu sa filterima i rate limiting indikatorom
- [ ] Implementirati Ebooks biblioteku sa pristup kontrolom
- [ ] Kreirati Daily Recipe widget
- [ ] Implementirati AI Chat interfejs sa rate limiting
- [ ] Kreirati Subscription/Upgrade stranicu
- [ ] Modifikovati Purchase stranicu za Stripe integraciju
- [ ] Kreirati PaymentSuccess stranicu sa Calendly widget-om
- [ ] Kreirati PaymentCancel stranicu
- [ ] Dodati user preferences form
- [ ] Kreirati "Moji planovi" sekciju za kupce planova
- [ ] Implementirati upgrade banner komponentu

### Database

- [ ] Migracije za nove tabele
- [ ] Seed podaci za testiranje
- [ ] Indexi za performanse

### Testing

- [ ] Unit testovi za auth
- [ ] Integration testovi za API
- [ ] E2E testovi za kritične flow-ove

## Tehnologije i biblioteke

**Backend:**

- `bcrypt` - hash lozinki
- `jsonwebtoken` - JWT tokene
- `stripe` - Stripe SDK
- `axios` - HTTP klijent za API pozive
- `node-cache` ili `ioredis` - caching

**Frontend:**

- `@stripe/stripe-js` - Stripe Checkout
- `react-hook-form` - forme
- `zod` - validacija (već u projektu)
- `date-fns` - datum manipulacija (već u projektu)

## Procena vremena

- Faza 1 (Auth): 2-3 dana
- Faza 2 (Dashboard + nivoi pristupa): 2-3 dana
- Faza 3 (Recepti sa rate limiting): 3-4 dana
- Faza 4 (E-bookovi sa pristup kontrolom): 1-2 dana
- Faza 5 (Recept dana): 1 dan
- Faza 6 (AI Chat sa rate limiting): 2-3 dana
- Faza 7 (Dodatni feature): 2-3 dana
- Faza 8 (Stripe za planove + premium + Calendly): 3-4 dana
- Faza 9 (Notion): 1 dan
- Faza 10 (UI/UX sa postojećim dizajnom): 2-3 dana
- Faza 11 (Optimizacija): 1-2 dana

**Ukupno: ~20-28 dana rada**

## Prioritet implementacije

1. **Visok prioritet:** Auth sistem, Dashboard osnova, Stripe integracija za planove, Calendly integracija
2. **Srednji prioritet:** Recepti (sa rate limiting), E-bookovi (sa pristup kontrolom), Recept dana, Stripe za premium
3. **Nizak prioritet:** AI Chat, Dodatni feature, Napredne optimizacije

## Dodatne napomene

### Rate limiting za free korisnike

- Recepti: 5 recepata/dan (ili 3 za neregistrovane)
- AI Chat: 5 poruka/dan
- E-bookovi: samo besplatni
- Favoriti: do 10 recepata

### Stripe payment flow

1. Korisnik klikne "Kupi plan" na PricingSection
2. Redirect na Stripe Checkout (one-time payment)
3. Nakon uspešne kupovine → redirect na `/payment/success`
4. Prikaz Calendly widget-a za rezervaciju termina
5. Ažuriranje korisničkog statusa u bazi

### Calendly integracija

- Preporučeno: Calendly embed widget (najjednostavnije)
- Alternativa: Calendly API za napredniju integraciju
- Link se generiše sa korisničkim podacima (ime, email, kupljeni plan)

## Napomene

- Svi API pozivi treba da imaju fallback na Notion ako eksterni API ne radi
- Implementirati rate limiting da zaštitimo besplatne API limite
- Koristiti environment varijable za sve API ključeve
- Logging za debugging i monitoring
- Error handling na svim nivoima