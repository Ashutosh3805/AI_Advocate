import React, { useState, useRef, useEffect } from 'react';
import MessageDisplay from './MessageDisplay';
import InputBox from './InputBox';
import LitigationCards from './LitigationCards';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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

  const generateAIResponse = (userQuery) => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('hi') || query.includes('hello')) {
      return 'Greetings. How can I assist your litigation or contract risk analysis today?';
    } else if (query.includes('risk') || query.includes('nda') || query.includes('contract')) {
      return 'Based on our model analysis of standard non-disclosure agreements, key risk factors include: \n1. Overly broad definition of "Confidential Information" that extends beyond proprietary data.\n2. Inequitable unilateral survival terms (e.g. 5+ years post-termination).\n3. Ambiguous injunctive relief clauses without standard proof of actual damages.';
    } else if (query.includes('memo') || query.includes('ruling') || query.includes('california')) {
      return 'MEMORANDUM: California Business and Professions Code § 16600\n\nUnder California law, non-compete agreements are void ab initio. The recent enactment of SB 699 and AB 1076 expands this protection by rendering non-compete covenants unenforceable regardless of where they were originally signed, and mandates written notice to employees by February 14th of each calendar year. Non-compliance exposes employers to statutory damages under § 17200 (UCL).';
    } else if (query.includes('precedent') || query.includes('fair use') || query.includes('intellectual property')) {
      return 'Precedent review shows that in software fair use cases (such as Google LLC v. Oracle America, Inc., 593 U.S. ___ (2021)), the Supreme Court ruled that copying key elements of an API declared fair use as a matter of law, prioritizing interoperability and progress in the software ecosystem.';
    } else if (query.includes('ccpa') || query.includes('regulatory') || query.includes('privacy')) {
      return 'Under the California Consumer Privacy Act (CCPA), startups meeting threshold metrics must comply with: \n1. The Right to Know/Access collected user attributes.\n2. The Right to Delete personal information.\n3. Transparent opt-out mechanisms for the "sale or sharing" of private telemetry data.';
    } else {
      return `Ross Mode search completed for query: "${userQuery}". Statues and precedent analysis compiled. Let me know if you would like me to draft a legal memorandum or organize case law citations based on this query.`;
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newUserMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, newUserMessage]);
    const userQuery = inputText;
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiReplyText = generateAIResponse(userQuery);

      const newAiMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText
      };

      setMessages(prev => [...prev, newAiMessage]);
    }, 1200);
  };

  const handleCardClick = (promptText) => {
    setInputText(promptText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-full">
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

      <InputBox 
        inputText={inputText}
        setInputText={setInputText}
        textareaRef={textareaRef}
        handleInputChange={handleInputChange}
        handleSend={handleSend}
      />
    </div>
  );
}
 