
import React, { useState } from 'react';
import { findEligibleSchemes } from '../services/geminiService';
import { Scheme, UserProfile } from '../types';
import { translations } from '../translations';

interface Props {
  language: string;
}

const SchemeDiscovery: React.FC<Props> = ({ language }) => {
  const t = translations[language];
  const [query, setQuery] = useState('');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock profile context for discovery
  const mockProfile: UserProfile = { state: 'Punjab', district: 'Ludhiana', gender: 'Male' };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const results = await findEligibleSchemes(query, mockProfile, language);
      setSchemes(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <h2 className="text-4xl font-black tracking-tight">{t.schemesTitle}</h2>
          <p className="text-indigo-100/80 text-lg leading-relaxed">
            AI-powered discovery for central and state welfare benefits. Describe your situation to find matching support.
          </p>
          <div className="flex items-center space-x-4 bg-white/10 border border-white/20 p-2 rounded-[1.5rem] backdrop-blur-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., I am a small farmer looking for loan waivers..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/40 px-6 py-2"
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-white text-indigo-900 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <div key={scheme.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📜</div>
              <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-widest">Official Scheme</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{scheme.name}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">{scheme.description}</p>
            
            <div className="space-y-4 mb-8">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Eligibility</h4>
              <div className="flex flex-wrap gap-2">
                {scheme.eligibility.slice(0, 3).map((e, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">{e}</span>
                ))}
              </div>
            </div>

            <a 
              href={scheme.officialLink} 
              target="_blank" 
              className="w-full flex items-center justify-center space-x-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all"
            >
              <span>View Portal</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        ))}
      </div>

      {!isLoading && schemes.length === 0 && (
        <div className="text-center py-20 opacity-30 grayscale pointer-events-none">
          <div className="text-8xl mb-6">🔍</div>
          <p className="font-black text-slate-400 uppercase tracking-[0.4em]">Ready to discover</p>
        </div>
      )}
    </div>
  );
};

export default SchemeDiscovery;
