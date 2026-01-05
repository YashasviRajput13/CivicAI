
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Message } from '../types';
import { askProfileAssistant, extractProfileFromImage } from '../services/geminiService';
import { translations } from '../translations';

interface Props {
  language: string;
}

const IdentityProfile: React.FC<Props> = ({ language }) => {
  const t = translations[language];
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "Sandeep Kumar",
    dateOfBirth: "12/05/1990",
    gender: "Male",
    state: "Delhi",
    district: "New Delhi",
    aadhaarMasked: "XXXX-XXXX-8841",
    hasDocument: true
  });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to your Identity Vault. I help you securely manage documents and digital ID.\n\nUpload any document for magic digitization!",
      timestamp: new Date()
    }
  ]);

  const [docs, setDocs] = useState([
    { name: 'Passport Copy', type: 'Identity', date: '20 Sep 2024', icon: '🛂' },
    { name: 'Rent Agreement', type: 'Address', date: '15 Aug 2024', icon: '🏠' }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await askProfileAssistant(text, history, language);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response || "...", timestamp: new Date() }]);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const extracted = await extractProfileFromImage(base64);
        setProfile(prev => ({ ...prev, ...extracted, hasDocument: true }));
        setDocs([{ name: file.name, type: 'Digitalized', date: 'Today', icon: '📄' }, ...docs]);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "✨ Digitization complete. I've updated your vault.", timestamp: new Date() }]);
      } catch (err) { console.error(err); } finally { setIsUploading(false); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-160px)]">
      <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Identity Vault</h3>
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Citizen</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner">👤</div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Citizen Name</p>
                <p className="text-lg font-black text-slate-900">{profile.fullName}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">DOB</p>
                <p className="text-sm font-bold text-slate-800">{profile.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                <p className="text-sm font-bold text-slate-800">{profile.state}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digitized Docs</h4>
            <div className="space-y-3">
              {docs.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{d.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">{d.name}</p>
                      <p className="text-[9px] font-bold text-slate-400">{d.date}</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-slate-800 transition-all"
          >
            {isUploading ? 'Digitizing...' : 'Digitize Document'}
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-col bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden h-full">
        <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Vault AI Assistant</h3>
          <div className="flex items-center space-x-1.5 bg-green-50 px-2 py-1 rounded-full border border-green-100">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[9px] font-black text-green-600 uppercase">Secure Connection</span>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm transition-all animate-in slide-in-from-bottom-2 ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-slate-200 bg-slate-50/50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI to retrieve or update details..."
            className="w-full bg-white border border-slate-200 rounded-[1.5rem] px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
          />
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default IdentityProfile;
