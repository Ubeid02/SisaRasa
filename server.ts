import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Lazy-initialization of our server-side Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (error) {
    console.error("Error creating GoogleGenAI instance:", error);
    return null;
  }
}

// 1. API: GENERATE CHEF TIP
app.post("/api/gemini/tip", async (req, res) => {
  const { recipeTitle, ingredients } = req.body;

  if (!recipeTitle) {
    res.status(400).json({ error: "Judul resep tidak boleh kosong" });
    return;
  }

  const ingredientList = Array.isArray(ingredients) ? ingredients : [];
  const ai = getGeminiClient();

  if (!ai) {
    // Elegant fallback tips if API key is not configured yet
    const fallbacks = [
      "Kunci kelezatan masakan sisa adalah menumis sisa bawang merah dan bawang putih hingga kuning kecokelatan untuk membangkitkan aroma umami alami.",
      "Jika Anda kekurangan sayuran segar, sisa daun bawang atau tomat di kulkas bisa ditumis agak layu di akhir masakan untuk mempertahankan kesegaran warna.",
      "Selalu gunakan margarin sisa di sudut kulkas sebagai pengganti minyak goreng biasa agar masakan tumis sisa bahan terasa lebih legit dan gurih.",
      "Untuk telur sisa, mengocok lepas telur dengan sedikit keju parut atau potongan sosis sisa sebelum digoreng akan menghasilkan omelet lebih empuk merata.",
      "Jangan buang potongan kol yang layu, cuci bersih lalu rendam di air es selama 5 menit untuk mengembalikan kesegaran kriuk alaminya!"
    ];
    const randomTip = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    res.json({ tip: `💡 [Tips Offline] ${randomTip}` });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Kamu adalah Chef Koki SisaRasa, pakar pengolahan sisa makanan (zero-waste cooking). 
Diberikan resep masakan "${recipeTitle}" dan sisa bahan dapur pengguna saat ini: [${ingredientList.join(", ")}].
Berikan 1 tips koki (Chef Tip) dalam Bahasa Indonesia yang sangat praktis, kreatif, dan inspiratif untuk memaksimalkan bumbu/bahan tersebut atau memberikan alternatif jika ada bahan utama yang kurang.
TIPS WAJIB singkat, maksimal 2-3 kalimat saja. Tulis langsung sebagai teks lurus tanpa menggunakan penulisan markdown tebal (**) atau miring (*). Hidangkan tips yang hangat dan membantu!`,
    });

    const parsedTip = response.text?.trim() || "💡 Pastikan tumis bumbu dasar hingga wangi agar cita rasa masakan sisa Anda menjadi istimewa!";
    res.json({ tip: parsedTip });
  } catch (error: any) {
    console.error("Gemini API Error in /api/gemini/tip:", error);
    res.json({ 
      tip: "💡 Tips Koki: Selalu tumis bumbu bawang melimpah di awal putaran memasak untuk mengikat aroma sedap ditiap sisa sayur kulkas." 
    });
  }
});

// 2. API: GENERATE CUSTOM RECIPE (SMART AI RECIPE MATCHING)
app.post("/api/gemini/generate-recipe", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    res.status(400).json({ error: "Bahan-bahan kulkas tidak terdeteksi atau kosong" });
    return;
  }

  const ai = getGeminiClient();

  if (!ai) {
    // If offline or no Gemini API key configured, return a custom matched placeholder
    const generatedFallback = {
      title: `Oseng Sisa Kulkas Mantap (${ingredients.join(" & ")})`,
      description: "Kreasi tumisan koki kilat penyelamat sisa bahan makanan di kulkas Anda hari ini. Cepat dibuat, wangi, dan pas dengan nasi hangat.",
      prepTime: 12,
      difficulty: "Mudah",
      category: "Kreasi Koki Kilat",
      ingredients: ingredients.map(ing => ({ name: ing, quantity: "Secukupnya", isEssential: true })),
      instructions: [
        "Potong-potong bahan sisa kulkas Anda sesuai selera.",
        "Tumis bawang putih dan bawang merah cincang dengan margarin atau minyak secukupnya hingga harum.",
        "Masukkan bahan protein seperti telur sisa atau sosis, lalu tuangkan sisa sayuran.",
        "Beri sedikit bumbu penyedap, kecap manis, garam, dan lada. Masak hingga matang merata.",
        "Sajikan hangat di atas piring bersama taburan cinta koki zero waste!"
      ]
    };
    res.json(generatedFallback);
    return;
  }

  try {
    const prompt = `Kamu adalah Chef Koki SisaRasa, pakar pengolahan sisa kulkas (zero-waste expert). 
Pengguna hanya memiliki bahan-bahan masakan ini tersisa di kulkas mereka: [${ingredients.join(", ")}].
Tolong buatkan 1 resep masakan khas Indonesia yang paling kreatif, lezat, gampang, dan praktis menggunakan bahan-bahan sisa di atas secara maksimal.
Bahan yang tidak tercantum dalam daftar di atas tetap boleh ditambahkan secara opsional jika memang esensial untuk memasak (misal bumbu garam, air, minyak, bumbu dasar standar).

Format respons harus berupa JSON objek valid sesuai schema ini:
- title: string (Nama masakan kreatif beralur zero-waste khas Indonesia, misalnya: "Orak Arik Telur Tempe Penyelamat")
- description: string (Deskripsi menggugah selera yang berambisi menghemat makanan)
- prepTime: integer (Estimasi durasi memasak dalam menit)
- difficulty: string ("Mudah" | "Sedang" | "Sukar")
- category: string (Kategori masakan, contoh: "Tumisan Praktis", "Lauk Utama", "Kuah Hangat")
- ingredients: Array dari objek { name: string, quantity: string, isEssential: boolean }
- instructions: Array dari string (Langkah detail memasak berurutan dari langkah pertama sampai hidangan siap dinikmati)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            prepTime: { type: Type.INTEGER },
            difficulty: { type: Type.STRING },
            category: { type: Type.STRING },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  isEssential: { type: Type.BOOLEAN }
                },
                required: ["name", "quantity", "isEssential"]
              }
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "prepTime", "difficulty", "category", "ingredients", "instructions"]
        }
      }
    });

    const parsedJson = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedJson);
  } catch (error: any) {
    console.error("Gemini API Error in /api/gemini/generate-recipe:", error);
    // Graceful backup
    res.json({
      title: `Tumis Spesial SisaRasa (${ingredients.slice(0, 2).join(" & ")})`,
      description: "Kreasi koki penyelamat zero-waste berdasar bahan dapur yang tersedia. Cita rasa hangat rumahan.",
      prepTime: 15,
      difficulty: "Mudah",
      category: "Tumisan Praktis",
      ingredients: ingredients.map(ing => ({ name: ing, quantity: "Secukupnya", isEssential: true })),
      instructions: [
        "Cuci dan bersihkan sisa bahan yang Anda miliki.",
        "Siapkan bawang merah dan bawang putih, cincang halus.",
        "Tumis bawang hingga layu kecokelatan, kemudian masukkan bahan protein menyusul dangan sayuran sisa.",
        "Tambahkan lada, garam, dan kecap manis sesuai selera Anda.",
        "Sajikan selagi hangat untuk menu hemat yang lezat!"
      ]
    });
  }
});

// Configure Vite integration as Express middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 SisaRasa fullstack server actively listening on port ${PORT}`);
  });
}

startServer();
