import pdfParse from 'pdf-parse';

/**
 * Service to handle PDF parsing operations.
 * Extracts raw textual content from binary PDF buffers.
 */
export const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    
    // Check if we extracted any text
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No text content could be extracted from this PDF. It may be scanned or empty.');
    }
    
    return {
      text: data.text,
      info: data.info,
      numpages: data.numpages,
    };
  } catch (error) {
    console.error(`[PDF_SERVICE_ERROR] Extraction failed: ${error.message}`);
    throw new Error(`Failed to process legal PDF: ${error.message}`);
  }
};

/**
 * Splits legal text recursively into digestible semantic chunks.
 * Standard sizing: 1000 characters chunk, 200 overlap to maintain context.
 */
export const chunkText = (text, chunkSize = 1000, chunkOverlap = 200) => {
  if (!text) return [];
  
  const chunks = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;
    
    // Attempt to split on word boundary/newline for cleanliness
    if (endIndex < text.length) {
      const boundary = text.lastIndexOf(' ', endIndex);
      if (boundary > startIndex + (chunkSize - chunkOverlap)) {
        endIndex = boundary;
      }
    }
    
    chunks.push(text.substring(startIndex, endIndex).trim());
    startIndex = endIndex - chunkOverlap;
    
    if (startIndex >= text.length - chunkOverlap) {
      break;
    }
  }
  
  return chunks.filter(c => c.length > 10); // Remove noise chunks
};
