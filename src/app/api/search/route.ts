import { GoogleGenerativeAI } from "@google/generative-ai";
import { filterProducts } from "@/lib/products";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: any) {
  try {
    const { query } = await request.json();

    if (!query || query.trim() === "") {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // This is the core prompt — it tells Gemini to convert text into a structured filter
    const prompt = `
      You are a product search assistant for an online clothing and shoes store.
      Convert the user's natural language search into a JSON filter object.

      Available filter fields:
      - category: one of ["shoes", "jeans", "dress", "tshirt"] or null
      - color: one of ["red", "black", "blue", "white", "pink"] or null
      - brand: one of ["Nike", "Adidas", "Levi's", "Zara", "H&M", "Puma", "Tommy Hilfiger"] or null
      - maxPrice: number or null
      - minPrice: number or null
      - minRating: number (1-5) or null

      User query: "${query}"

      Respond ONLY with a valid JSON object, no explanation, no markdown. Example:
      {"category": "shoes", "color": "red", "maxPrice": 50, "minPrice": null, "brand": null, "minRating": null}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Parse the JSON response from Gemini
    const filters = JSON.parse(text);

    // Apply filters to products
    const filteredProducts = filterProducts(filters);

    return Response.json({
      filters,   // send back so frontend can show what AI understood
      products: filteredProducts,
    });

  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}