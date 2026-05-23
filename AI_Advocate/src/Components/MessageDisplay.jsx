import React from 'react';

export default function MessageDisplay({ messages, isTyping, chatEndRef, copiedId, handleCopy }) {
  return (
    <div className="flex-grow overflow-y-auto scroll-smooth py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`w-full flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* User Bubble on the Right */}
            {msg.sender === 'user' ? (
              <div className="bg-[#181818] text-white px-5 py-3 rounded-2xl max-w-[70%] text-xs md:text-sm select-text whitespace-pre-wrap font-normal leading-relaxed break-words shadow-sm border border-zinc-800/50">
                {msg.text}
              </div>
            ) : (
              /* AI Legal response (Plain Text on the Left) */
              <div className="w-full flex flex-col items-start bg-[#0d0d0d] p-5 border border-zinc-850 rounded-2xl">
                <div className="text-[#ececec] text-xs md:text-sm leading-relaxed whitespace-pre-wrap select-text font-normal max-w-full break-words">
                  {msg.text}
                </div>
                
                {/* Response actions toolbar */}
                <div className="flex items-center gap-3 pt-4 text-[#ececec]/60">
                  {[
                    { icon: 'content_copy', id: 'copy', text: 'Copy text' },
                    { icon: 'ios_share', id: 'share', text: 'Share response' },
                    { icon: 'refresh', id: 'refresh', text: 'Regenerate' },
                    { icon: 'more_horiz', id: 'more', text: 'More options' }
                  ].map((action) => (
                    <button 
                      key={action.id}
                      onClick={() => {
                        if (action.id === 'copy') {
                          handleCopy(msg.text, msg.id);
                        } else {
                          alert(`${action.text} initialized.`);
                        }
                      }}
                      className="p-1 hover:bg-[#181818] rounded transition-colors text-zinc-500 hover:text-white cursor-pointer"
                      title={action.text}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copiedId === msg.id && action.id === 'copy' ? 'done' : action.icon}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Streaming loading cursor widget */}
        {isTyping && (
          <div className="flex flex-col items-start w-full">
            <div className="pt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#00FF00] opacity-80 animate-pulse rounded-full shadow-[0_0_6px_#00FF00]"></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
