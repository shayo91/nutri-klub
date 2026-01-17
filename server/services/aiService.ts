/**
 * AI Service for Nutri AI Assistant
 * Uses free AI APIs: Hugging Face Inference API
 */

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface UserContext {
  firstName?: string;
  goal?: string;
  currentWeight?: number;
  targetWeight?: number;
  height?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  allergies?: string[];
  dietaryRestrictions?: string[];
  dislikedFoods?: string[];
}

export class AIService {
  private static readonly HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models";
  private static readonly HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
  
  // Free models available on Hugging Face
  private static readonly MODELS = {
    // Mistral 7B - Best free model for chat
    mistral: "mistralai/Mistral-7B-Instruct-v0.2",
    // Llama 2 - Good alternative
    llama: "meta-llama/Llama-2-7b-chat-hf",
    // Zephyr - Fast and efficient
    zephyr: "HuggingFaceH4/zephyr-7b-beta",
  };

  /**
   * Generate system prompt based on user context
   */
  private static generateSystemPrompt(context?: UserContext): string {
    if (!context) {
      return `Ti si Nutri AI, prijateljski nutritionist asistent. 
Tvoj zadatak je da pomogneš korisnicima sa pitanjima o ishrani, zdravlju i receptima.
Odgovaraj na srpskom jeziku, budi friendly i koristi emojije. 
Daj konkretne, praktične savete.`;
    }

    const { firstName, goal, allergies, dietaryRestrictions, dislikedFoods } = context;

    return `Ti si Nutri AI, personalizovani nutritionist asistent za korisnika ${firstName || "korisnika"}.

PROFIL KORISNIKA:
${goal ? `- Cilj: ${goal}` : ""}
${context.currentWeight ? `- Trenutna težina: ${context.currentWeight}kg` : ""}
${context.targetWeight ? `- Ciljna težina: ${context.targetWeight}kg` : ""}
${context.age ? `- Godine: ${context.age}` : ""}
${context.gender ? `- Pol: ${context.gender}` : ""}
${context.activityLevel ? `- Nivo aktivnosti: ${context.activityLevel}` : ""}

PREFERENCE:
${allergies?.length ? `- Alergije: ${allergies.join(", ")}` : ""}
${dietaryRestrictions?.length ? `- Dijetetske restrikcije: ${dietaryRestrictions.join(", ")}` : ""}
${dislikedFoods?.length ? `- Ne voli: ${dislikedFoods.join(", ")}` : ""}

TVOJ ZADATAK:
1. Daj personalizovane savete na osnovu korisnikovog profila
2. Predlaži recepte koji odgovaraju preferencijama (izbegavaj alergene i namirnice koje ne voli)
3. Motiviši korisnika i prati njegov napredak
4. Koristi friendly ton i emojije 😊
5. Odgovaraj UVEK na srpskom jeziku
6. Budi konkretan i praktičan

Odgovaraj kratko i jasno (max 200 reči).`;
  }

