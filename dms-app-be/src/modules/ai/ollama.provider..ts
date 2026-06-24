import { Injectable } from "@nestjs/common";
import { IAiProvider } from "src/interfaces/ai-provider.interface";
import axios from 'axios'
@Injectable()
export class OllamaProvider
  implements IAiProvider {

  async ask(prompt: string) {
    const response =
      await axios.post(
        'http://localhost:11434/api/generate',
        {
          model: 'llama3',
          prompt,
          stream: false,
        },
      );

    return response.data.response;
  }

  async summarize(text: string) {
    return this.ask(
      `Summarize:\n${text}`,
    );
  }

  async generateTags(text: string) {
    return this.ask(
      `Extract tags:\n${text}`,
    );
  }

  async classify(text: string) {
    return this.ask(
      `Classify:\n${text}`,
    );
  }
}