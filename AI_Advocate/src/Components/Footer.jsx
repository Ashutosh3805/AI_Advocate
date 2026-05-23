import React from 'react';

export default function Footer({ onSettingsClick, onLogout }) {
  return (
    <div className="px-4 py-3 border-t border-[#2f2f2f]/30 bg-[#000000] shrink-0">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Circular Green User Avatar with AJ */}
          <div className="w-8 h-8 rounded bg-[#00FF00] text-black font-black text-xs flex items-center justify-center shrink-0">
            AJ
          </div>
          <div className="flex flex-col">
            <div className="text-xs font-bold text-white">Ashutosh Jaiswal</div>
            <div className="text-[10px] text-zinc-500 font-semibold">Senior Associate</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onSettingsClick}
            className="p-1.5 hover:bg-[#181818] rounded-lg transition-colors text-zinc-400 hover:text-white cursor-pointer"
            title="Settings"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </button>
          <button 
            onClick={onLogout}
            className="p-1.5 hover:bg-red-950/20 rounded-lg transition-colors text-red-400 hover:text-red-300 cursor-pointer"
            title="Log out"
          >
            <span className="material-symbols-outlined text-lg">power_settings_new</span>
          </button>
        </div>
      </div>
    </div>
  );
}
