import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../api/services';

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [animateCard, setAnimateCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setErrorMsg('');
    setAnimateCard(true);
    setTimeout(() => setAnimateCard(false), 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      let res;
      if (isSignUp) {
        res = await AuthService.register(email, password);
      } else {
        res = await AuthService.login(email, password);
      }
      
      if (res.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.name);
        localStorage.setItem('userEmail', res.data.email);
        navigate('/terminal');
      } else {
        setErrorMsg(res.message || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Node connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col terminal-grid select-none overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="w-full top-0 sticky bg-background border-b border-outline-variant/30 z-50">
        <nav className="flex justify-between items-center w-full px-6 max-w-[1440px] mx-auto h-16">
          <div 
            onClick={() => navigate('/')} 
            className="font-headline-lg text-2xl font-bold text-primary cursor-pointer hover:opacity-90 tracking-tighter"
          >
            AI Advocate
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <Link className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-200" to="/">
              Home
            </Link>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="/#modules">
              Features
            </a>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="/#about">
              About
            </a>
            <Link 
              to="/terminal" 
              className="bg-primary-container text-on-primary font-bold px-6 py-2 border border-primary-container active:scale-95 transition-transform text-xs uppercase font-label-caps"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Authentication Canvas */}
      <main className="flex-grow flex items-center justify-center p-6 relative">
        {/* Decorative Blur Backdrops */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Auth Card */}
        <div 
          className={`w-full max-w-md glass-panel border border-outline-variant/40 relative z-10 p-8 md:p-12 transition-transform duration-200 ${
            animateCard ? 'scale-[1.02]' : ''
          }`}
          id="auth-container"
        >
          {/* Card Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="font-headline-lg text-2xl text-primary mb-2 tracking-tight">
                {isSignUp ? 'REGISTER_IDENTITY' : 'ACCESS_TERMINAL'}
              </h1>
              <p className="font-legal-mono text-xs text-on-surface-variant opacity-75">
                SECURE PROTOCOL v4.0.2
              </p>
            </div>
            {/* Terminal Secure Badge */}
            <div className="flex items-center gap-2 px-3 py-1 border border-primary text-primary bg-primary/5">
              <span className="material-symbols-outlined text-sm font-semibold">verified_user</span>
              <span className="font-label-caps text-[10px] font-bold">SECURE</span>
            </div>
          </div>

          {/* Error Message Display Banner */}
          {errorMsg && (
            <div className="mb-6 p-3 border border-red-500/50 bg-red-950/20 text-red-400 font-legal-mono text-xs flex items-center gap-2 rounded animate-shake">
              <span className="material-symbols-outlined text-sm">error</span>
              <span className="uppercase tracking-wider">{errorMsg}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="relative">
              <label className="block font-label-caps text-on-surface-variant mb-2 uppercase tracking-widest text-[10px]">
                Credential: Email
              </label>
              <div 
                className={`flex items-center border-b border-outline-variant/50 focus-within:border-primary transition-colors neon-glow ${
                  focusedField === 'email' ? 'cursor-blink' : ''
                }`}
              >
                <span className="material-symbols-outlined text-on-surface-variant mr-3 text-lg">alternate_email</span>
                <input 
                  className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-primary placeholder:text-on-surface-variant/30 font-legal-mono py-2 text-sm" 
                  placeholder="USER@TERMINAL.NET" 
                  type="email"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block font-label-caps text-on-surface-variant mb-2 uppercase tracking-widest text-[10px]">
                Credential: Key_Phrase
              </label>
              <div 
                className={`flex items-center border-b border-outline-variant/50 focus-within:border-primary transition-colors neon-glow ${
                  focusedField === 'password' ? 'cursor-blink' : ''
                }`}
              >
                <span className="material-symbols-outlined text-on-surface-variant mr-3 text-lg">lock</span>
                <input 
                  className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-primary placeholder:text-on-surface-variant/30 font-legal-mono py-2 text-sm" 
                  placeholder="••••••••" 
                  type="password"
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Action Button */}
            <button 
              className={`w-full py-4 border border-primary text-primary hover:bg-primary hover:text-black font-label-caps text-sm text-center tracking-[0.2em] transition-all duration-300 active:scale-[0.98] shadow-[0_0_15px_rgba(2,230,0,0.1)] font-bold uppercase ${
                loading ? 'opacity-50 cursor-not-allowed bg-primary/10' : 'cursor-pointer'
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'PROCESSING_REQUEST...' : (isSignUp ? 'EXECUTE_REGISTRATION' : 'INITIATE_SESSION')}
            </button>

            {/* Toggle Navigation Button */}
            <div className="text-center">
              <button 
                className="font-legal-mono text-on-surface-variant hover:text-primary transition-colors text-sm cursor-pointer" 
                onClick={handleToggle}
                type="button"
              >
                {isSignUp ? (
                  <>EXISTING_ENTITY? <span className="text-primary font-bold">LOGIN</span></>
                ) : (
                  <>NEW_USER? <span className="text-primary font-bold">SIGN_UP</span></>
                )}
              </button>
            </div>
          </form>

          {/* Metadata Card Footer */}
          <div className="mt-12 flex justify-between items-center opacity-40 font-legal-mono text-[10px] uppercase">
            <span>Node: US-EAST-7729</span>
            <span>Lat: 38.8951° N</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-outline-variant/30 bg-background z-10">
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
