import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-background scanline-effect min-h-screen flex flex-col font-body-md select-none">
      {/* Top Navigation Bar */}
      <header className="w-full top-0 sticky bg-background/90 backdrop-blur border-b border-outline-variant/30 z-50">
        <div className="flex justify-between items-center w-full px-6 max-w-[1440px] mx-auto h-16">
          <div 
            onClick={() => navigate('/')} 
            className="font-headline-lg text-2xl font-bold text-primary tracking-tighter cursor-pointer hover:opacity-90"
          >
            AI ADVOCATE
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <Link className="font-body-md text-sm text-primary font-bold border-b-2 border-primary py-1" to="/">
              Home
            </Link>
            <a 
              className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-200" 
              href="#modules"
            >
              Features
            </a>
            <a 
              className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-200" 
              href="#about"
            >
              About
            </a>
          </nav>
          <div className="flex gap-4 items-center">
            <Link 
              to="/login" 
              className="font-label-caps text-xs px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 uppercase"
            >
              Login
            </Link>
            <Link 
              to="/terminal" 
              className="font-label-caps text-xs px-4 py-2 bg-primary-container text-on-primary font-bold hover:shadow-[0_0_15px_rgba(0,255,0,0.4)] active:scale-95 transition-all duration-150 uppercase"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 flex-grow">
        {/* Hero Section */}
        <section className="py-24 md:py-40 flex flex-col items-center text-center relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,0,0.05)_0%,_transparent_70%)]"></div>
          
          <div className="mb-6 flex items-center gap-2 border border-outline-variant/30 px-3 py-1 rounded-full bg-surface-container-low">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
              System Status: Operational
            </span>
          </div>

          <h1 className="font-display-lg text-4xl md:text-7xl lg:text-8xl mb-8 glow-text tracking-tighter text-primary font-extrabold uppercase">
            YOUR AI LEGAL ADVOCATE
          </h1>

          <p className="font-body-md text-base md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-12 terminal-cursor">
            AI-powered legal assistant that helps users understand laws, analyze legal documents, and answer legal queries using RAG.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => navigate('/terminal')} 
              className="px-10 py-4 bg-primary text-on-primary font-bold font-label-caps text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transition-all cursor-pointer border border-primary active:scale-98"
            >
              Initiate Consultation
            </button>
            <a 
              href="#modules"
              className="px-10 py-4 border border-outline-variant/40 text-on-surface font-label-caps text-sm uppercase tracking-wider hover:border-primary hover:text-primary transition-all backdrop-blur-sm active:scale-98 inline-block"
            >
              View Protocols
            </a>
          </div>

          {/* Visual Accent: Data Stream */}
          <div className="mt-20 w-full h-[1px] bg-gradient-to-r from-transparent via-outline-variant to-transparent relative overflow-hidden">
            <div className="absolute top-0 w-32 h-[1px] bg-primary animate-move"></div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section id="modules" className="py-12 pb-24">
          <div className="mb-12">
            <h2 className="font-headline-lg text-3xl text-primary uppercase mb-2">Core Modules</h2>
            <div className="w-20 h-1 bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Feature 1: Upload PDF */}
            <div className="md:col-span-8 group cyber-border bg-surface-container-low p-8 flex flex-col justify-between min-h-[320px] hover:bg-surface-container transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 flex items-center justify-center border border-primary/30 text-primary">
                  <span className="material-symbols-outlined text-2xl">upload_file</span>
                </div>
                <span className="font-label-caps text-xs text-primary/40">MODULE_01</span>
              </div>
              <div>
                <h3 className="font-headline-lg text-2xl text-primary mb-4">Upload Legal PDFs</h3>
                <p className="font-body-md text-sm md:text-base text-on-surface-variant max-w-md">
                  Securely ingest complex legal documentation. Our neural engine parses headers, clauses, and fine print with 99.9% accuracy for instant summarization.
                </p>
              </div>
            </div>

            {/* Feature 2: Case Law */}
            <div className="md:col-span-4 cyber-border bg-surface-container-lowest p-8 flex flex-col justify-between min-h-[320px] hover:border-primary/50 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 flex items-center justify-center border border-primary/30 text-primary">
                  <span className="material-symbols-outlined text-2xl">search</span>
                </div>
                <span className="font-label-caps text-xs text-primary/40">MODULE_02</span>
              </div>
              <div>
                <h3 className="font-headline-lg text-2xl text-primary mb-4">Search Case Law</h3>
                <p className="font-body-md text-sm md:text-base text-on-surface-variant">
                  Instant access to a proprietary vector database of federal and state precedents.
                </p>
              </div>
            </div>

            {/* Feature 3: AI Guidance */}
            <div className="md:col-span-4 cyber-border bg-surface-container-lowest p-8 flex flex-col justify-between min-h-[320px] hover:border-primary/50 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 flex items-center justify-center border border-primary/30 text-primary">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                </div>
                <span className="font-label-caps text-xs text-primary/40">MODULE_03</span>
              </div>
              <div>
                <h3 className="font-headline-lg text-2xl text-primary mb-4">AI Guidance</h3>
                <p className="font-body-md text-sm md:text-base text-on-surface-variant">
                  Predictive analysis and tactical advice based on Retrieval-Augmented Generation.
                </p>
              </div>
            </div>

            {/* Feature 4: High Tech Display */}
            <div className="md:col-span-8 h-[320px] md:h-auto relative overflow-hidden cyber-border">
              <img 
                className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" 
                alt="Cyber Legal Infrastructure Server"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwoWefAGrXqpDbgS0hgXzBo-I9qqoECveMqJIkR066LoRYmJBA4MrHr7I1Q22j0V8Yt_Ejz6h98iynTMAbtY6IJmlWLvoMekkwAB1FKz6Z0lSos-AZ_YcMUqoGCvNIKGixHMz-KswdYLHsdIbsZzcvNsHYE0f30Yi8J1YJiuDmdH-2OUbLYE2WKLVGRslsqRY5RIqDDc94HaHqDOgQL25W3lFU19gxEMcs7Cc00sAc7W1NB8qXkcBW8323lOxDiunYKb6eYzi5WlMy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 z-10">
                <div className="px-3 py-1 bg-primary text-on-primary font-label-caps text-[10px] inline-block mb-2 font-bold uppercase tracking-wider">
                  SECURE ENCLAVE
                </div>
                <p className="font-legal-mono text-xs text-primary font-semibold">ENCRYPTION: AES-256-GCM ACTIVE</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="about" className="py-16 border-y border-outline-variant/30 flex flex-wrap justify-around gap-12 text-center">
          <div>
            <div className="text-4xl font-display-lg font-bold text-primary mb-1">500K+</div>
            <div className="font-label-caps text-xs text-on-surface-variant">CASES ANALYZED</div>
          </div>
          <div>
            <div className="text-4xl font-display-lg font-bold text-primary mb-1">12ms</div>
            <div className="font-label-caps text-xs text-on-surface-variant">QUERY LATENCY</div>
          </div>
          <div>
            <div className="text-4xl font-display-lg font-bold text-primary mb-1">99%</div>
            <div className="font-label-caps text-xs text-on-surface-variant">RAG PRECISION</div>
          </div>
          <div>
            <div className="text-4xl font-display-lg font-bold text-primary mb-1">24/7</div>
            <div className="font-label-caps text-xs text-on-surface-variant">ADVOCATE UPTIME</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-outline-variant/30 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 gap-4 max-w-[1440px] mx-auto">
          <div className="font-legal-mono text-xs text-on-surface-variant text-center md:text-left">
            © 2026 <span className="text-primary font-bold">AI ADVOCATE</span>. ALL RIGHTS RESERVED. SECURE TERMINAL CONNECTION.
          </div>
          <div className="flex gap-6 font-legal-mono text-xs">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Protocol</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Legal Disclaimer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
