import React from 'react';

export default function ChatHistory({ 
  recentItems = [], 
  activeRecent = '', 
  onSelectRecent = () => {} 
}) {
  const defaultItems = [
    { id: 1, name: 'Liability analysis v1.2' },
    { id: 2, name: 'NDA Clause Refinement' }
  ];

  const items = recentItems.length > 0 ? recentItems : defaultItems;

  return (
    <div className="flex-grow overflow-y-auto min-h-0 pr-1">
      <div className="px-3 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        Recent Filings
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <div 
            key={item.id || item.name}
            onClick={() => onSelectRecent(item)}
            className={`px-3 py-2 text-xs transition-colors rounded-lg flex items-center justify-between cursor-pointer font-medium ${
              activeRecent === item.name || activeRecent === item.id
                ? 'bg-[#181818] text-white font-bold' 
                : 'text-zinc-400 hover:bg-[#121212] hover:text-white'
            }`}
          >
            <span className="truncate">{item.name}</span>
            <span className="material-symbols-outlined text-xs opacity-50 hover:opacity-100 transition-opacity">
              close
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
