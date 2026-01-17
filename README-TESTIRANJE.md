# 🧪 Testiranje Nutri Klub Aplikacije

## 🚀 Brzo Pokretanje

```bash
# 1. Instalacija dependencies (već urađeno)
npm install

# 2. Pokretanje servera
npm run dev

# 3. Otvori browser
# http://localhost:5000
```

---

## 👤 Test Korisnici

### 1. **Free User** (Trial)
- **Email:** `test@example.com`
- **Password:** `password123`
- **Pristup:**
  - ✅ 3 recepta max
  - ✅ 2 AI poruke max
  - ✅ 1 e-book max
  - ❌ Bez filtera
  - ❌ Bez favorita

### 2. **Premium User**
- **Email:** `premium@example.com`
- **Password:** `password123`
- **Pristup:**
  - ✅ Neograničen broj recepata (45+)
  - ✅ Neograničen AI chat
  - ✅ Svi e-bookovi
  - ✅ Filteri i pretraga
  - ✅ Favoriti i kolekcije
  - ✅ Meal planner

### 3. **Admin User**
- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Pristup:**
  - ✅ Sve kao Premium
  - ✅ Admin panel (future)
  - ✅ Import recepata

---

## 🧭 Test Scenariji

### ✅ Scenario 1: Registracija i Onboarding

1. Klikni **"Registracija"** u headeru
2. Unesi podatke:
   - Ime: `Test`
   - Prezime: `Korisnik`
   - Email: `test2@example.com`
   - Password: `password123`
3. Klikni **"Registruj se"**
4. **Onboarding wizard** (3 koraka):
   - Korak 1: Odaberi cilj
   - Korak 2: Pol i nivo aktivnosti
   - Korak 3: Alergije (optional)
5. Ili klikni **"Preskoči"** za brz pristup
6. Dashboard se otvara! 🎉

### ✅ Scenario 2: Recepti Feature

**Free User:**
1. Login: `test@example.com` / `password123`
2. Klikni **"Recepti"** u sidebar-u
3. Vidiš **3 recepta** (demo)
4. Pokušaj da vidiš 4. recept → **Lock overlay**
5. Klikni **"Aktiviraj Premium"** za upgrade

**Premium User:**
1. Login: `premium@example.com` / `password123`
2. Klikni **"Recepti"** u sidebar-u
3. Vidiš **45+ recepata** sa pagination
4. **Filteri** (klikni "Filteri" dugme):
   - Kategorija: Doručak, Ručak, Večera...
   - Težina: Lako, Srednje, Teško
   - Max vreme: Slider (0-120 min)
   - Max kalorije: Slider (0-1000 kcal)
   - Min proteini: Slider (0-100g)
5. **Pretraga** (upiši u search bar):
   - "piletina" → Filtrira recepte
   - "losos" → Prikazuje sve sa lososom
6. **Klikni na recept** → Detaljna stranica:
   - Slika, opis, sastojci, koraci
   - Nutricione vrednosti
   - Dodaj u favorite ❤️

### ✅ Scenario 3: AI Assistant (Nutri AI)

**Free User (2 poruke):**
1. Login: `test@example.com` / `password123`
2. Klikni **"AI Asistent"** u sidebar-u
3. Vidiš: **"Preostalo: 2/2"**
4. **Brza pitanja:** Klikni bilo koje
5. AI odgovara instant! (mock response)
6. Pošalji još 1 poruku
7. Preostalo: **1/2**
8. Pošalji još 1 poruku
9. Preostalo: **0/2** → **Lock overlay**
10. Upgrade za neograničen chat

**Premium User (unlimited):**
1. Login: `premium@example.com` / `password123`
2. Klikni **"AI Asistent"** u sidebar-u
3. Vidiš: **"Premium - Neograničeno"** ✨
4. **Brza pitanja:** Testirај:
   - "Koji recept preporučuješ za večeras?"
   - "Kako da izgubim 5kg za mesec dana?"
   - "Šta da jedem za doručak?"
5. AI daje **personalizovane odgovore**
6. **Chat history** se čuva
7. Klikni **🗑️** (Trash icon) za brisanje istorije

### ✅ Scenario 4: Dashboard Overview

