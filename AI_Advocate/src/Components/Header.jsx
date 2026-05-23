import React from 'react';

export default function Header({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <header className="flex justify-between items-center px-4 h-14 shrink-0 border-b border-[#2f2f2f]/20 bg-[#000000]">
      <div className="flex items-center">
        {/* Sidebar Toggle Trigger */}
        {(!isSidebarOpen || window.innerWidth < 768) && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 hover:bg-[#181818] rounded-lg transition-colors text-zinc-400 hover:text-white cursor-pointer mr-2"
            title="Open sidebar"
          >
            <span className="material-symbols-outlined text-lg">side_navigation</span>
          </button>
        )}
        
        <div className="flex items-center gap-1 cursor-pointer hover:bg-[#181818] px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold text-white">
          <span>Codex Alpha</span>
          <span className="material-symbols-outlined text-xs opacity-60">keyboard_arrow_down</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => alert('Dossier shared successfully!')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-[#0d0d0d] hover:bg-[#181818] transition-colors text-xs font-semibold text-[#ececec] cursor-pointer"
        >
          <span className="material-symbols-outlined text-xs">ios_share</span>
          Share Dossier
        </button>
        <button className="p-1.5 hover:bg-[#181818] rounded-full transition-colors cursor-pointer text-[#ececec]/80">
          <span className="material-symbols-outlined text-base">more_horiz</span>
        </button>
      </div>
    </header>
  );
}
