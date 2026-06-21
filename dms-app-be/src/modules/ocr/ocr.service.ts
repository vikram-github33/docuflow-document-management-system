import Tesseract from 'tesseract.js';
import * as pdfParse from 'pdf-parse';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OcrService {
  async extractText(file: Express.Multer.File): Promise<string> {
    // Text PDF
    if (file.mimetype === 'application/pdf') {
      try {
        const pdfData = await pdfParse(file.buffer);

        if (pdfData.text?.trim()) {
          return pdfData.text;
        }
      } catch (error) {
        console.log('PDF parse failed');
      }
    }

    // Images
    if (
      file.mimetype.startsWith('image/')
    ) {
      const result = await Tesseract.recognize(
        file.buffer,
        'eng',
      );

      return result.data.text;
    }

    return '';
  }
}