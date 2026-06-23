import { Injectable } from "@nestjs/common";
import pdfParse from 'pdf-parse';
@Injectable()
export class ChunkService {
  chunkText(    
    text: string,
    chunkSize = 1000,
  ): string[] {
    const chunks: string[] = [];

    for (
      let i = 0;
      i < text.length;
      i += chunkSize
    ) {
      chunks.push(
        text.slice(i, i + chunkSize),
      );
    }

    return chunks;
  }


 

}