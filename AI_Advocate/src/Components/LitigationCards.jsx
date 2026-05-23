import React from 'react';

export default function LitigationCards({ handleCardClick }) {
  const cards = [
    {
      title: 'Analyze Contract Risk',
      description: 'Upload an NDA or SLA to identify high-risk clauses.',
      prompt: 'Analyze standard contract risk markers inside my non-disclosure agreement.'
    },
    {
      title: 'Draft Legal Memo',
      description: 'Generate a summary of recent state-level rulings.',
      prompt: 'Draft a short legal memorandum outlining recent developments under California Section 16600.'
    },
    {
      title: 'Case Law Citation',
      description: 'Find precedents for intellectual property disputes.',
      prompt: 'Find major precedential cases and citations for software intellectual property and API copyright disputes.'
    },
    {
      title: 'Regulatory Check',
      description: 'Verify compliance with new data privacy acts.',
      prompt: 'Conduct a regulatory compliance check under the CCPA requirements for software companies.'
    }
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center text-center pb-12 select-none">
      
      {/* Main Title Banner */}
      <h1 className="text-xl md:text-2.5xl text-white font-semibold mb-8 max-w-xl leading-normal tracking-tight">
        How can I assist your litigation today?
      </h1>

      {/* 2x2 litigation feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
        {cards.map((card) => (
          <div 
            key={card.title}
            onClick={() => handleCardClick(card.prompt)}
            className="p-4 bg-[#0d0d0d] border border-zinc-800/80 rounded-xl hover:border-zinc-700 hover:bg-[#121212] transition-all cursor-pointer text-left select-none group"
          >
            <div className="text-white text-xs font-bold mb-1.5 group-hover:text-[#00FF00] transition-colors">
              {card.title}
            </div>
            <div className="text-zinc-400 text-[11px] leading-relaxed">
              {card.description}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
