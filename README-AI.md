# Nutri AI Assistant - Setup Guide

## 🤖 Hugging Face API Integration

Nutri AI Assistant koristi Hugging Face Inference API za generisanje odgovora.

### Besplatno dobijanje API Key-a

1. **Registruj se na Hugging Face:**
   - Idi na https://huggingface.co/join
   - Kreiraj besplatan nalog

2. **Generiši API Token:**
   - Idi na https://huggingface.co/settings/tokens
   - Klikni na "New token"
   - Ime: `nutri-klub-api`
   - Tip: **Read** (besplatno)
   - Kopiraj token (počinje sa `hf_...`)

3. **Dodaj u `.env` fajl:**
   ```env
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```

4. **Restartuj server:**
   ```bash
   npm run dev
   ```

### 🆓 Besplatni Limiti

Hugging Face Inference API nudi **BESPLATNO**:
- Neograničen broj API poziva
- Rate limit: ~100 requests/minuta
- Pristup svim besplatnim modelima

**Modeli koje koristimo:**
- Mistral 7B Instruct - Primarni model
- Zephyr 7B Beta - Brži, backup model
- Llama 2 7B Chat - Alternativa

### 🔄 Fallback na Mock Responses

Ako Hugging Face API ne radi ili nema API key-a, **aplikacija automatski koristi mock responses**:

✅ Mock responses su potpuno funkcionalni
✅ Pokrivaju najčešća pitanja
✅ Dovoljno dobri za testiranje

### 🧪 Testiranje AI Chata

**Sa Mock Responses (bez API key-a):**
- Odgovori su instant (0ms)
- Predviđeni odgovori za česta pitanja
- Dovoljno za development/demo

**Sa Hugging Face API:**
- Personalizovani odgovori
- Context-aware konverzacija
- Odgovori u ~1-3 sekunde

### 📊 Features

**Free Tier:**
- 2 poruke UKUPNO (lifetime limit)
- Osnovni AI odgovori
- Nema chat history

**Premium Tier:**
- ∞ Neograničen broj poruka
- Personalizovani odgovori (na osnovu profila)
- Context-aware (AI pamti konverzaciju)
- Chat history
- Meal plan generator
- Export PDF

### 🔐 Environment Variables

Potrebni `.env` fajl:

```env
# Required
DATABASE_TYPE=sqlite
JWT_SECRET=your-secret-key

# Optional - AI Assistant
HUGGINGFACE_API_KEY=hf_your_token_here

# Optional - Recipes API
SPOONACULAR_API_KEY=your-spoonacular-key
```

### 🐛 Debugging

**Problem: AI ne odgovara**
- ✅ Proveri da li je server pokrenut (`npm run dev`)
- ✅ Proveri da li je korisnik ulogovan
- ✅ Proveri konzolu za greške

**Problem: "Rate limit exceeded"**
- Hugging Face ima rate limit ~100 req/min
- Mock responses se automatski aktiviraju
- Čekaj 1 minut pa pokušaj ponovo

**Problem: Spor odgovor**
- Hugging Face može biti spor (1-3s)
- To je normalno za besplatni tier
- Premium users mogu koristiti brže modele

### 📝 API Endpoints

```typescript
POST   /api/ai/chat                    # Pošalji poruku
GET    /api/ai/history                 # Chat history (Premium)
DELETE /api/ai/history                 # Obriši history (Premium)
POST   /api/ai/generate-meal-plan      # AI meal plan (Premium)
GET    /api/ai/suggestions             # Brza pitanja
GET    /api/ai/usage                   # Usage stats
```

### 🎯 Napredne Opcije

**Zamena modela:**

U `server/services/aiService.ts`:

```typescript
// Promeni model
private static readonly DEFAULT_MODEL = this.MODELS.zephyr; // brži
// ili
private static readonly DEFAULT_MODEL = this.MODELS.mistral; // kvalitetniji
```

**Prilagođavanje system prompta:**

```typescript
private static generateSystemPrompt(context?: UserContext): string {
  return `Ti si Nutri AI, personalizovani nutritionist asistent.
  
  // Dodaj svoje instrukcije ovde
  `;
}
```

### ✅ Ready to Go!

Aplikacija **radi bez API key-a** zahvaljujući mock responses.
Za bolji AI, dodaj Hugging Face API key (besplatno!).

**Happy coding! 🚀**
