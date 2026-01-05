
import React, { useState } from 'react';
import { classifyQuery } from '../services/geminiService';
import { Grievance, ClassificationResult } from '../types';
import { translations } from '../translations';

interface Props {
  language: string;
}

const GrievancePortal: React.FC<Props> = ({ language }) => {
  const t = translations[language];
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  
  const [grievances, setGrievances] = useState<Grievance[]>([
    { id: 'GR-1024', subject: 'Potholes on Main Street', description: 'Deep potholes causing damage...', department: 'Public Works', status: 'Open', createdAt: new Date() }
  ]);

  const handleClassify = async () => {
    if (!description.trim()) return;
    setIsLoading(true);
    try {
      const result = await classifyQuery(description, language);
      setClassification(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!classification) return;
    const newGrievance: Grievance = {
      id: `GR-${Math.floor(Math.random() * 9000) + 1000}`,
      subject: subject || 'New Issue',
      description,
      department: classification.department,
      status: 'Open',
      createdAt: new Date(),
      aiClassification: classification
    };
    setGrievances([newGrievance, ...grievances]);
    setSubject('');
    setDescription('');
    setClassification(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-xl space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.reportIssue}</h3>
            <p className="text-sm text-slate-400 font-medium">AI will classify your issue for official routing.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Short Subject</label>
              <input 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief title..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Describe the Issue</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Details of your grievance..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-6 py-5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800 leading-relaxed"
              />
            </div>
            
            {!classification ? (
              <button 
                onClick={handleClassify}
                disabled={isLoading || !description}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                {isLoading ? 'Classifying...' : 'Analyze with AI'}
              </button>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">AI Routing Suggestion</span>
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${classification.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {classification.priority} Priority
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-500 uppercase">Department</p>
                    <p className="text-lg font-black text-slate-900">{classification.department}</p>
                  </div>
                  <p className="text-xs text-indigo-700 leading-relaxed italic">"{classification.urgencyReason}"</p>
                </div>
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                >
                  Confirm & Submit Grievance
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">Active Grievances</h3>
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          {grievances.map((g) => (
            <div key={g.id} className="p-8 border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-none group">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{g.id} • {g.createdAt.toLocaleDateString()}</span>
                  <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{g.subject}</h4>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${g.status === 'Open' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                  {g.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{g.description}</p>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{g.department}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrievancePortal;
