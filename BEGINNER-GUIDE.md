# 🎓 NUTRI KLUB - Vodič za početnike

> Kompletna dokumentacija za učenje React-a i MERN stack arhitekture kroz praktičan projekat

---

## 📚 Sadržaj

1. [Šta je ovaj projekat?](#-šta-je-ovaj-projekat)
2. [Tehnologije (MERN Stack + dodatci)](#-tehnologije-mern-stack--dodatci)
3. [Kako sve funkcioniše?](#-kako-sve-funkcioniše)
4. [Arhitektura projekta](#️-arhitektura-projekta)
5. [Tok podataka](#-tok-podataka)
6. [Struktura foldera](#-struktura-foldera)
7. [Ključni koncepti za početnike](#-ključni-koncepti-za-početnike)
8. [Kako se snimaju podaci?](#-kako-se-snimaju-podaci)
9. [Praktični primeri](#-praktični-primeri)
10. [Sigurnost](#-sigurnost)
11. [Kako pokrenuti projekat?](#-kako-pokrenuti-projekat)
12. [Za dalje učenje](#-za-dalje-učenje)

---

## 🎯 Šta je ovaj projekat?

**Nutri Klub** je web aplikacija za nutricioniste i njihove klijente. Ima:
- **Javni deo** - Blog, testimoniali, info o programima (bez prijave)
- **Dashboard** - Za registrovane korisnike (recepti, AI asistent, e-bookovi)
- **Premium tier** - Plaćeno membership sa dodatnim funkcijama
- **Admin panel** - Za nutricioniste da upravljaju sadržajem

### Nivoi pristupa:

| Nivo | Pristup | Cena |
|------|---------|------|
| **Javni** | Blog, BMI kalkulator, kontakt forma | Besplatno |
| **Free Trial** | 3 recepta, 2 AI poruke, 1 ebook | Besplatno |
| **Premium** | Neograničeno sve + community | 4€/mesec ili 35€/god |
| **Plan Buyers** | Premium + personalizovano coaching | 46-199€ |

---

## 💻 Tehnologije (MERN Stack + dodatci)

### MERN Stack (modifikovan)

| Komponenta | Tehnologija | Šta radi? |
|------------|-------------|-----------|
| **M** - MongoDB | ❌ Ne koristimo<br>✅ **PostgreSQL** (production)<br>✅ **SQLite** (local dev) | Baza podataka gde čuvamo sve informacije |
| **E** - Express | ✅ Express.js | Backend server koji prima zahteve i šalje odgovore |
| **R** - React | ✅ React 18 | Frontend - ono što korisnik vidi u browseru |
| **N** - Node.js | ✅ Node.js v22 | JavaScript runtime za backend |

### Dodatne tehnologije:

**Frontend (Client):**
- **Vite** - Brz build tool (zamena za webpack, 10x brži)
- **TypeScript** - JavaScript sa tipovima (hvata greške pre nego što se dese)
- **Wouter** - Lightweight router (navigacija između stranica)
- **TanStack Query** - Upravljanje podacima sa servera (auto caching, refetch)
- **Tailwind CSS** - Utility-first CSS framework (brz dizajn)
- **Shadcn UI** - Re-usable komponente (dugmad, forme, kartice)
- **Framer Motion** - Animacije i transitions
- **Radix UI** - Accessibility-first komponente

**Backend (Server):**
- **Drizzle ORM** - Type-safe komunikacija sa bazom (umesto raw SQL-a)
- **bcrypt** - Enkriptovanje lozinki (hash funkcija)
- **jsonwebtoken (JWT)** - Token-based autentifikacija korisnika
- **cookie-parser** - Čitanje i pisanje cookies-a
- **Notion API** - CMS za blog postove i sadržaj

**Baza podataka:**
- **SQLite** - Lokalni development (fajl baza na disku)
- **PostgreSQL (NeonDB)** - Production (serverless cloud baza)

---

## 🔄 Kako sve funkcioniše?

### 1. **Korisnik otvori browser** → `http://localhost:5000`

```
┌─────────────┐         HTTP Request          ┌──────────────┐
│   Browser   │ ────────────────────────────→ │ Express      │
│   (Client)  │                                │ Server       │
│             │ ←──────────────────────────── │ (Backend)    │
└─────────────┘    JSON Response (data)       └──────┬───────┘
                                                      │
                                                      ↓
                                               ┌──────────────┐
                                               │   Database   │
                                               │ (SQLite/PG)  │
                                               └──────────────┘
```

### 2. **Tok zahteva i odgovora:**

```
1. Korisnik klikne dugme "Login"
   ↓
2. React (frontend) pošalje POST request → /api/auth/login
   Body: { email: "user@example.com", password: "pass123" }
   ↓
3. Express server primi zahtev
   ↓
4. Proveri da li user postoji u bazi (Drizzle ORM)
   ↓
5. Proveri lozinku (bcrypt.compare)
   ↓
6. Generiše JWT token (jwt.sign)
   ↓
7. Pošalje token nazad u httpOnly cookie-u
   ↓
8. React sačuva user stanje (useState, Context API)
   ↓
9. Korisnik vidi Dashboard stranicu
```

### 3. **Client-Server komunikacija:**

```javascript
// FRONTEND (React)
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // Šalje cookies
  body: JSON.stringify({ email, password })
});

const data = await response.json();
// { user: {...}, token: "eyJhbGc..." }

// BACKEND (Express)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Nađi user-a u bazi
  const user = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  // Proveri lozinku
  const isValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generiši token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  
  // Pošalji odgovor
  res.cookie('accessToken', token, { httpOnly: true });
  res.json({ user, token });
});
```

---

## 🏗️ Arhitektura projekta

### **3-tier arhitektura:**

```
┌──────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                         │
│                      (Frontend - React)                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │   Login    │  │ Dashboard  │  │  Register  │             │
│  │   Page     │  │    Page    │  │    Page    │             │
│  └────────────┘  └────────────┘  └────────────┘             │
│                                                               │
│  - Prikazuje UI korisnicima                                  │
│  - Reaguje na klikove i input                                │
│  - Šalje zahteve backend-u (AJAX)                            │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ HTTP Requests
                            │ (GET, POST, PUT, DELETE)
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                           │
│                    (Backend - Express)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │   Auth     │  │  Recipes   │  │Subscription│             │
│  │   Routes   │  │   Routes   │  │   Routes   │             │
│  └────────────┘  └────────────┘  └────────────┘             │
│                                                               │
│  - Business logika (pravila aplikacije)                      │
│  - Validacija podataka                                       │
│  - Autorizacija i autentifikacija                            │
│  - API endpoints                                             │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ SQL Queries
                            │ (SELECT, INSERT, UPDATE, DELETE)
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                       DATA LAYER                              │
│                  (Database - SQLite/PostgreSQL)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  users   │ │subscript │ │ recipes  │ │  usage   │        │
│  │  table   │ │  -ions   │ │  table   │ │ tracking │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                               │
│  - Trajno čuvanje podataka na disku                          │
│  - ACID transakcije                                          │
│  - Relacioni model (Foreign Keys)                            │
└──────────────────────────────────────────────────────────────┘
```

### **Separation of Concerns (Razdvajanje briga):**

| Layer | Odgovornost | Tehnologija |
|-------|-------------|-------------|
| **Presentation** | Kako izgleda? | React, Tailwind CSS |
| **Application** | Šta aplikacija radi? | Express.js, TypeScript |
| **Data** | Gde se čuvaju podaci? | SQLite, PostgreSQL |

---

## 📂 Struktura foldera

```
nutri-klub/
│
├── client/                    # 🎨 Frontend (React aplikacija)
│   ├── src/
│   │   ├── pages/            # 📄 Stranice (cela stranica)
│   │   │   ├── Home.tsx           # Početna stranica
│   │   │   ├── Login.tsx          # Login forma
│   │   │   ├── Register.tsx       # Registracija
│   │   │   ├── Dashboard.tsx      # Dashboard (protected)
│   │   │   ├── Onboarding.tsx     # 3-step wizard
│   │   │   └── BlogPost.tsx       # Single blog post
│   │   │
│   │   ├── components/       # 🧩 Komponente (delovi stranice)
│   │   │   ├── Header.tsx         # Navigacija
│   │   │   ├── Footer.tsx         # Footer
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx  # Route guard
│   │   │   └── ui/                # Shadcn UI komponente
│   │   │       ├── button.tsx     # Dugme
│   │   │       ├── card.tsx       # Kartica
│   │   │       └── input.tsx      # Input polje
│   │   │
│   │   ├── hooks/            # 🪝 Custom React hooks
│   │   │   ├── useAuth.ts         # Auth logika
│   │   │   └── useSubscription.ts # Subscription status
│   │   │
│   │   ├── contexts/         # 🌐 Global state
│   │   │   └── AuthContext.tsx    # User stanje
│   │   │
│   │   ├── lib/              # 🛠️ Utility funkcije
│   │   │   ├── utils.ts           # Helper functions
│   │   │   └── queryClient.ts     # TanStack Query setup
│   │   │
│   │   ├── App.tsx           # 🎯 Glavni component (router)
│   │   ├── main.tsx          # 🚀 Entry point
│   │   └── index.css         # 🎨 Global CSS
│   │
│   └── index.html            # 📝 HTML template
│
├── server/                    # 🔧 Backend (Express API)
│   ├── routes/               # 🛣️ API rute
│   │   ├── auth.ts           # POST /api/auth/login, register
│   │   ├── subscription.ts   # GET /api/subscription/status
│   │   └── onboarding.ts     # POST /api/onboarding/preferences
│   │
│   ├── middleware/           # 🛡️ Middleware funkcije
│   │   ├── auth.ts           # JWT verifikacija
│   │   ├── checkSubscription.ts  # Premium provera
│   │   └── rateLimit.ts      # Rate limiting (3 recepta za free)
│   │
│   ├── utils/                # 🔨 Helper funkcije
│   │   ├── password.ts       # bcrypt hash/verify
│   │   └── jwt.ts            # JWT generate/verify
│   │
│   ├── db.ts                 # 🗄️ Database konekcija
│   ├── db-storage.ts         # 💾 Database operations (CRUD)
│   ├── index.ts              # 🚀 Glavni server fajl
│   ├── routes.ts             # 🛤️ Registracija svih ruta
│   ├── notion.ts             # 📰 Notion API integracija
│   └── seed.ts               # 🌱 Seed data script
│
├── shared/                    # 🤝 Dijeljeni kod (frontend + backend)
│   ├── schema-sqlite.ts      # 📊 SQLite schema (development)
│   ├── schema-pg.ts          # 📊 PostgreSQL schema (production)
│   └── schema.ts             # 📊 Unified exports
│
├── migrations/               # 📦 Database migracije
│   └── meta/
│       └── _journal.json     # Drizzle migration history
│
├── local.db                  # 🗃️ SQLite baza (auto-generated)
├── .env                      # 🔐 Secreti (NE PUSH-aj na GitHub!)
├── package.json              # 📦 Dependencies i scripts
├── tsconfig.json             # ⚙️ TypeScript config
├── vite.config.ts            # ⚙️ Vite config
├── tailwind.config.ts        # 🎨 Tailwind config
├── drizzle.config.ts         # 🗄️ Drizzle ORM config
│
├── README-AUTH.md            # 📖 Auth dokumentacija
├── README-DATABASE.md        # 📖 Database setup
└── BEGINNER-GUIDE.md         # 📖 Ovaj fajl! 🎓
```

### **Objašnjenje važnih foldera:**

**`client/src/pages/`** - Svaka stranica u aplikaciji
- `Home.tsx` → `/` (javna)
- `Login.tsx` → `/login` (javna)
- `Dashboard.tsx` → `/dashboard` (protected)

**`client/src/components/`** - Re-usable delovi
- `Header.tsx` - Koristi se na više stranica
- `ui/button.tsx` - Shadcn UI Button component

**`server/routes/`** - API endpoints
- `auth.ts` → `/api/auth/*`
- `subscription.ts` → `/api/subscription/*`

**`shared/`** - TypeScript tipovi deljeni između frontend-a i backend-a
- `schema-sqlite.ts` - Database tabele

---

## 🔀 Tok podataka

### **Primer: Korisnik se registruje**

#### **1. Frontend (React):**

```typescript
// client/src/pages/Register.tsx

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      // 1. Pozovi register funkciju iz AuthContext
      await register(email, password);
      
      // 2. Redirect na onboarding
      setLocation("/onboarding");
    } catch (err: any) {
      // 3. Prikaži grešku
      setError(err.message);
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Registruj se</button>
    </form>
  );
}
```

#### **2. AuthContext (Global State):**

```typescript
// client/src/contexts/AuthContext.tsx

async function register(email: string, password: string) {
  // Pošalji POST request na backend
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",  // Šalje cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Registration failed");
  }

  // Sačuvaj user-a u state
  const data = await response.json();
  setUser(data.user);
}
```

#### **3. Backend (Express):**

```typescript
// server/routes/auth.ts

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validacija
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be 8+ characters" });
    }
    
    // Proveri da li user već postoji
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    // Hash lozinku (bcrypt)
    const passwordHash = await hashPassword(password);
    
    // Snimi u bazu
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        role: "free",
        subscriptionStatus: "inactive",
        referralCode: generateReferralCode(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
    
    // Generiši JWT token
    const { accessToken, refreshToken } = generateTokens(newUser);
    
    // Postavi token u httpOnly cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dana
    });
    
    // Vrati user info (bez password-a!)
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      user: userWithoutPassword,
      accessToken,
      message: "Registration successful",
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});
```

#### **4. Database (SQLite):**

```sql
-- Drizzle ORM generiše ovaj SQL:

INSERT INTO users (
  email,
  password_hash,
  role,
  subscription_status,
  referral_code,
  created_at,
  updated_at
)
VALUES (
  'user@example.com',
  '$2b$10$abcdef1234567890...',  -- Hashed password
  'free',
  'inactive',
  'REF1737035123ABC',
  '2026-01-16T10:30:00.000Z',
  '2026-01-16T10:30:00.000Z'
)
RETURNING *;
```

#### **5. Rezultat u bazi (`local.db`):**

```
users tabela:
┌────┬──────────────────┬──────────────────────────────┬──────┬──────────────┬─────────────────┐
│ id │ email            │ password_hash                │ role │ subscription │ referral_code   │
│    │                  │                              │      │ _status      │                 │
├────┼──────────────────┼──────────────────────────────┼──────┼──────────────┼─────────────────┤
│ 1  │ user@example.com │ $2b$10$N9qo8uLOickgx2ZM...  │ free │ inactive     │ REF1737035123AB │
└────┴──────────────────┴──────────────────────────────┴──────┴──────────────┴─────────────────┘
```

---

## 🎓 Ključni koncepti za početnike

### **1. REST API**

REST = **RE**presentational **S**tate **T**ransfer

Način komunikacije između client-a i server-a kroz HTTP.

**HTTP Methods (glagoli):**

```
GET    /api/users         - Pročitaj sve korisnike (Read)
GET    /api/users/1       - Pročitaj korisnika sa ID=1
POST   /api/users         - Kreiraj novog korisnika (Create)
PUT    /api/users/1       - Ažuriraj korisnika (Update)
PATCH  /api/users/1       - Parcijalno ažuriranje
DELETE /api/users/1       - Obriši korisnika (Delete)
```

**Primer u našem projektu:**

```typescript
// Backend definicija (Express)
router.get("/api/auth/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Frontend poziv (React)
const response = await fetch("/api/auth/me", {
  method: "GET",
  credentials: "include",  // Šalje cookies
});
const data = await response.json();
console.log(data.user);
```

**Status kodovi:**

| Kod | Značenje | Primer |
|-----|----------|--------|
| 200 | OK - Uspešno | GET /api/users ✅ |
| 201 | Created - Kreirano | POST /api/users ✅ |
| 400 | Bad Request - Loš zahtev | Invalid email format ❌ |
| 401 | Unauthorized - Nisi prijavljen | Pristup bez tokena ❌ |
| 403 | Forbidden - Nemaš dozvolu | Free tier, premium feature ❌ |
| 404 | Not Found - Ne postoji | User sa ID=999 ne postoji ❌ |
| 500 | Server Error - Greška na serveru | Database connection failed ❌ |

### **2. Autentifikacija sa JWT**

**JWT Token anatomija:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

│                                           │                                                   │
│          Header (algoritam)               │           Payload (data)                         │           Signature (provera)
│                                           │                                                   │
└─────────────────────────────────────────┬─┴───────────────────────────────────────────────┬─┴──────────────────────────────────
                                           │                                                  │
                                           Base64 encoded JSON                                HMAC SHA256 signature
```

**Dekodiran Payload:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "free",
  "iat": 1737035123,  // Issued At
  "exp": 1737639923   // Expires (7 dana kasnije)
}
```

**Tok autentifikacije:**

```
┌─────────┐                                           ┌────────┐
│ Browser │  1. POST /api/auth/login                  │ Server │
│         │     { email, password }                   │        │
│         │  ─────────────────────────────────────→  │        │
│         │                                           │ 2. Verify│
│         │                                           │ Password│
│         │                                           │        │
│         │  3. ←───── JWT Token (u cookie-u) ─────  │ 3. Generate│
│         │     Set-Cookie: accessToken=eyJ...       │ JWT    │
└────┬────┘                                           └────────┘
     │
     │  4. Browser automatski šalje cookie sa svakim zahtevom!
     │
     ↓
┌─────────┐                                           ┌────────┐
│ Browser │  GET /api/dashboard                       │ Server │
│         │  Cookie: accessToken=eyJ...               │        │
│         │  ─────────────────────────────────────→  │ 5. Verify│
│         │                                           │ Token  │
│         │                                           │        │
│         │  ←────────── Protected data ──────────   │ 6. Return│
│         │  { recipes, ... }                         │ Data   │
└─────────┘                                           └────────┘
```

**Kod implementacija:**

```typescript
// Generisanje JWT-a (server/utils/jwt.ts)
export function generateAccessToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",  // 7 dana
  });
}

// Verifikacija JWT-a (server/middleware/auth.ts)
export function authenticate(req, res, next) {
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;  // Dodaj user u request
    next();  // Pusti zahtev dalje
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

### **3. React State Management**

**Lokalni state (useState):**

```typescript
// Samo za jednu komponentu
function LoginForm() {
  // State: email se čuva u memoriji komponente
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  return (
    <div>
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}  // Update state
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );
}

// Kada se komponenta unmount-uje, state nestaje!
```

**Globalni state (Context API):**

```typescript
// client/src/contexts/AuthContext.tsx

// 1. Kreiraj Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Kreiraj Provider komponentu
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  async function login(email: string, password: string) {
    // Login logika...
    setUser(fetchedUser);
  }
  
  async function logout() {
    setUser(null);
  }
  
  const value = {
    user,      // Trenutni user (ili null)
    login,     // Login funkcija
    logout,    // Logout funkcija
  };
  
  // Sve child komponente mogu pristupiti value-u!
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook za lakši pristup
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  
  return context;
}

// 4. Wrap aplikaciju sa Provider-om (App.tsx)
function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

// 5. Korišćenje u bilo kom componentu
function Dashboard() {
  const { user, logout } = useAuth();  // user je dostupan! ✅
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Razlika:**

| Feature | useState | Context API |
|---------|----------|-------------|
| **Scope** | Jedna komponenta | Cela aplikacija |
| **Passing** | Props drilling 😫 | Dostupno svuda ✅ |
| **Use case** | Form input, modal open/close | User, theme, language |

### **4. React Hooks**

**Osnovni hooks:**

```typescript
// 1. useState - Čuva vrednost u komponenti
const [count, setCount] = useState(0);

function increment() {
  setCount(count + 1);  // Re-render komponente
}

// 2. useEffect - Pokreće se kada se komponenta mount-uje ili kada se promeni dependency
useEffect(() => {
  // Fetch data from API
  fetchDataFromAPI();
}, []);  // [] = pokreni samo jednom (mount)

useEffect(() => {
  console.log("Count changed:", count);
}, [count]);  // Pokreni svaki put kad se count promeni

// 3. useContext - Pristup Context-u
const { user } = useContext(AuthContext);

// 4. useRef - Referenca na DOM element
const inputRef = useRef<HTMLInputElement>(null);

function focusInput() {
  inputRef.current?.focus();
}

return <input ref={inputRef} />;

// 5. Custom hook (naš primer)
function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  
  return context;
}

// Korišćenje:
const { user, login, logout } = useAuth();
```

**Rules of Hooks:**
1. ✅ Pozivaj hooks samo na **top level-u** (ne u if-ovima, petljama)
2. ✅ Pozivaj hooks samo iz **React funkcija** (komponente, custom hooks)
3. ❌ Ne pozivaj hooks iz class komponenti
4. ❌ Ne pozivaj hooks iz običnih JavaScript funkcija

```typescript
// ❌ LOŠE
function BadComponent() {
  if (someCondition) {
    const [count, setCount] = useState(0);  // ❌ Hook u if-u!
  }
  
  return <div>...</div>;
}

// ✅ DOBRO
function GoodComponent() {
  const [count, setCount] = useState(0);  // ✅ Top level
  
  if (someCondition) {
    return <div>Count: {count}</div>;
  }
  
  return <div>...</div>;
}
```

### **5. Middleware (Express)**

Middleware = **Funkcija koja se izvršava pre glavne rute**

```typescript
// server/middleware/auth.ts

function authenticate(req, res, next) {
  // 1. Izvuci token iz cookie-a
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ error: "No token" });
  }
  
  // 2. Verifikuj token
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    // 3. Dodaj user u request
    req.user = payload;
    
    // 4. Pusti zahtev dalje
    next();  // VAŽNO! Mora se pozvati next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Korišćenje:
router.get("/api/dashboard", authenticate, (req, res) => {
  // req.user je sada dostupan! ✅
  res.json({ message: `Welcome ${req.user.email}` });
});
```

**Redosled izvršavanja (Middleware chain):**

```
Request  →  Middleware 1  →  Middleware 2  →  Route Handler  →  Response
             (auth)            (premium check)     (return data)
               ↓                    ↓                    ↓
            Verify JWT         Check DB            Return JSON
```

**Primer sa više middleware-ova:**

```typescript
router.get(
  "/api/premium-recipes",
  authenticate,        // 1. Proveri JWT
  requirePremium,      // 2. Proveri da li je premium
  rateLimitFeature("recipe_view"),  // 3. Rate limiting
  async (req, res) => {  // 4. Glavni handler
    const recipes = await fetchRecipes();
    res.json({ recipes });
  }
);
```

---

## 💾 Kako se snimaju podaci?

### **1. SQLite (Local Development)**

SQLite je **fajl baza** - sve se čuva u jedan fajl: `local.db`

```bash
# Lokacija fajla:
/Users/sasa/Documents/GitHub/nutri-klub/local.db

# Veličina fajla:
ls -lh local.db
# -rw-r--r--  1 sasa  staff   24K Jan 16 10:30 local.db

# Kako videti podatke?
npm run db:studio  # Otvara Drizzle Studio na http://localhost:4983

# Ili koristi sqlite3 CLI:
sqlite3 local.db
sqlite> .tables  # Prikaži sve tabele
sqlite> SELECT * FROM users;  # Prikaži sve korisnike
```

**Tabele u bazi:**

```
users               - Korisnici (email, password, role, subscription)
user_preferences    - Preferencije (alergije, ciljevi, activity level)
subscriptions       - Premium članarine i planovi
usage_tracking      - Rate limiting (koliko puta koristio feature)
ai_chat_history     - Istorija AI chata
referrals           - Referral program (pozovi prijatelja)
achievements        - Postignuća (gamification)
streaks             - Streakovi (7 dana zaredom prijavljen)
contact_messages    - Poruke sa kontakt forme
newsletter          - Newsletter email lista
user_favorites      - Favorite recepti
```

### **2. PostgreSQL (Production)**

Za production, koristimo **PostgreSQL** preko **NeonDB** (serverless).

```bash
# .env fajl:
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@ep-cool-name.us-east-2.aws.neon.tech/nutri_klub

# Migracija:
npm run db:push  # Primeni schema na PostgreSQL
```

**Razlika: SQLite vs PostgreSQL**

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| **Tip** | Fajl baza | Client-Server baza |
| **Koristi se za** | Local dev, small apps | Production, scale |
| **Konkurencija** | Single writer | Multi-user |
| **JSON support** | ❌ Ne (text) | ✅ Da (jsonb) |
| **Array support** | ❌ Ne (text) | ✅ Da (array) |
| **Boolean** | ❌ Ne (integer) | ✅ Da |
| **Timestamp** | text | timestamp with timezone |

### **3. Kako Drizzle ORM radi?**

**Umesto SQL-a:**

```sql
-- ❌ Stari način (raw SQL):
SELECT * FROM users WHERE email = 'user@example.com' LIMIT 1;
```

**Koristimo Drizzle:**

```typescript
// ✅ Novi način (TypeScript + Drizzle):
const [user] = await db
  .select()
  .from(users)
  .where(eq(users.email, "user@example.com"))
  .limit(1);

// TypeScript zna tip rezultata:
// user: User | undefined
```

**Prednosti:**
- ✅ **Type-safe** - TypeScript hvata greške
- ✅ **Autocomplete** - IDE sugeriše polja
- ✅ **Lakše za čitanje** - Chainable API
- ✅ **Manje grešaka** - Ne možeš pogrešiti ime polja

### **4. Schema (Definicija tabela)**

```typescript
// shared/schema-sqlite.ts

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  // Definicija kolona:
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").default("free"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// TypeScript tipovi se automatski generišu:
type User = typeof users.$inferSelect;
// {
//   id: number;
//   email: string;
//   passwordHash: string;
//   firstName: string | null;
//   lastName: string | null;
//   role: string;
//   subscriptionStatus: string;
//   createdAt: string;
//   updatedAt: string;
// }

type InsertUser = typeof users.$inferInsert;
// { email: string; passwordHash: string; ... }
```

### **5. CRUD operacije**

**Create (Snimanje):**

```typescript
// Snimi novog user-a
const [newUser] = await db
  .insert(users)
  .values({
    email: "user@example.com",
    passwordHash: hashedPassword,
    role: "free",
    subscriptionStatus: "inactive",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  .returning();  // Vrati kreirani red

console.log(newUser.id);  // 1
```

**Read (Čitanje):**

```typescript
// 1. Svi korisnici
const allUsers = await db.select().from(users);

// 2. Jedan korisnik po email-u
const [user] = await db
  .select()
  .from(users)
  .where(eq(users.email, "user@example.com"))
  .limit(1);

// 3. Sa filtriranjem
const premiumUsers = await db
  .select()
  .from(users)
  .where(eq(users.role, "premium"));

// 4. Sa JOIN-om (više tabela)
const usersWithPreferences = await db
  .select({
    user: users,
    preferences: userPreferences,
  })
  .from(users)
  .leftJoin(userPreferences, eq(users.id, userPreferences.userId));
```

**Update (Ažuriranje):**

```typescript
// Promeni user-a na premium
await db
  .update(users)
  .set({
    role: "premium",
    subscriptionStatus: "active",
    updatedAt: new Date().toISOString(),
  })
  .where(eq(users.id, 1));
```

**Delete (Brisanje):**

```typescript
// Obriši user-a
await db
  .delete(users)
  .where(eq(users.id, 1));

// ⚠️ OPREZ! Brisanje bez WHERE obriše SVE:
// await db.delete(users);  // ❌ Briše sve user-e!
```

---

## 🌐 Praktični primeri

### **Primer 1: Kreiranje novog API endpoint-a**

**Cilj:** Dodati endpoint koji vraća broj registrovanih korisnika.

**Backend (Express):**

```typescript
// server/routes/stats.ts (novi fajl)

import { Router } from "express";
import { db } from "../db";
import { users } from "@shared/schema-sqlite";
import { count } from "drizzle-orm";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/stats/users", requireAdmin, async (req, res) => {
  try {
    // Broji sve user-e u bazi
    const [result] = await db
      .select({ count: count() })
      .from(users);
    
    res.json({
      totalUsers: result.count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
```

**Registruj rutu (server/routes.ts):**

```typescript
import statsRoutes from "./routes/stats";

app.use("/api", statsRoutes);
```

**Frontend (React):**

```typescript
// client/src/pages/admin/Stats.tsx

import { useQuery } from "@tanstack/react-query";

function Stats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats/users", {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch stats");
      }
      
      return res.json();
    },
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Statistics</h1>
      <p className="text-4xl mt-4">{data.totalUsers} users</p>
      <p className="text-sm text-gray-500">
        Last updated: {new Date(data.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
```

### **Primer 2: Protected Route sa Premium proverom**

**Cilj:** Stranica dostupna samo premium korisnicima.

**ProtectedRoute komponenta:**

```typescript
// client/src/components/auth/ProtectedRoute.tsx

import { Redirect } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requirePremium = false,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isPremium, isAdmin, isLoading } = useAuth();
  
  // Prikaz loading spinner-a dok provera traje
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }
  
  // 1. Proveri autentifikaciju
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  // 2. Proveri admin role
  if (requireAdmin && !isAdmin) {
    return <Redirect to="/dashboard" />;
  }
  
  // 3. Proveri premium
  if (requirePremium && !isPremium && !isAdmin) {
    return <Redirect to="/dashboard?upgrade=true" />;
  }
  
  // 4. Sve OK, prikaži sadržaj
  return <>{children}</>;
}
```

**Korišćenje u App.tsx:**

```typescript
// client/src/App.tsx

function Router() {
  return (
    <Switch>
      {/* Javne rute */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      
      {/* Protected rute - samo prijavljeni */}
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Premium rute - samo premium korisnici */}
      <Route path="/premium-recipes">
        {() => (
          <ProtectedRoute requirePremium>
            <PremiumRecipes />
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Admin rute - samo admin */}
      <Route path="/admin">
        {() => (
          <ProtectedRoute requireAdmin>
            <AdminPanel />
          </ProtectedRoute>
        )}
      </Route>
    </Switch>
  );
}
```

### **Primer 3: Rate Limiting za Free Tier**

**Cilj:** Free tier korisnici mogu pogledati samo 3 recepta ukupno.

**Backend middleware:**

```typescript
// server/middleware/rateLimit.ts

export function rateLimitFeature(feature: "recipe_view" | "ai_message" | "ebook_download") {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Premium korisnici nemaju limitе
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);
    
    if (user.role === "premium" || user.role === "admin") {
      return next();  // Nema limita
    }
    
    // Free tier - proveri usage
    const [usage] = await db
      .select()
      .from(usageTracking)
      .where(
        and(
          eq(usageTracking.userId, req.user.userId),
          eq(usageTracking.feature, feature)
        )
      )
      .limit(1);
    
    const currentCount = usage?.count || 0;
    const limit = {
      recipe_view: 3,
      ai_message: 2,
      ebook_download: 1,
    }[feature];
    
    if (currentCount >= limit) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        code: "RATE_LIMIT_EXCEEDED",
        feature,
        limit,
        current: currentCount,
        message: `You've reached your free tier limit. Upgrade to Premium!`,
      });
    }
    
    // Inkrementiraj usage
    if (usage) {
      await db
        .update(usageTracking)
        .set({ count: currentCount + 1 })
        .where(eq(usageTracking.id, usage.id));
    } else {
      await db.insert(usageTracking).values({
        userId: req.user.userId,
        feature,
        count: 1,
      });
    }
    
    // Dodaj usage info u request
    (req as any).usageInfo = {
      current: currentCount + 1,
      limit,
      remaining: limit - (currentCount + 1),
    };
    
    next();
  };
}
```

**Korišćenje:**

```typescript
// server/routes/recipes.ts

router.get(
  "/api/recipes/:id",
  authenticate,                     // 1. Proveri JWT
  rateLimitFeature("recipe_view"),  // 2. Rate limit
  async (req, res) => {             // 3. Handler
    const recipe = await fetchRecipe(req.params.id);
    
    res.json({
      recipe,
      usageInfo: (req as any).usageInfo,  // Dodaj u odgovor
    });
  }
);
```

**Frontend prikaz:**

```typescript
// client/src/pages/RecipeDetail.tsx

function RecipeDetail() {
  const { data } = useQuery({
    queryKey: ["recipe", id],
    queryFn: fetchRecipe,
  });
  
  return (
    <div>
      {data.usageInfo && data.usageInfo.remaining < 2 && (
        <Alert className="mb-4 bg-yellow-50">
          <AlertDescription>
            ⚠️ Preostalo: {data.usageInfo.remaining}/{data.usageInfo.limit} recepata.
            <Button size="sm" className="ml-2">
              Upgrade na Premium
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <RecipeCard recipe={data.recipe} />
    </div>
  );
}
```

---

## 🔐 Sigurnost

### **1. Password Hashing (bcrypt)**

**Nikada ne čuvaj plain text lozinke!**

```typescript
// ❌ NIKADA ovako:
const user = {
  email: "user@example.com",
  password: "mypassword123",  // Plain text! ❌
};

// ✅ Ovako (hashed):
import bcrypt from "bcrypt";

const hashedPassword = await bcrypt.hash("mypassword123", 10);
// Rezultat: "$2b$10$N9qo8uLOickgx2ZMfpQeHu..."

const user = {
  email: "user@example.com",
  passwordHash: hashedPassword,  // Encrypted! ✅
};
```

**Salt rounds:**
- 10 = Standardno (dovoljno brzo, dovoljno sigurno)
- 12 = Sporije, sigurnije
- 8 = Brže, manje sigurno

**Verifikacija:**

```typescript
// Login proces:
const isValid = await bcrypt.compare(
  "mypassword123",    // Input od korisnika
  user.passwordHash   // Hash iz baze
);

if (isValid) {
  // Lozinka tačna! ✅
  generateJWT();
} else {
  // Lozinka netačna! ❌
  return res.status(401).json({ error: "Invalid credentials" });
}
```

**U bazi se čuva:**

```
users tabela:
┌────┬──────────────────┬──────────────────────────────────────────────────────────┐
│ id │ email            │ password_hash                                            │
├────┼──────────────────┼──────────────────────────────────────────────────────────┤
│ 1  │ user@example.com │ $2b$10$N9qo8uLOickgx2ZMfpQeHuFkfiN.KzWNXjqkR5lCZvKcb... │
└────┴──────────────────┴──────────────────────────────────────────────────────────┘
```

### **2. JWT Tokens**

**Generisanje:**

```typescript
// server/utils/jwt.ts

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-this-in-production";

export function generateAccessToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",  // 7 dana
    issuer: "nutri-klub",
    audience: "nutri-klub-users",
  });
}
```

**Verifikacija:**

```typescript
// server/middleware/auth.ts

export function authenticate(req, res, next) {
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ error: "No token" });
  }
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

**Refresh token strategija:**

```typescript
// Refresh token ima duži expiry (30 dana)
export function generateRefreshToken(user: User): string {
  return jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

// Endpoint za refresh
router.post("/api/auth/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
    
    const newAccessToken = generateAccessToken(user);
    
    res.cookie("accessToken", newAccessToken, { httpOnly: true });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});
```

### **3. httpOnly Cookies**

**Zašto cookies, ne localStorage?**

| Feature | localStorage | httpOnly Cookie |
|---------|-------------|-----------------|
| **XSS Attack** | ❌ Ranjivo | ✅ Zaštićeno |
| **JavaScript pristup** | ✅ Da | ❌ Ne (sigurnije!) |
| **CSRF Attack** | ✅ Zaštićeno | ⚠️ Potrebna zaštita |
| **Auto-send** | ❌ Ne | ✅ Da (automatski) |

**Postavljanje cookie-a (backend):**

```typescript
res.cookie("accessToken", token, {
  httpOnly: true,   // JavaScript ne može da čita (XSS zaštita)
  secure: true,     // Samo HTTPS (ne HTTP)
  sameSite: "lax",  // CSRF zaštita
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 dana u milisekundama
  path: "/",        // Dostupan na svim rutama
});
```

**Browser automatski šalje cookie:**

```typescript
// Frontend - NE TREBA da dodaješ token ručno!
const response = await fetch("/api/dashboard", {
  credentials: "include",  // ✅ Ovo je sve što treba!
});

// Browser automatski dodaje:
// Cookie: accessToken=eyJhbGc...
```

### **4. CORS (Cross-Origin Resource Sharing)**

```typescript
// server/index.ts

import cors from "cors";

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5000",
  credentials: true,  // Dozvoli cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));
```

### **5. Environment Variables (.env)**

```bash
# .env fajl (nikada ne push-uj na GitHub!)

# Database
DATABASE_TYPE=sqlite
SQLITE_DB_PATH=./local.db

# JWT
JWT_SECRET=change-this-to-random-string-in-production

# Notion
NOTION_INTEGRATION_SECRET=ntn_...
NOTION_PAGE_URL=https://notion.so/...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Environment
NODE_ENV=development
```

**Generisanje sigurnog JWT_SECRET:**

```bash
# U terminalu:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Output:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6...
```

**Korišćenje:**

```typescript
// Automatski se učitava preko dotenv
import "dotenv/config";

const secret = process.env.JWT_SECRET;
```

---

## 🚀 Kako pokrenuti projekat?

### **1. Clone projekat**

```bash
cd /Users/sasa/Documents/GitHub/nutri-klub
```

### **2. Instaliraj dependencies**

```bash
npm install
```

### **3. Kreiraj `.env` fajl**

```bash
# Kopiraj iz .env.example (ako postoji)
cp .env.example .env

# Ili kreiraj novi:
touch .env
```

**Dodaj u `.env`:**

```bash
# Database
DATABASE_TYPE=sqlite
SQLITE_DB_PATH=./local.db

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# Notion (opcionalno)
NOTION_INTEGRATION_SECRET=your_notion_secret
NOTION_PAGE_URL=https://notion.so/your-page

# Environment
NODE_ENV=development
```

### **4. Kreiraj bazu podataka**

```bash
npm run db:push
```

**Output:**
```
✓ Pulling schema from database...
✓ Changes applied
```

### **5. (Opcionalno) Dodaj test podatke**

```bash
npm run db:seed
```

**Kreira:**
- Test user: `test@example.com` / `test123`
- Role: `free`

### **6. Pokreni development server**

```bash
npm run dev
```

**Output:**
```
📦 Using SQLite database for local development
serving on port 5000
```

### **7. Otvori u browser-u**

```
http://localhost:5000
```

**Stranice:**
- `/` - Home (javno)
- `/login` - Login
- `/register` - Registracija
- `/dashboard` - Dashboard (nakon prijave)

---

## 📖 Za dalje učenje

### **React:**

**Officijalna dokumentacija:**
- https://react.dev - Nova React docs (preporučeno!)
- https://react.dev/learn - Tutorial

**Koncepti za učenje:**
1. Components i Props
2. State i Lifecycle
3. Hooks (useState, useEffect, useContext, custom hooks)
4. Event handling
5. Conditional rendering
6. Lists i Keys
7. Forms
8. Context API
9. Error boundaries

**Video tutorijali:**
- React Tutorial for Beginners (Net Ninja)
- Full React Course 2023 (freeCodeCamp)

### **TypeScript:**

**Dokumentacija:**
- https://www.typescriptlang.org/docs/

**Koncepti:**
1. Basic Types (string, number, boolean, array)
2. Interfaces vs Types
3. Generics
4. Utility Types (Partial, Pick, Omit)
5. Type Inference
6. Union Types
7. Type Guards

### **Express:**

**Dokumentacija:**
- https://expressjs.com/

**Koncepti:**
1. Routing
2. Middleware
3. Request & Response
4. Error handling
5. Static files
6. Template engines (ne koristimo u ovom projektu)

### **Database (SQL):**

**Tutorijali:**
- SQL Tutorial - W3Schools
- PostgreSQL Tutorial

**Koncepti:**
1. SELECT, INSERT, UPDATE, DELETE
2. WHERE clause
3. JOIN (INNER, LEFT, RIGHT)
4. GROUP BY, HAVING
5. Indexing
6. Foreign Keys
7. Transactions

### **Security:**

**Teme:**
1. Authentication vs Authorization
2. JWT tokens
3. Password hashing (bcrypt)
4. HTTPS/SSL
5. CORS
6. XSS (Cross-Site Scripting)
7. CSRF (Cross-Site Request Forgery)
8. SQL Injection

**Resursi:**
- OWASP Top 10
- Web Security Academy (PortSwigger)

---

## 💡 Saveti za učenje

### **1. Počni od malih delova**

Ne pokušavaj da naučiš sve odjednom!

**Redosled učenja:**
1. ✅ Nauči kako radi **jedan** API endpoint (npr. GET /api/users)
2. ✅ Razumej **jedan** React component
3. ✅ Dodaj **jedan** novi feature
4. ✅ Eksperimentiši sa postojećim kodom

### **2. Console.log je tvoj najbolji prijatelj**

```typescript
// Uvek dodaj console.log da vidiš šta se dešava:

function fetchRecipes() {
  console.log("1. Pozvan fetchRecipes");
  
  const recipes = await api.getRecipes();
  console.log("2. Dobijeni recepti:", recipes);
  
  const filtered = recipes.filter(r => r.category === "breakfast");
  console.log("3. Filtrirani:", filtered);
  
  return filtered;
}
```

### **3. Čitaj error poruke**

Error poruke ti govore **tačno** šta je problem!

```
TypeError: Cannot read property 'name' of undefined
           at RecipeCard (RecipeCard.tsx:15)
```

**Šta ovo znači?**
- `RecipeCard.tsx` na liniji 15
- Pokušavaš da pristupiš `name` property-ju
- Ali objekat je `undefined` (ne postoji)

**Rešenje:**
```typescript
// ❌ Greška:
<h1>{recipe.name}</h1>

// ✅ Fix:
<h1>{recipe?.name || "No name"}</h1>
```

### **4. Koristi DevTools**

**Chrome DevTools:**
1. **Console** - Vidi console.log output i greške
2. **Network** - Vidi sve HTTP zahteve (API calls)
3. **Application** - Vidi cookies, localStorage
4. **Elements** - Inspektuj HTML/CSS

**React DevTools:**
- Extension za Chrome/Firefox
- Vidi React component tree
- Inspektuj props i state

### **5. Eksperimentiši**

**Vežbe:**
1. Promeni boju dugmeta u `Login.tsx`
2. Dodaj novo polje u registraciju (npr. "phone")
3. Kreiraj novi endpoint: `GET /api/hello` → `{ message: "Hello!" }`
4. Dodaj novi component: `<UserBadge />`

### **6. Pitaj**

**Kada ne razumeš nešto:**
- Stack Overflow
- Discord zajednice (Reactiflux, The Programmer's Hangout)
- Reddit (r/reactjs, r/webdev)
- GitHub Issues (za specifične biblioteke)

---

## 🎯 Vežbe za učenje

### **Vežba 1: Dodaj novi API endpoint**

**Cilj:** Kreiraj endpoint koji vraća ukupan broj korisnika.

```typescript
// server/routes/stats.ts

router.get("/api/stats/users/count", async (req, res) => {
  // TODO: Implementiraj logiku
  // 1. Izbroj sve user-e u bazi
  // 2. Vrati JSON sa brojem
});
```

**Rešenje:** Vidi [Primer 1](#primer-1-kreiranje-novog-api-endpoint-a)

### **Vežba 2: Kreiraj novu tabelu**

**Cilj:** Dodaj `favorites` tabelu gde korisnici mogu čuvati omiljene recepte.

```typescript
// shared/schema-sqlite.ts

export const favorites = sqliteTable("favorites", {
  // TODO: Definiši kolone
  // - id
  // - userId
  // - recipeId
  // - createdAt
});
```

### **Vežba 3: Dodaj validaciju**

**Cilj:** Validiraj email i password u registraciji.

```typescript
// server/routes/auth.ts

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  
  // TODO: Dodaj validaciju
  // 1. Email mora biti validan (regex)
  // 2. Password minimum 8 karaktera
  // 3. Password mora imati bar jedno veliko slovo
  // 4. Password mora imati bar jedan broj
});
```

### **Vežba 4: Dodaj novi React component**

**Cilj:** Kreiraj `<ProfileCard />` koji prikazuje user info.

```typescript
// client/src/components/ProfileCard.tsx

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  // TODO: Implementiraj UI
  // - Prikaži firstName, lastName, email
  // - Prikaži role badge (Free/Premium)
  // - Koristi Shadcn Card komponentu
  
  return (
    <Card>
      {/* TODO */}
    </Card>
  );
}
```

### **Vežba 5: Rate limiting dashboard**

**Cilj:** Prikaži usage limitsza free tier korisnike.

```typescript
// client/src/components/UsageMeter.tsx

export function UsageMeter() {
  // TODO:
  // 1. Fetch usage stats sa /api/subscription/usage
  // 2. Prikaži progress bar za svaki feature
  // 3. Prikaži "Upgrade" dugme kada je limit dostignut
  
  return (
    <div>
      {/* Recepti: 2/3 */}
      {/* AI Poruke: 1/2 */}
      {/* E-bookovi: 0/1 */}
    </div>
  );
}
```

---

## 🤔 Često postavljana pitanja (FAQ)

### **Q: Zašto TypeScript, a ne JavaScript?**

**A:** TypeScript hvata greške **pre** nego što se kod pokrene!

```typescript
// JavaScript - greška se dešava u runtime-u
const user = { email: "test@example.com" };
console.log(user.name);  // undefined ❌ (runtime error)

// TypeScript - greška se hvata odmah
interface User {
  email: string;
}

const user: User = { email: "test@example.com" };
console.log(user.name);  // ❌ TypeScript error: Property 'name' does not exist
```

### **Q: Zašto Drizzle ORM, a ne raw SQL?**

**A:**
1. **Type safety** - TypeScript zna tipove
2. **Autocomplete** - IDE sugeriše polja
3. **Lakše refactoring** - Promeni schema, TypeScript će pokazati greške
4. **Čitljiviji kod**

```typescript
// ❌ Raw SQL (ranjivo na greške):
const users = await db.query("SELECT * FROM usres WHERE email = ?", [email]);
// Typo u "usres" - runtime error!

// ✅ Drizzle ORM (type-safe):
const users = await db.select().from(users).where(eq(users.email, email));
// Typo se hvata odmah!
```

### **Q: Zašto httpOnly cookies, a ne localStorage?**

**A:** **Sigurnost!**

```typescript
// ❌ localStorage - ranjivo na XSS napade
localStorage.setItem("token", jwt);
// Bilo koji JavaScript može pristupiti:
const token = localStorage.getItem("token");  // XSS attack! ⚠️

// ✅ httpOnly cookie - JavaScript ne može pristupiti
res.cookie("accessToken", jwt, { httpOnly: true });
// document.cookie - ne vidiš httpOnly cookies! ✅
```

### **Q: Kako funkcioniše autentifikacija?**

**A:** Vidi [Autentifikacija sa JWT](#2-autentifikacija-sa-jwt)

### **Q: Šta je middleware?**

**A:** Funkcija koja se izvršava **pre** glavne rute. Vidi [Middleware](#5-middleware-express)

### **Q: Kako dodati novi feature?**

**A:**
1. Dodaj backend endpoint (Express route)
2. Dodaj frontend UI (React component)
3. Poveži ih sa fetch/TanStack Query
4. Testiraj!

---

## 📞 Podrška

**Pitanja? Problemi?**

1. Pročitaj error poruku pažljivo
2. Google: "react [tvoj problem]"
3. Stack Overflow
4. GitHub Issues (za specifične biblioteke)

**Korisni linkovi:**
- React docs: https://react.dev
- TypeScript docs: https://www.typescriptlang.org
- Drizzle ORM: https://orm.drizzle.team
- Tailwind CSS: https://tailwindcss.com
- Shadcn UI: https://ui.shadcn.com

---

**🎉 Srećno učenje! 🚀**

Pitaj me bilo šta ako nešto nije jasno! 😊
