import Chat from '../models/Chat.js';
import { askRossMode } from '../services/aiService.js';
import LegalQuery from '../models/LegalQuery.js';

/**
 * @desc    Get all chat threads for the current user
 * @route   GET /api/chat/history
 * @access  Private
 */
export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .select('name messages createdAt updatedAt')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Case terminal filing history retrieved.',
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Retrieve a single chat thread details
 * @route   GET /api/chat/:id
 * @access  Private
 */
export const getChatById = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Filing not found. The requested case thread does not exist or belongs to another security context.',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Filing case thread retrieved successfully.',
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit a legal query (triggers RAG ROUtine, updates MERN thread logs, and logs citation stats)
 * @route   POST /api/chat
 * @access  Private
 */
export const askQuestion = async (req, res, next) => {
  try {
    const { query, chatId } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input. Legal query queryText is required.',
        data: null,
      });
    }

    let activeChat;

    // 1. Locate or dynamically instantiate a chat thread context
    if (chatId) {
      activeChat = await Chat.findOne({ _id: chatId, user: req.user._id });
      if (!activeChat) {
        return res.status(404).json({
          success: false,
          message: 'Case filing context not found. Cannot continue conversation under this ID.',
          data: null,
        });
      }
    } else {
      // Automatically derive case title from query (truncate to 25 chars)
      const derivedName = query.length > 25 ? `${query.substring(0, 25)}...` : query;
      activeChat = await Chat.create({
        user: req.user._id,
        name: derivedName,
        messages: [],
      });
    }

    // 2. Format current chat history to supply RAG system context
    const historyLogs = activeChat.messages.slice(-10); // Keep last 10 exchanges for context memory

    // 3. Trigger legal assistant AI pipeline (incorporates PDF semantic similarity and disclaimer rules)
    const aiResult = await askRossMode(req.user._id, query, historyLogs);

    // 4. Update and persist message logs inside MongoDB
    activeChat.messages.push({ sender: 'user', text: query });
    activeChat.messages.push({ sender: 'ai', text: aiResult.text });
    
    // Auto-update case name if it was a default and query is rich
    if (activeChat.name === 'New Case Consultation' || activeChat.messages.length === 2) {
      activeChat.name = query.length > 25 ? `${query.substring(0, 25)}...` : query;
    }
    
    await activeChat.save();

    // 5. Audit query stats and citation details inside database
    await LegalQuery.create({
      user: req.user._id,
      query: query,
      response: aiResult.text,
      citations: aiResult.citations.map(c => ({
        filename: c.filename,
        text: c.text,
        score: c.score,
      })),
    });

    return res.status(200).json({
      success: true,
      message: 'Query processed, filing log saved.',
      data: {
        chatId: activeChat._id,
        chatName: activeChat.name,
        messages: activeChat.messages,
        citations: aiResult.citations,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Instantiate a new empty case thread context
 * @route   POST /api/chat/new
 * @access  Private
 */
export const createNewChat = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newChat = await Chat.create({
      user: req.user._id,
      name: name || 'New Case Consultation',
      messages: [],
    });

    return res.status(201).json({
      success: true,
      message: 'New case thread filing opened.',
      data: newChat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a chat thread and all related filings
 * @route   DELETE /api/chat/:id
 * @access  Private
 */
export const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Filing not found or access denied.',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Filing case thread permanently purged.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
