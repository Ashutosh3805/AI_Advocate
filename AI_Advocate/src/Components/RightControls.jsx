import React from 'react';

export default function RightControls({ setMessages }) {
  return (
    <aside className="w-12 bg-[#000000] border-l border-[#2f2f2f]/30 flex flex-col items-center py-4 justify-between h-full shrink-0 select-none hidden md:flex">
      <div className="flex flex-col gap-4 items-center">
        <button 
          className="p-2 hover:bg-[#181818] rounded-lg transition-colors text-zinc-400 hover:text-white cursor-pointer" 
          title="Search history"
        >
          <span className="material-symbols-outlined text-lg">history</span>
        </button>
        <button 
          className="p-2 hover:bg-[#181818] rounded-lg transition-colors text-zinc-400 hover:text-white cursor-pointer" 
          title="Delete conversation" 
          onClick={() => setMessages([])}
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
      <button 
        className="p-2 hover:bg-[#181818] rounded-lg transition-colors text-zinc-400 hover:text-white cursor-pointer" 
        title="Technical information"
      >
        <span className="material-symbols-outlined text-lg">info</span>
      </button>
    </aside>
  );
}
