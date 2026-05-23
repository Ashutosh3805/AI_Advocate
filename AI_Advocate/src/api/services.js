import API from './axios';

/**
 * Service to manage authentication requests
 */
export const AuthService = {
  register: async (email, password) => {
    return API.post('/auth/register', { email, password });
  },
  
  login: async (email, password) => {
    return API.post('/auth/login', { email, password });
  },
  
  getMe: async () => {
    return API.get('/auth/me');
  }
};

/**
 * Service to manage legal AI chat thread interactions
 */
export const ChatService = {
  getHistory: async () => {
    return API.get('/chat/history');
  },
  
  getChatDetails: async (chatId) => {
    return API.get(`/chat/${chatId}`);
  },
  
  askQuestion: async (query, chatId = null) => {
    return API.post('/chat', { query, chatId });
  },
  
  createNewChat: async (name = 'New Case Consultation') => {
    return API.post('/chat/new', { name });
  },
  
  deleteChat: async (chatId) => {
    return API.delete(`/chat/${chatId}`);
  }
};

/**
 * Service to manage document uploads and RAG filings
 */
export const DocumentService = {
  upload: async (fileObject) => {
    const formData = new FormData();
    formData.append('file', fileObject);
    
    return API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  list: async () => {
    return API.get('/documents');
  }
};

/**
 * Service to request specialized contract analysis audits
 */
export const AnalyzeService = {
  analyze: async (documentId = null, rawText = '') => {
    return API.post('/analyze', { documentId, text: rawText });
  }
};
