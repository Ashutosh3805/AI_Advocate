import React from 'react';
import { ChatService } from '../api/services';

export default function Sidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  messages, 
  setMessages, 
  activeRecent, 
  setActiveRecent,
  showProfileMenu,
  setShowProfileMenu,
  onLogout,
  profileMenuRef,
  chatHistoryList = [],
  activeChatId,
  loadChatThread,
  handleNewCase,
  fetchChatHistory
}) {
  // Grab current authenticated username and initials dynamically
  const userName = localStorage.getItem('userName') || 'Ashutosh Jaiswal';
  const userInitials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Avoid triggering loading the chat thread
    if (confirm('Permanently purge this litigation case context?')) {
      try {
        await ChatService.deleteChat(chatId);
        if (activeChatId === chatId) {
          handleNewCase();
        }
        if (fetchChatHistory) fetchChatHistory();
      } catch (err) {
        console.error('Delete chat failed:', err);
        alert('Failed to delete: ' + (err.message || err));
      }
    }
  };
  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/75 z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Left Sidebar Layout */}
      <aside className={`
        fixed md:sticky inset-y-0 md:top-0 left-0 z-50 w-64 bg-[#000000] shrink-0 border-r border-[#2f2f2f]/30
        transition-transform duration-300 ease-in-out flex flex-col h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 ${isSidebarOpen ? 'md:flex' : 'md:hidden'}
      `}>
        <div className="p-4 flex flex-col h-full justify-between">
          
          {/* Top Sections */}
          <div className="flex flex-col flex-grow">
            
            {/* Header: AI ADVOCATE & Collapse Button */}
            <div className="flex items-center justify-between pb-4 shrink-0">
              <div className="flex items-center gap-2">
                {/* Brand Green Gavel Square */}
                <div className="w-6 h-6 rounded bg-[#00FF00] text-black flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm font-black">gavel</span>
                </div>
                <span className="text-white text-sm font-bold tracking-wider uppercase select-none">
                  AI Advocate
                </span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-[#181818] rounded transition-colors text-zinc-400 hover:text-white cursor-pointer"
                title="Collapse sidebar"
              >
                <span className="material-symbols-outlined text-sm font-bold">keyboard_double_arrow_left</span>
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-1 mb-6 shrink-0">
              <button 
                onClick={handleNewCase}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs hover:bg-[#181818] rounded-lg transition-colors cursor-pointer text-left text-white/90 font-medium"
              >
                <span className="material-symbols-outlined text-base">add</span>
                New Case
              </button>
              <button 
                onClick={() => alert('Search Jurisprudence feature is fully integrated with vector indices.')}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs hover:bg-[#181818] rounded-lg transition-colors cursor-pointer text-left text-zinc-400 hover:text-white font-medium"
              >
                <span className="material-symbols-outlined text-base">search</span>
                Search Jurisprudence
              </button>
            </div>

            {/* Legal AI Models Section */}
            <div className="mb-6 shrink-0">
              <div className="px-3 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Legal AI Models
              </div>
              <div className="space-y-1">
                {/* Ross Mode (Active) */}
                <div className="w-full flex items-center gap-3 px-3 py-2 text-xs bg-[#181818] border border-[#00FF00]/25 rounded-lg text-white font-bold shadow-sm select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] shadow-[0_0_6px_#00FF00] shrink-0" />
                  <span>Ross Mode</span>
                </div>
                {/* Detective Mode (Inactive) */}
                <div 
                  onClick={() => alert('Detective Mode is locked for standard subscription.')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs hover:bg-[#121212] rounded-lg text-zinc-500 hover:text-zinc-300 font-medium cursor-pointer transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full border border-zinc-600 shrink-0" />
                  <span>Detective Mode</span>
                </div>
              </div>
            </div>

            {/* Recent Filings Section */}
            <div className="flex-grow overflow-y-auto min-h-0 pr-1">
              <div className="px-3 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Recent Filings
              </div>
              <div className="space-y-1">
                {chatHistoryList.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-zinc-500 font-medium select-none">
                    No active case filings.
                  </div>
                ) : (
                  chatHistoryList.map((chat) => (
                    <div 
                      key={chat._id}
                      onClick={() => loadChatThread(chat._id)}
                      className={`group px-3 py-2 text-xs transition-colors rounded-lg flex items-center justify-between cursor-pointer font-medium ${
                        activeChatId === chat._id 
                          ? 'bg-[#181818] text-white font-bold' 
                          : 'text-zinc-400 hover:bg-[#121212] hover:text-white'
                      }`}
                    >
                      <span className="truncate max-w-[80%]">{chat.name}</span>
                      <button 
                        onClick={(e) => handleDeleteChat(e, chat._id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-0.5 rounded cursor-pointer transition-opacity"
                        title="Purge case filing"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Bottom Profile Badge */}
          <div className="pt-4 border-t border-[#2f2f2f]/30 shrink-0 relative" ref={profileMenuRef}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-between p-1.5 hover:bg-[#181818] rounded-lg cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                {/* Circular Green User Avatar with AJ */}
                <div className="w-8 h-8 rounded bg-[#00FF00] text-black font-black text-xs flex items-center justify-center shrink-0">
                  {userInitials}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{userName}</div>
                  <div className="text-[10px] text-zinc-500 font-semibold truncate">
                    Senior Associate
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-sm text-zinc-500 hover:text-white transition-colors shrink-0">settings</span>
            </div>

            {/* Profile Context Dropdown Overlay Menu */}
            {showProfileMenu && (
              <div className="absolute bottom-16 left-0 right-0 bg-[#0d0d0d] border border-[#2f2f2f]/50 rounded-lg shadow-2xl py-1.5 z-[9999] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert('Configuration Settings:\nAccount: Ashutosh Jaiswal\nRole: Senior Associate\nSystem: Online');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-[#181818] transition-colors cursor-pointer text-[#ececec]"
                >
                  <span className="material-symbols-outlined text-sm opacity-85">settings</span>
                  Settings
                </button>
                <div className="h-[1px] bg-[#2f2f2f] my-1"></div>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-red-950/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-sm">power_settings_new</span>
                  Log out
                </button>
              </div>
            )}
          </div>

        </div>
      </aside>
    </>
  );
}