1. Login: bilo koji korisnik
2. Dashboard prikazuje:
   - **Welcome Widget** - Personalizovan pozdrav
   - **Quick Stats** - Statistika (locked za free)
   - **Recepti** - Brz pristup receptima
   - **AI Asistent** - Brz chat
   - **E-bookovi** - Downloadovi (placeholder)
   - **Recept Dana** - Daily recipe (placeholder)
   - **Upgrade Banner** - Za free korisnike

### ✅ Scenario 5: Logout & Navigation

1. Klikni **"Odjava"** u headeru (desktop)
2. Ili otvori **dropdown menu** (mobile)
3. Vraćaš se na početnu stranicu
4. Login/Register dugmad su vidljiva

---

## 📊 Šta je Implementirano

### ✅ Faza 1: Autentifikacija (100%)
- [x] User registration
- [x] User login/logout
- [x] JWT token auth
- [x] Protected routes
- [x] Onboarding wizard (3 koraka)
- [x] Password hashing (bcrypt)

### ✅ Faza 2: Dashboard Layout (100%)
- [x] Sidebar navigation
- [x] Dashboard header
- [x] Welcome widget
- [x] Quick stats
- [x] Usage meters (free tier)
- [x] Upgrade banners
- [x] Feature lock komponente

### ✅ Faza 3: Recepti Feature (100%)
- [x] Database schema (recipes, favorites, collections)
- [x] Backend service (RecipeService)
- [x] API integration (TheMealDB - FREE)
- [x] 45+ recepata seed-ovano
- [x] Pagination & filtriranje
- [x] RecipeCard komponenta
- [x] RecipeFilters komponenta
- [x] RecipeDetail stranica
- [x] Rate limiting (3 recepta za free)
- [x] Premium features (unlimited, favorites)

### ✅ Faza 4: AI Assistant (100%)
- [x] Database schema (aiChatHistory)
- [x] AIService (Hugging Face API)
- [x] Mock responses (radi bez API key-a!)
- [x] Personalizovani system prompts
- [x] ChatMessage komponenta
- [x] TypingIndicator komponenta
- [x] QuickSuggestions komponenta
- [x] Rate limiting (2 poruke za free)
- [x] Chat history (Premium)
- [x] Context-aware chat (Premium)

### 🔄 Faza 5: E-bookovi Feature (TODO)
- [ ] Database schema
- [ ] Supabase/Cloudinary storage
- [ ] Upload/download funkcionalnost
- [ ] E-book grid
- [ ] Rate limiting (1 download za free)

---

## 🐛 Known Issues (Sve Popravljeno!)

✅ ~~React warning za `indicatorClassName`~~ - **FIXED**
✅ ~~Missing `date` import u schema-pg.ts~~ - **FIXED**
✅ ~~API rute vraćaju HTML~~ - **FIXED** (restart servera)
✅ ~~Onboarding loop~~ - **FIXED**
✅ ~~Skip button ne radi~~ - **FIXED**

---

## 📈 Statistika

| Feature | Status | Progress |
|---------|--------|----------|
| Authentication | ✅ Done | 100% |
| Dashboard | ✅ Done | 100% |
| Recipes | ✅ Done | 100% |
| AI Assistant | ✅ Done | 100% |
| E-books | 🔄 Pending | 0% |
| Tracking | 🔄 Pending | 0% |
| Payments (Stripe) | 🔄 Pending | 0% |

**Ukupan Progress:** **~65%** 🎉

---

## 🔥 Sledeći Koraci

1. **Testiranje** - Testiraj sve feature-e
2. **E-bookovi** - Implementirati download funkcionalnost
3. **Tracking** - Weight, meals, water intake
4. **Stripe Payment** - Premium subscriptions
5. **Deployment** - Deploy na Replit/Vercel

---

## 🆘 Help & Support

**Ako nešto ne radi:**

1. **Server greška?**
   ```bash
   # Zaustavi sve procese na portu 5000
   lsof -ti:5000 | xargs kill -9
   
   # Ponovo pokreni
   npm run dev
   ```

2. **Database greška?**
   ```bash
   # Obriši i resetuj bazu
   rm local.db
   npm run db:push
   npx tsx server/seed-users.ts
   npx tsx server/seed-recipes.ts
   ```

3. **API greška?**
   - Proveri da li je server pokrenut
   - Proveri da li si ulogovan
   - Proveri browser konzolu (F12)

4. **Build greška?**
   ```bash
   # Očisti cache
   rm -rf node_modules/.vite
   npm run dev
   ```

---

**Happy Testing! 🚀🎉**
