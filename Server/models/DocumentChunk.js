import mongoose from 'mongoose';

const documentChunkSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number], // 1536 float elements from OpenAI's embedding API
      required: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize database queries with semantic indices
documentChunkSchema.index({ user: 1, document: 1 });

const DocumentChunk = mongoose.model('DocumentChunk', documentChunkSchema);
export default DocumentChunk;