  /**
   * Call Hugging Face Inference API
   */
  private static async callHuggingFace(
    messages: ChatMessage[],
    model: string = this.MODELS.zephyr
  ): Promise<string> {
    if (!this.HUGGINGFACE_API_KEY) {
      // Fallback to mock response if no API key
      return this.getMockResponse(messages[messages.length - 1].content);
    }

    try {
      // Format messages for the model
      const prompt = this.formatMessagesForModel(messages);

      const response = await fetch(`${this.HUGGINGFACE_API_URL}/${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false,
          },
        }),
      });

      if (!response.ok) {
        console.error("Hugging Face API error:", response.status);
        return this.getMockResponse(messages[messages.length - 1].content);
      }

      const data = await response.json();
      
      // Handle different response formats
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text.trim();
      } else if (data.generated_text) {
        return data.generated_text.trim();
      }

      return this.getMockResponse(messages[messages.length - 1].content);
    } catch (error) {
      console.error("AI Service error:", error);
      return this.getMockResponse(messages[messages.length - 1].content);
    }
  }

  /**
   * Format messages for the model (Mistral/Llama format)
   */
  private static formatMessagesForModel(messages: ChatMessage[]): string {
    let prompt = "";

    for (const msg of messages) {
      if (msg.role === "system") {
        prompt += `<s>[INST] ${msg.content} [/INST]\n`;
      } else if (msg.role === "user") {
        prompt += `<s>[INST] ${msg.content} [/INST]\n`;
      } else if (msg.role === "assistant") {
        prompt += `${msg.content}</s>\n`;
      }
    }

    return prompt;
  }

  /**
   * Mock response for when API is unavailable or for testing
   */
  private static getMockResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("recept") || lowerMessage.includes("jelo")) {
      return `🍽️ Odličan izbor! Evo nekoliko zdravih opcija za tebe:

1. **Piletina sa povrćem** - Bogata proteinima, savršena za mršavljenje
2. **Losos sa avokadom** - Omega-3 masne kiseline za zdravlje srca
3. **Zobene palačinke** - Zdrav doručak pun energije

Koji tip jela te najviše zanima? Mogu ti dati detaljnije instrukcije! 😊`;
    }

    if (lowerMessage.includes("mršav") || lowerMessage.includes("kilogram") || lowerMessage.includes("težin")) {
      return `💪 Odličan cilj! Evo nekoliko saveta za zdrav gubitak težine:

1. **Kalorijski deficit** - Unosi 300-500 kcal manje dnevno
2. **Proteini** - 1.6-2g proteina po kg telesne težine
3. **Hidratacija** - Pij 2-3L vode dnevno
4. **Redovnost** - 3-4 obroka dnevno u istim terminima
5. **Aktivnost** - 30min vežbanja 3-4x nedeljno

Polako ali sigurno - 0.5-1kg nedeljno je idealno! 🎯`;
    }

    if (lowerMessage.includes("kalori") || lowerMessage.includes("unos")) {
      return `📊 Za tvoj profil preporučujem:

**Dnevni unos kalorija:** 1800-2000 kcal
**Makronutrijenti:**
- Proteini: 30% (135-150g)
- Ugljeni hidrati: 40% (180-200g)
- Masti: 30% (60-67g)

Ovo će ti omogućiti zdrav gubitak težine uz održavanje energije! 💪`;
    }

    if (lowerMessage.includes("doručak")) {
      return `🌅 Odličan doručak je ključ uspešnog dana! Evo mojih preporuka:

1. **Kajgana sa spanaćem** (300 kcal)
2. **Zobene pahuljice sa voćem** (350 kcal)
3. **Grč ki jogurt sa granolom** (280 kcal)
4. **Proteinsko smoothie** (320 kcal)

Svi su bogati proteinima i drže te sitim do ručka! 😊`;
    }

    // Default response
    return `Zdravo! 👋 Ja sam Nutri AI, tvoj personalizovani nutritionist asistent.

Mogu ti pomoći sa:
- 🍽️ Predlozima recepata
- 📊 Planiranjem ishrane
- 💪 Savetima za mršavljenje
- 🥗 Zdravim alternativama

Postavi mi konkretno pitanje i rado ću ti pomoći! 😊`;
  }

  /**
   * Main chat method
   */
  static async chat(
    userMessage: string,
    chatHistory: ChatMessage[] = [],
    userContext?: UserContext,
    isPremium: boolean = false
  ): Promise<string> {
    const messages: ChatMessage[] = [];

    // Add system prompt
    const systemPrompt = this.generateSystemPrompt(isPremium ? userContext : undefined);
    messages.push({
      role: "system",
      content: systemPrompt,
    });

    // Add chat history (only for premium users)
    if (isPremium && chatHistory.length > 0) {
      // Limit to last 5 messages to save tokens
      const recentHistory = chatHistory.slice(-5);
      messages.push(...recentHistory);
    }

    // Add current user message
    messages.push({
      role: "user",
      content: userMessage,
    });

    // Get AI response
    const response = await this.callHuggingFace(messages);

    return response;
  }

  /**
   * Generate meal plan (Premium only)
   */
  static async generateMealPlan(
    days: number,
    userContext: UserContext
  ): Promise<string> {
    const prompt = `Kreiraj ${days}-dnevni plan ishrane za korisnika sa sledećim profilom:
    
Cilj: ${userContext.goal || "održavanje težine"}
${userContext.allergies?.length ? `Alergije: ${userContext.allergies.join(", ")}` : ""}
${userContext.dietaryRestrictions?.length ? `Dijeta: ${userContext.dietaryRestrictions.join(", ")}` : ""}
${userContext.dislikedFoods?.length ? `Ne voli: ${userContext.dislikedFoods.join(", ")}` : ""}

Daj plan u formatu:
Dan 1:
- Doručak: ...
- Ručak: ...
- Večera: ...

Uključi kalorije za svaki obrok.`;

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: "Ti si nutricionista koji kreira personalizovane planove ishrane.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return await this.callHuggingFace(messages);
  }

  /**
   * Quick suggestions for common questions
   */
  static getQuickSuggestions(): string[] {
    return [
      "Koji recept preporučuješ za večeras?",
      "Kako da izgubim 5kg za mesec dana?",
      "Šta da jedem za doručak?",
      "Koliko kalorija treba da unosim?",
      "Daj mi zdrave snack ideje",
      "Kako da planiram obroke?",
    ];
  }
}
