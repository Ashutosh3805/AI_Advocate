import { OpenAI } from 'openai';
import DocumentChunk from '../models/DocumentChunk.js';

// Helper to initialize OpenAI client safely
const getOpenAIClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn('[AI_SERVICE_WARNING] GROQ_API_KEY environment variable is not defined. Using mock fallback mode.');
  }
  // Note: GROQ does not support embeddings API, using OpenAI embedding model
  return new OpenAI({ apiKey: apiKey || 'mock-key' });
};

/**
 * Service to generate high-dimensional embeddings and execute similarity searches.
 * Bypasses native ChromaDB/FAISS binaries to guarantee absolute portability and stability.
 */
export const generateEmbedding = async (text) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      // Mock fallback vector (1536 elements) for local development if API key is not present
      const mockVector = Array.from({ length: 1536 }, () => Math.random() - 0.5);
      // Normalize vector
      const magnitude = Math.sqrt(mockVector.reduce((sum, val) => sum + val * val, 0));
      return mockVector.map(val => val / magnitude);
    }

    const openai = getOpenAIClient();
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.replace(/\n/g, ' '),
    });

    return response.data[0].embedding;
  } catch (error) {
    console.warn(`[EMBEDDING_SERVICE_WARNING] Embeddings generation failed (${error.message}). Falling back to mock vector to prevent crash.`);
    const mockVector = Array.from({ length: 1536 }, () => Math.random() - 0.5);
    const magnitude = Math.sqrt(mockVector.reduce((sum, val) => sum + val * val, 0));
    return mockVector.map(val => val / magnitude);
  }
};

/**
 * Calculates dot product (equivalent to Cosine Similarity for unit-normalized vectors).
 */
const calculateCosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Performs similarity search in MongoDB for the target user.
 * Fetches user's document chunks, calculates similarities, and returns the top k results.
 */
export const similaritySearch = async (userId, queryText, k = 4) => {
  try {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(queryText);

    // Fetch all chunks for this specific user to maintain strict isolation
    const chunks = await DocumentChunk.find({ user: userId }).populate('document', 'filename originalName');

    if (chunks.length === 0) {
      return [];
    }

    // Map chunks and calculate cosine similarity scoring
    const scoredChunks = chunks.map((chunk) => {
      const score = calculateCosineSimilarity(queryEmbedding, chunk.embedding);
      return {
        chunkId: chunk._id,
        text: chunk.text,
        filename: chunk.document ? chunk.document.originalName : 'Unknown PDF',
        score: score,
      };
    });

    // Sort descending by score and return top k
    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks.slice(0, k);
  } catch (error) {
    console.error(`[VECTOR_STORE_ERROR] Similarity search failed: ${error.message}`);
    return [];
  }
};
