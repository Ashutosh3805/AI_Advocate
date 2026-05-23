import Document from '../models/Document.js';
import { analyzeContractContent } from '../services/aiService.js';

/**
 * @desc    Submit a contract document for structured analysis (summarization, risks, recommendations)
 * @route   POST /api/analyze
 * @access  Private
 */
export const analyzeDocument = async (req, res, next) => {
  try {
    const { documentId, text } = req.body;

    let targetText = '';
    let documentName = 'Manual Input';

    if (documentId) {
      const doc = await Document.findOne({ _id: documentId, user: req.user._id });
      if (!doc) {
        return res.status(404).json({
          success: false,
          message: 'Document not found. Verify you possess the right security context access clearance.',
          data: null,
        });
      }
      targetText = doc.extractedText;
      documentName = doc.originalName;
    } else if (text && text.trim().length > 0) {
      targetText = text;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid request payload. Specify a documentId or provide raw text in the body.',
        data: null,
      });
    }

    console.log(`[ANALYSIS] Initializing audit for: ${documentName}`);
    
    // Call deep legal analysis service utilizing OpenAI
    const analysisReport = await analyzeContractContent(targetText);

    return res.status(200).json({
      success: true,
      message: `Structured contract audit completed for: ${documentName}`,
      data: {
        filename: documentName,
        analysis: analysisReport,
      },
    });
  } catch (error) {
    next(error);
  }
};
