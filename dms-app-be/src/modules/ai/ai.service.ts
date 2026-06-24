import { IAiProvider } from "src/interfaces/ai-provider.interface";
import { OllamaProvider } from "./ollama.provider.";
import { GeminiProvider } from "./gemini.provider";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AiService {

  private provider: IAiProvider;

  constructor(
    private readonly ollamaProvider:
      OllamaProvider,

    private readonly geminiProvider:
      GeminiProvider,
  ) {

    this.provider =
      process.env.AI_PROVIDER === 'ollama'
        ? this.ollamaProvider
        : this.geminiProvider;
  }

  summarize(text: string) {
    return this.provider.summarize(text);
  }

  generateTags(text: string) {
    return this.provider.generateTags(text);
  }

  classify(text: string) {
    return this.provider.classify(text);
  }
}