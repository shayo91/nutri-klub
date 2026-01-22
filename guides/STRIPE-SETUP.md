# 🛒 Stripe Payment Integration - Setup Vodič

## 📋 Pregled

Ova aplikacija podržava plaćanja preko Stripe-a za:
- **Premium Mesečno** - 4€/mesec (recurring)
- **Premium Godišnje** - 35€/godinu (recurring)
- **Start Plan** - 46€ (one-time)
- **Balans Plan** - 97€ (one-time)
- **Transformacija Plan** - 199€ (one-time)

---

## 🔧 Korak 1: Stripe Account Setup

### 1.1 Kreiraj Stripe Nalog

1. Idi na https://stripe.com
2. Registruj se ili se uloguj
3. Aktiviraj **Test Mode** (toggle u gornjem desnom uglu)

### 1.2 Dobavi API Ključeve

1. Idi na: **Developers → API keys**
   - https://dashboard.stripe.com/test/apikeys

2. Kopiraj oba ključa:
   - **Publishable key:** `pk_test_...`
   - **Secret key:** `sk_test_...`

---

## 🏷️ Korak 2: Kreiraj Proizvode i Cene

Idi na: **Products** → https://dashboard.stripe.com/test/products

### 2.1 Premium Mesečno (Recurring)

1. Klikni **+ Add product**
2. Popuni:
   - **Name:** `Premium Mesečno`
   - **Description:** `Mesečna pretplata za Nutri Klub Premium`
   - **Pricing:**
     - **Model:** Recurring
     - **Price:** `4.00 EUR`
     - **Billing period:** Monthly
3. Klikni **Save product**
4. **Kopiraj Price ID** (npr. `price_1abc123xyz`)

### 2.2 Premium Godišnje (Recurring)

1. Klikni **+ Add product**
2. Popuni:
   - **Name:** `Premium Godišnje`
   - **Description:** `Godišnja pretplata za Nutri Klub Premium`
   - **Pricing:**
     - **Model:** Recurring
     - **Price:** `35.00 EUR`
     - **Billing period:** Yearly
3. Klikni **Save product**
4. **Kopiraj Price ID**

### 2.3 Start Plan (One-time)

1. Klikni **+ Add product**
2. Popuni:
   - **Name:** `Start Plan`
   - **Description:** `1 mesec personalizovanog plana sa 1 konsultacijom`
   - **Pricing:**
     - **Model:** One time
     - **Price:** `46.00 EUR`
3. Klikni **Save product**
4. **Kopiraj Price ID**

### 2.4 Balans Plan (One-time)

1. Klikni **+ Add product**
2. Popuni:
   - **Name:** `Balans Plan`
   - **Description:** `3 meseca personalizovanog plana sa 3 konsultacije`
   - **Pricing:**
     - **Model:** One time
     - **Price:** `97.00 EUR`
3. Klikni **Save product**
4. **Kopiraj Price ID**

### 2.5 Transformacija Plan (One-time)

1. Klikni **+ Add product**
2. Popuni:
   - **Name:** `Transformacija Plan`
   - **Description:** `6 meseci personalizovanog plana sa 6 konsultacija`
   - **Pricing:**
     - **Model:** One time
     - **Price:** `199.00 EUR`
3. Klikni **Save product**
4. **Kopiraj Price ID**

---

## ⚙️ Korak 3: Konfiguriši `.env` Fajl

U root-u projekta, otvori ili kreiraj `.env` fajl:

```env
# Database
DATABASE_URL=file:./local.db

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Hugging Face API
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Stripe Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_TVOJ_SECRET_KEY_OVDE
STRIPE_PUBLISHABLE_KEY=pk_test_TVOJ_PUBLISHABLE_KEY_OVDE

# Stripe Price IDs
STRIPE_PRICE_PREMIUM_MONTHLY=price_TVOJ_MONTHLY_ID
STRIPE_PRICE_PREMIUM_YEARLY=price_TVOJ_YEARLY_ID
STRIPE_PRICE_PLAN_START=price_TVOJ_START_ID
STRIPE_PRICE_PLAN_BALANS=price_TVOJ_BALANS_ID
STRIPE_PRICE_PLAN_TRANSFORMACIJA=price_TVOJ_TRANSFORMACIJA_ID

# Stripe Webhook Secret (dodat ćeš kasnije)
STRIPE_WEBHOOK_SECRET=whsec_TVOJ_WEBHOOK_SECRET

# App URL
APP_URL=http://localhost:5000

# Calendly (opciono)
CALENDLY_API_KEY=your_calendly_api_key_here
CALENDLY_EVENT_TYPE_URL=https://calendly.com/your-link/consultation
```

