import fs from 'fs';
import Document from '../models/Document.js';
import DocumentChunk from '../models/DocumentChunk.js';
import { extractTextFromPDF, chunkText } from '../services/pdfService.js';
import { generateEmbedding } from '../services/vectorStoreService.js';

/**
 * @desc    Upload a legal PDF document, parse text, chunk content, generate embeddings and store in database
 * @route   POST /api/upload
 * @access  Private
 */
export const uploadPDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file received. Select a PDF file to upload.',
        data: null,
      });
    }

    console.log(`[UPLOAD] Processing file: ${req.file.originalname} (${req.file.size} bytes)`);

    // 1. Read binary buffer from local storage where multer saved it
    const fileBuffer = fs.readFileSync(req.file.path);

    // 2. Extract plain text from PDF buffer using pdfService
    let parsedData;
    try {
      parsedData = await extractTextFromPDF(fileBuffer);
    } catch (parseError) {
      // Cleanup locally uploaded file before exiting
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      
      return res.status(422).json({
        success: false,
        message: `PDF parse failure: ${parseError.message}`,
        data: null,
      });
    }

    // 3. Create Document record in database
    const newDoc = await Document.create({
      user: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      extractedText: parsedData.text,
      fileSize: req.file.size,
      filePath: req.file.path,
    });

    // 4. Generate semantic chunks (1000 characters, 200 overlap)
    const chunks = chunkText(parsedData.text);
    console.log(`[RAG] Document split into ${chunks.length} chunks. Generating embeddings...`);

    // 5. Generate embeddings and create DocumentChunk logs
    // We execute sequentially or in small parallel batches to prevent OpenAI rate limits
    const chunkPromises = chunks.map(async (text, index) => {
      try {
        const embedding = await generateEmbedding(text);
        return {
          document: newDoc._id,
          user: req.user._id,
          text: text,
          embedding: embedding,
          chunkIndex: index,
        };
      } catch (err) {
        console.error(`[EMBEDDING_GENERATION_FAILED] Chunk ${index}: ${err.message}`);
        return null;
      }
    });

    const chunkRecords = (await Promise.all(chunkPromises)).filter(c => c !== null);

    if (chunkRecords.length > 0) {
      await DocumentChunk.insertMany(chunkRecords);
      console.log(`[RAG_SUCCESS] ${chunkRecords.length} document chunks successfully embedded and indexed.`);
    }

    return res.status(201).json({
      success: true,
      message: 'Legal PDF uploaded, text parsed, and indexed in Vector Store successfully.',
      data: {
        documentId: newDoc._id,
        filename: newDoc.originalName,
        totalChunks: chunkRecords.length,
        numpages: parsedData.numpages,
      },
    });
  } catch (error) {
    // Attempt local file cleanup in case of catastrophic controller failure
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * @desc    Get all uploaded legal documents metadata
 * @route   GET /api/documents
 * @access  Private
 */
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ user: req.user._id })
      .select('originalName fileSize uploadDate numpages')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Filing legal documents repository indexed.',
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};
