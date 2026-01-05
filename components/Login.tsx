
import React, { useState, useEffect } from 'react';
import { translations } from '../translations';

interface LoginProps {
  onLogin: () => void;
  language: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, language }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'smart' | 'mobile' | 'id'>('smart');
  
  const t = translations[language];

  const handleLoginClick = () => {
    setIsVerifying(true);
    // Simulate a secure handshake with the identity provider
    setTimeout(() => {
      onLogin();
    }, 2400);
  };

  const methods = [
    { id: 'smart', name: 'Smart-ID', icon: '📱' },
    { id: 'mobile', name: 'Mobile-ID', icon: '📶' },
    { id: 'id', name: 'ID-Card', icon: '💳' },
  ];

  // High-quality digital globe image
  const globeImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans relative overflow-hidden bg-[#010409]">
      
      {/* LAYER 1: The Moving Digital Network Globe - MAX VISIBILITY */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-100 mix-blend-screen animate-globe-dynamic"
          style={{ 
            backgroundImage: `url(${globeImage})`,
            width: '140%',
            height: '140%',
            left: '-20%',
            top: '-20%'
          }}
        />
        
        {/* Dynamic Glowing Pulse Layer */}
        <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay animate-pulse-slow" />

        {/* Cinematic Atmospheric Depth Overlays - Tuned to keep the center clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#010409] via-transparent to-[#010409]/40 opacity-80" />
        <div className="absolute inset-0 bg-radial-vignette opacity-40" />
      </div>

      {/* LAYER 2: Subtle Digital Mesh Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.15] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="cyan" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="1.5" fill="cyan" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* LAYER 3: Sentinel Security Scan Line */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_40px_rgba(34,211,238,0.8)] animate-scan-line" />
      </div>

      {/* MAIN CONTENT CARD - High Transparency & Low Blur */}
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white/[0.01] rounded-[3.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] overflow-hidden border border-white/10 relative z-30 backdrop-blur-[12px] animate-card-entrance hover:border-cyan-500/20 transition-all duration-1000">
        
        {/* Branding Sidebar */}
        <div className="p-12 lg:p-20 flex flex-col justify-between text-white relative">
          <div className="absolute inset-0 bg-slate-950/20 z-0" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-5 mb-24 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform duration-500 group cursor-default">
                <svg className="w-9 h-9 text-slate-950 group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <span className="text-4xl font-black tracking-tighter block uppercase leading-none italic animate-micro-reveal">CivicAI</span>
                <span className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.6em] mt-2 block animate-fade-in" style={{ animationDelay: '0.5s' }}>Citizen Empowerment</span>
              </div>
            </div>

            <div className="space-y-10">
              <h1 className="text-5xl lg:text-8xl font-black leading-[0.95] tracking-tighter text-white animate-text-reveal">
                Digital<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-indigo-300">Identity.</span>
              </h1>
              <p className="text-white text-xl leading-relaxed max-w-sm font-medium drop-shadow-md animate-fade-in" style={{ animationDelay: '0.6s' }}>
                The sovereign digital portal for citizens. Secure, interconnected, and automated.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center space-x-3 px-6 py-3 bg-white/10 border border-white/20 rounded-full inline-flex backdrop-blur-md hover:bg-white/20 transition-colors duration-300">
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Neural Identity Verification Active</span>
            </div>
          </div>
        </div>

        {/* Authentication Form - More Transparent */}
        <div className="p-12 lg:p-20 flex flex-col justify-center relative bg-black/40 backdrop-blur-md border-l border-white/5">
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center space-y-16 animate-fade-in-up">
              <div className="relative">
                <svg className="w-32 h-32 -rotate-90">
                  <circle cx="64" cy="64" r="60" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle 
                    cx="64" cy="64" r="60" fill="transparent" 
                    stroke="white" strokeWidth="4" 
                    strokeDasharray="377" 
                    strokeDashoffset="377" 
                    className="animate-handshake-progress"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce-subtle">🔐</div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Syncing</h2>
                <p className="text-white/60 text-xs font-bold tracking-[0.4em] uppercase animate-pulse">Establishing Secure Uplink</p>
              </div>
            </div>
          ) : (
            <div className="space-y-14 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Access</h2>
                <p className="text-white/60 text-[12px] font-black uppercase tracking-[0.4em]">Multi-Protocol Gateway</p>
              </div>

              <div className="grid grid-cols-3 gap-5">
                {methods.map((method, idx) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as any)}
                    style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                    className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all duration-700 group relative overflow-hidden animate-fade-in-up ${
                      selectedMethod === method.id 
                        ? 'bg-white/20 border-white/50 shadow-2xl scale-105 z-10' 
                        : 'bg-white/5 border-white/10 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1'
                    }`}
                  >
                    <span className="text-4xl mb-5 group-hover:scale-110 group-active:scale-95 transition-transform duration-300 relative z-10">{method.icon}</span>
                    <span className={`text-[11px] font-black uppercase tracking-widest relative z-10 ${
                      selectedMethod === method.id ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                    }`}>
                      {method.name}
                    </span>
                    {selectedMethod === method.id && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-transparent animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-10">
                <div className="space-y-4 group animate-fade-in-up" style={{ animationDelay: '1s' }}>
                  <label className="text-[11px] font-black text-white uppercase tracking-[0.5em] ml-2 group-focus-within:text-cyan-400 transition-colors duration-300">Identity Number</label>
                  <input 
                    type="text" 
                    placeholder="CITIZEN ID" 
                    defaultValue="38001010001"
                    className="w-full bg-white/10 border border-white/20 rounded-[2rem] px-10 py-8 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 font-mono text-center tracking-[0.5em] text-3xl placeholder-white/20 shadow-inner group-hover:bg-white/15"
                  />
                </div>
                
                <button
                  onClick={handleLoginClick}
                  className="w-full bg-white text-slate-950 py-8 rounded-[2rem] font-black text-2xl shadow-[0_30px_60px_rgba(255,255,255,0.2)] hover:bg-slate-50 hover:scale-[1.01] hover:shadow-[0_35px_70px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all duration-300 uppercase tracking-[0.4em] animate-fade-in-up"
                  style={{ animationDelay: '1.2s' }}
                >
                  {t.authenticate}
                </button>
              </div>

              <div className="pt-8 flex items-center justify-center space-x-10 text-[12px] font-black text-white/50 uppercase tracking-[0.4em] animate-fade-in" style={{ animationDelay: '1.5s' }}>
                <a href="#" className="hover:text-white transition-colors duration-300 relative group">Help</a>
                <span className="opacity-20">/</span>
                <a href="#" className="hover:text-white transition-colors duration-300 relative group">Terms</a>
                <span className="opacity-20">/</span>
                <a href="#" className="hover:text-white transition-colors duration-300 relative group">Global Encryption Standard</a>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .bg-radial-vignette {
          background: radial-gradient(circle at center, transparent 0%, rgba(1, 4, 9, 0.95) 100%);
        }

        @keyframes globe-dynamic {
          0% { transform: scale(1) translate(0, 0) rotate(0deg); }
          25% { transform: scale(1.05) translate(2%, 1%) rotate(1deg); }
          50% { transform: scale(1.1) translate(3%, 3%) rotate(2deg); }
          75% { transform: scale(1.05) translate(1%, 2%) rotate(1deg); }
          100% { transform: scale(1) translate(0, 0) rotate(0deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes scan-line {
          0% { transform: translateY(-100%); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes card-entrance {
          0% { opacity: 0; transform: scale(0.98) translateY(20px); filter: blur(5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }

        @keyframes text-reveal {
          0% { opacity: 0; transform: translateX(-20px); filter: blur(10px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }

        @keyframes micro-reveal {
          0% { opacity: 0; letter-spacing: 0.5em; }
          100% { opacity: 1; letter-spacing: -0.05em; }
        }

        @keyframes handshake-progress {
          0% { stroke-dashoffset: 377; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-globe-dynamic {
          animation: globe-dynamic 45s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-scan-line {
          animation: scan-line 15s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .animate-card-entrance {
          animation: card-entrance 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-text-reveal {
          animation: text-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animate-micro-reveal {
          animation: micro-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animate-fade-in-down {
          animation: fadeInDown 1s ease-out forwards;
        }

        .animate-handshake-progress {
          animation: handshake-progress 2.4s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeIn 1.2s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-globe-dynamic, .animate-scan-line, .animate-card-entrance, .animate-text-reveal, .animate-fade-in-up {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