**⚠️ Važno:** `.env` fajl je automatski ignorisan od strane Git-a i **neće** biti commit-ovan.

---

## 🎣 Korak 4: Setup Stripe Webhook (Lokalno)

### 4.1 Instaliraj Stripe CLI

**MacOS:**
```bash
brew install stripe/stripe-brew/stripe
```

**Windows:**
- Download: https://github.com/stripe/stripe-cli/releases

**Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

### 4.2 Login u Stripe CLI

```bash
stripe login
```

Ovo će otvoriti browser i tražiti autorizaciju.

### 4.3 Forward Webhooks na Local Server

U **novom terminalu** (ostavi server da radi):

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

**Output će biti:**
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### 4.4 Kopiraj Webhook Secret

Kopiraj `whsec_...` i dodaj u `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_tvoj_secret_ovde
```

### 4.5 Restartuj Server

```bash
# U terminalu gde je server
# Ctrl+C pa:
npm run dev
```

---

## 🧪 Korak 5: Testiraj Plaćanje

### 5.1 Pokreni Aplikaciju

**Terminal 1 (Server):**
```bash
npm run dev
```

**Terminal 2 (Stripe Webhook):**
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

### 5.2 Test Plaćanje u Browser-u

1. Otvori http://localhost:5000
2. Login kao **free user** (npr. `free@test.com` / `password`)
3. Klikni **"Upgrade to Premium"**
4. Odaberi plan (npr. Premium Godišnje)
5. Na Stripe Checkout stranici, koristi **test karticu:**

#### Test Kartica - Uspešno Plaćanje ✅
```
Broj kartice:  4242 4242 4242 4242
Expiry:        bilo koji budući datum (npr. 12/25)
CVC:           bilo koja 3 broja (npr. 123)
Ime:           bilo šta
```

#### Test Kartica - Neuspešno Plaćanje ❌
```
Broj kartice:  4000 0000 0000 0002
```

#### Test Kartica - Zahteva 3D Secure 🔐
```
Broj kartice:  4000 0025 0000 3155
```

Više test kartica: https://stripe.com/docs/testing#cards

### 5.3 Proveri Rezultate

**U Browser-u:**
- Trebao bi biti redirect-ovan na `/dashboard/payment-success`
- Trebao bi da vidiš "Dobrodošao u Premium! 🎉"
- Na Dashboard-u, badge bi trebao da kaže "Premium"

**U Terminal 2 (Stripe CLI):**
```
[200] POST /api/payments/webhook [evt_xxx] checkout.session.completed
```

**U Stripe Dashboard:**
- https://dashboard.stripe.com/test/payments
- Trebao bi da vidiš novu transakciju

**U Database:**
```bash
# U terminalu
npm run db:studio

# Otvori http://localhost:4983
# Proveri tablice:
# - subscription_orders (status: completed)
# - users (role: premium, subscriptionStatus: active)
```

---

## 🚀 Korak 6: Produkcija (Production Setup)

### 6.1 Prebaci se na Live Mode

1. U Stripe Dashboard, **isključi Test Mode** (toggle u gornjem desnom uglu)
2. Kreiraj **nove proizvode i cene** (isto kao u test mode-u)
3. Dobavi **nove API ključeve:**
   - https://dashboard.stripe.com/apikeys

### 6.2 Update Production `.env`

