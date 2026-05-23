import React, { useRef } from 'react';

export default function InputBox({ 
  inputText, 
  setInputText, 
  textareaRef, 
  handleInputChange, 
  handleSend,
  onFileUpload
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    // Reset file input value to allow uploading same file again
    e.target.value = '';
  };
  return (
    <div className="px-4 md:px-6 pb-4 pt-2 shrink-0 bg-[#000000]">
      <div className="max-w-3xl mx-auto">
        
        <form 
          onSubmit={handleSend}
          className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-3 flex flex-col gap-2 relative shadow-lg focus-within:border-zinc-700 transition-all duration-200"
        >
          {/* Text message field */}
          <textarea 
            ref={textareaRef}
            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[#ececec] placeholder-zinc-500 text-xs md:text-sm py-1 resize-none h-[40px] max-h-48 scrollbar-none" 
            placeholder="Search statutes, draft motions, or ask legal questions..."
            rows={1}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          {/* Tools row (Left items: attachment, mic, secure mode. Right items: white send button) */}
          <div className="flex justify-between items-center mt-1 pt-1 border-t border-zinc-900/60 shrink-0">
            <div className="flex items-center gap-3">
              
              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept=".pdf" 
              />

              {/* Attachment paperclip */}
              <button 
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="p-1 hover:bg-[#181818] rounded-md text-zinc-500 hover:text-white transition-colors cursor-pointer"
                title="Secure upload legal PDF (.pdf)"
              >
                <span className="material-symbols-outlined text-lg">attachment</span>
              </button>

              {/* Voice input */}
              <button 
                type="button"
                onClick={() => alert('Microphone stream initialized.')}
                className="p-1 hover:bg-[#181818] rounded-md text-zinc-500 hover:text-white transition-colors cursor-pointer"
                title="Voice search"
              >
                <span className="material-symbols-outlined text-lg">mic</span>
              </button>

              {/* Secure Mode Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0d0d0d] border border-zinc-800/60 rounded-full text-[10px] text-[#00FF00] font-semibold select-none shadow-sm cursor-help" title="Encrypted Litigation Channel">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] shadow-[0_0_6px_#00FF00] shrink-0" />
                Secure Mode
              </div>

            </div>

            {/* White send square with stylized Arrow */}
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                inputText.trim() 
                  ? 'bg-white text-black hover:bg-[#ececec] active:scale-95 cursor-pointer font-bold shadow-sm' 
                  : 'bg-zinc-800 text-zinc-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2L4 20L12 16L20 20L12 2Z" />
              </svg>
            </button>
          </div>

        </form>

        {/* Disclaimer text below pill */}
        <p className="mt-2 text-[10px] text-zinc-500 text-center select-none font-medium">
          AI Advocate is an assistant. Cross-verify citations with official court records. Secure tunnel encrypted.
        </p>
      </div>
    </div>
  );
}
