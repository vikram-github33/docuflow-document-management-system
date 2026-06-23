import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import pdfParse from 'pdf-parse';
@Injectable()
export class AiService {
  //   private openai = new OpenAI({
  //     apiKey: process.env.OPENAI_API_KEY,
  //   });

  //   async generateEmbedding(text: string) {
  //     const response =
  //       await this.openai.embeddings.create({
  //         model: 'text-embedding-3-small',
  //         input: text,
  //       });

  //     return response.data[0].embedding;
  //   }

  async ask(prompt: string) {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3',
      prompt,
      stream: false,
    });

    return response.data.response;
  }

  async extractPdfText(buffer: Buffer) {
    const pdfData = await pdfParse(buffer);

    return pdfData.text;
  }

  async summarize(text: string) {
    return this.ask(`
Summarize the following document.

${text}
`);
  }

  async generateTags(text: string) {
    return this.ask(`
Extract 5 tags.

Return JSON array only.

${text}
`);
  }

  async classify(text: string) {
    return this.ask(`
Classify document.

Possible categories:

Invoice
Contract
HR
Legal
Resume
Policy

Return only category.

${text}
`);
  }
}