```env
# Stripe Keys (LIVE Mode)
STRIPE_SECRET_KEY=sk_live_TVOJ_LIVE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_TVOJ_LIVE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_TVOJ_LIVE_WEBHOOK_SECRET

# Stripe Price IDs (LIVE)
STRIPE_PRICE_PREMIUM_MONTHLY=price_LIVE_MONTHLY_ID
STRIPE_PRICE_PREMIUM_YEARLY=price_LIVE_YEARLY_ID
STRIPE_PRICE_PLAN_START=price_LIVE_START_ID
STRIPE_PRICE_PLAN_BALANS=price_LIVE_BALANS_ID
STRIPE_PRICE_PLAN_TRANSFORMACIJA=price_LIVE_TRANSFORMACIJA_ID

# App URL (production)
APP_URL=https://tvoj-domen.com
```

### 6.3 Setup Webhook u Produkciji

1. Idi na: **Developers → Webhooks** → https://dashboard.stripe.com/webhooks
2. Klikni **+ Add endpoint**
3. Popuni:
   - **Endpoint URL:** `https://tvoj-domen.com/api/payments/webhook`
   - **Events to send:**
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `payment_intent.succeeded`
     - ✅ `payment_intent.payment_failed`
4. Klikni **Add endpoint**
5. **Kopiraj Signing secret** (`whsec_...`) i dodaj u production `.env`

---

## 🔍 Debugging

### Problem: "Webhook signature verification failed"

**Uzrok:** `STRIPE_WEBHOOK_SECRET` nije postavljen ili je pogrešan.

**Rešenje:**
1. Restartuj `stripe listen`
2. Kopiraj novi `whsec_...` secret
3. Update `.env`
4. Restartuj server (`npm run dev`)

### Problem: User ostaje "free" nakon plaćanja

**Uzrok:** Webhook nije primljen ili nije procesiran.

**Rešenje:**
1. Proveri da li Stripe CLI terminal pokazuje webhook events
2. Proveri server logs (`npm run dev` terminal)
3. Proveri da li je `STRIPE_WEBHOOK_SECRET` u `.env` fajlu
4. Restartuj oba terminala

### Problem: "Failed to create checkout session"

**Uzrok:** Stripe Price ID nije postavljen ili je pogrešan.

**Rešenje:**
1. Proveri `.env` da li su svi `STRIPE_PRICE_*` postavljeni
2. Proveri da li Price ID-evi odgovaraju onima u Stripe Dashboard-u
3. Restartuj server

---

## 📊 Monitoring

### Stripe Dashboard

- **Payments:** https://dashboard.stripe.com/test/payments
- **Customers:** https://dashboard.stripe.com/test/customers
- **Subscriptions:** https://dashboard.stripe.com/test/subscriptions
- **Webhooks:** https://dashboard.stripe.com/test/webhooks
- **Logs:** https://dashboard.stripe.com/test/logs

### Database

```bash
npm run db:studio
# http://localhost:4983
```

Proveri:
- `subscription_orders` - sve narudžbe
- `plan_purchases` - kupovine planova
- `users` - user roles i subscription status

---

## 🎯 Sažetak Komandi

```bash
# 1. Install Stripe CLI
brew install stripe/stripe-brew/stripe

# 2. Login
stripe login

# 3. Terminal 1 - Start Server
npm run dev

# 4. Terminal 2 - Forward Webhooks
stripe listen --forward-to localhost:5000/api/payments/webhook

# 5. Database Studio (opciono)
npm run db:studio
```

---

## 📚 Korisni Linkovi

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Test Cards](https://stripe.com/docs/testing#cards)

---

## ✅ Checklist

Prije deploya na produkciju:

- [ ] Kreirao sve proizvode u Stripe (test mode)
- [ ] Kreirao sve proizvode u Stripe (live mode)
- [ ] Postavio sve API ključeve u `.env`
- [ ] Postavio sve Price ID-eve u `.env`
- [ ] Testirao plaćanje u test mode-u
- [ ] Setup webhook endpoint u produkciji
- [ ] Testirao webhook u produkciji
- [ ] Provjerio da user postaje premium nakon plaćanja
- [ ] Provjerio email notifikacije (opciono)
- [ ] Testirao cancel subscription flow

---

**🎉 Gotovo! Stripe je sada potpuno integrisan.**

Za pitanja ili probleme, kontaktiraj tim ili pogledaj [Stripe Support](https://support.stripe.com/).
