import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { IAiProvider } from 'src/interfaces/ai-provider.interface';
// import { IAiProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class GeminiProvider
  implements IAiProvider {

  private ai = new GoogleGenAI({
    apiKey:
      process.env.GEMINI_API_KEY,
  });

  async ask(prompt: string) {
    const response =
      await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

    return response.text ?? '';
  }

  summarize(text: string) {
    return this.ask(
      `Summarize:\n${text}`,
    );
  }

  generateTags(text: string) {
    return this.ask(
      `Extract tags:\n${text}`,
    );
  }

  classify(text: string) {
    return this.ask(
      `Classify:\n${text}`,
    );
  }
}