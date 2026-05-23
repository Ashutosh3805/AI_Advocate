import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import MessageDisplay from '../Components/MessageDisplay';
import LitigationCards from '../Components/LitigationCards';
import InputBox from '../Components/InputBox';
import RightControls from '../Components/RightControls';
import { ChatService, DocumentService } from '../api/services';

export default function CaseTerminal() {
  const navigate = useNavigate();

  // Active chat thread messages
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeRecent, setActiveRecent] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Backend MERN Integration States
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatHistoryList, setChatHistoryList] = useState([]);
  const [documentsList, setDocumentsList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Fetch all chat threads from backend
  const fetchChatHistory = async () => {
    try {
      const res = await ChatService.getHistory();
      if (res.success) {
        setChatHistoryList(res.data);
      }
    } catch (err) {
      console.error('[TERMINAL] History loading failed:', err);
    }
  };

  // Fetch all indexed documents from backend
  const fetchDocuments = async () => {
    try {
      const res = await DocumentService.list();
      if (res.success) {
        setDocumentsList(res.data);
      }
    } catch (err) {
      console.error('[TERMINAL] Document listing failed:', err);
    }
  };

  // Load chats on mount
  useEffect(() => {
    fetchChatHistory();
    fetchDocuments();
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Close profile menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle auto-expanding text input area
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 192)}px`;
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Asynchronously query the Ross Mode AI with full DB persistence
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const queryText = inputText;
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Instantly append user message visually
    const newUserMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: queryText
    };
    setMessages(prev => [...prev, newUserMessage]);

    setIsTyping(true);

    try {
      const res = await ChatService.askQuestion(queryText, activeChatId);
      if (res.success) {
        // Map backend thread messages to UI
        const mappedMessages = res.data.messages.map((m) => ({
          id: m._id || `msg-ai-${Date.now()}-${Math.random()}`,
          sender: m.sender,
          text: m.text,
        }));
        setMessages(mappedMessages);

        if (!activeChatId) {
          setActiveChatId(res.data.chatId);
        }
        
        // Refresh sidebar historical entries list
        fetchChatHistory();
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: `[SYSTEM ERROR] Node connection issue. Failed to analyze litigation query: ${err.message || 'Server offline.'}`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Load full conversation logs for a clicked sidebar entry
  const loadChatThread = async (chatId) => {
    setIsTyping(true);
    try {
      const res = await ChatService.getChatDetails(chatId);
      if (res.success) {
        const mappedMessages = res.data.messages.map((m) => ({
          id: m._id || `msg-${Date.now()}-${Math.random()}`,
          sender: m.sender,
          text: m.text,
        }));
        setMessages(mappedMessages);
        setActiveChatId(chatId);
        
        const chatObj = chatHistoryList.find(c => c._id === chatId);
        if (chatObj) {
          setActiveRecent(chatObj.name);
        }
      }
    } catch (err) {
      console.error(err);
      alert(`Connection failed. Could not load filings logs: ${err.message || err}`);
    } finally {
      setIsTyping(false);
    }
  };

  // Handles dynamic file uploading and triggers instant RAG indexing in MongoDB
  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);

    // Show temporary upload indicator inside the chat
    const tempId = `msg-upload-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: tempId,
      sender: 'ai',
      text: `[SECURE UPLOAD INITIALIZED] Uploading and indexing legal document: "${file.name}"...`
    }]);

    try {
      const res = await DocumentService.upload(file);
      if (res.success) {
        setMessages(prev => prev.map(m => m.id === tempId ? {
          ...m,
          text: `[COMPLETED] Securing and indexing of "${file.name}" complete.\nIndexed size: ${(file.size / 1024).toFixed(1)} KB.\nTotal vector store chunks: ${res.data.totalChunks} segments.\n\nYou can now reference this document dynamically during consultations.`
        } : m));
        fetchDocuments();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(m => m.id === tempId ? {
        ...m,
        text: `[INDEX_FAILED] Secure upload failure: ${err.message || 'Server connection failed.'}`
      } : m));
    } finally {
      setIsUploading(false);
    }
  };

  const handleNewCase = () => {
    setMessages([]);
    setActiveChatId(null);
    setActiveRecent('');
  };

  const handleCardClick = (promptText) => {
    setInputText(promptText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div className="bg-[#000000] text-[#ececec] font-body-md h-screen overflow-hidden flex relative select-none">
      
      {/* Sidebar Component */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        messages={messages}
        setMessages={setMessages}
        activeRecent={activeRecent}
        setActiveRecent={setActiveRecent}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        onLogout={handleLogout}
        profileMenuRef={profileMenuRef}
        chatHistoryList={chatHistoryList}
        activeChatId={activeChatId}
        loadChatThread={loadChatThread}
        handleNewCase={handleNewCase}
        fetchChatHistory={fetchChatHistory}
      />

      {/* Main Workspace Pane */}
      <main className="flex-grow flex flex-col h-full relative overflow-hidden bg-[#000000]">
        
        {/* Header Component */}
        <Header 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Message Display Area */}
        {messages.length === 0 ? (
          <LitigationCards handleCardClick={handleCardClick} />
        ) : (
          <MessageDisplay 
            messages={messages}
            isTyping={isTyping}
            chatEndRef={chatEndRef}
            copiedId={copiedId}
            handleCopy={handleCopy}
          />
        )}

        {/* Input Box Component */}
        <InputBox 
          inputText={inputText}
          setInputText={setInputText}
          textareaRef={textareaRef}
          handleInputChange={handleInputChange}
          handleSend={handleSend}
          onFileUpload={handleFileUpload}
        />

      </main>

      {/* Right Controls Component */}
      <RightControls setMessages={setMessages} />

    </div>
  );
}
