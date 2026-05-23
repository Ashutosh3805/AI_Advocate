import mongoose from 'mongoose';

const citationSchema = new mongoose.Schema({
  filename: String,
  text: String,
  score: Number,
});

const legalQuerySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    citations: [citationSchema],
  },
  {
    timestamps: true,
  }
);

const LegalQuery = mongoose.model('LegalQuery', legalQuerySchema);
export default LegalQuery;
