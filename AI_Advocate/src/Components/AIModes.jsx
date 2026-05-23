import React from 'react';

export default function AIModes({ activeMode = 'ross', onModeChange }) {
  const modes = [
    {
      id: 'ross',
      name: 'Ross Mode',
      description: 'Advanced contract and litigation analysis',
      active: true,
      locked: false
    },
    {
      id: 'detective',
      name: 'Detective Mode',
      description: 'Deep case law research and precedent finding',
      active: false,
      locked: true
    }
  ];

  return (
    <div className="mb-6 shrink-0">
      <div className="px-3 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        Legal AI Models
      </div>
      <div className="space-y-1">
        {modes.map((mode) => (
          <div 
            key={mode.id}
            onClick={() => {
              if (mode.locked) {
                alert(`${mode.name} is locked for standard subscription.`);
              } else if (onModeChange) {
                onModeChange(mode.id);
              }
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors ${
              activeMode === mode.id && mode.active
                ? 'bg-[#181818] border border-[#00FF00]/25 text-white font-bold shadow-sm'
                : 'hover:bg-[#121212] text-zinc-500 hover:text-zinc-300 font-medium'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              activeMode === mode.id && mode.active 
                ? 'bg-[#00FF00] shadow-[0_0_6px_#00FF00]' 
                : 'border border-zinc-600'
            }`} />
            <span>{mode.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
