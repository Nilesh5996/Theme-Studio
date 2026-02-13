
import { GoogleGenAI, Type } from "@google/genai";
import { MobileTheme } from "../types";

export class ThemeAIService {
  private ai: GoogleGenAI;

  constructor() {
    // Always use process.env.API_KEY directly as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateThemeFromPrompt(prompt: string): Promise<Partial<MobileTheme>> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Generate a high-end mobile theme configuration based on the prompt: "${prompt}". Return as JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              colors: {
                type: Type.OBJECT,
                properties: {
                  primary: { type: Type.STRING },
                  secondary: { type: Type.STRING },
                  background: { type: Type.STRING },
                  surface: { type: Type.STRING },
                  text: { type: Type.STRING },
                  accent: { type: Type.STRING },
                },
                required: ['primary', 'secondary', 'background', 'surface', 'text', 'accent']
              },
              typography: {
                type: Type.OBJECT,
                properties: {
                  fontFamily: { type: Type.STRING },
                  fontSizeBase: { type: Type.NUMBER },
                  borderRadius: { type: Type.NUMBER },
                },
                required: ['fontFamily', 'fontSizeBase', 'borderRadius']
              },
              iconStyle: { type: Type.STRING, enum: ['minimal', 'rounded', 'outline', 'glass'] },
              wallpaperUrl: { type: Type.STRING }
            },
            required: ['name', 'colors', 'typography', 'iconStyle', 'wallpaperUrl']
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw error;
    }
  }

  async generateWallpaper(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A professional, high-quality mobile phone wallpaper: ${prompt}. Artistic, aesthetic, and visually stunning.` }]
        },
      });

      if (!response.candidates?.[0]?.content?.parts) {
        throw new Error("Invalid response from image model");
      }

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data found in AI response");
    } catch (error) {
      console.error("Wallpaper Generation Error:", error);
      throw error;
    }
  }
}

export const themeAIService = new ThemeAIService();
