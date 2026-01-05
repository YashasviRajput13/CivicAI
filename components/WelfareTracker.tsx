
import React from 'react';
import { WelfareBenefit } from '../types';
import { translations } from '../translations';

interface Props {
  language: string;
}

const WelfareTracker: React.FC<Props> = ({ language }) => {
  const t = translations[language];
  
  const benefits: WelfareBenefit[] = [
    { id: '1', name: 'Universal Pension Scheme', status: 'Active', amount: '₹3,500', lastDisbursement: '01 Oct 2024' },
    { id: '2', name: 'Farmer Income Support (PM-KISAN)', status: 'Active', amount: '₹2,000', lastDisbursement: '15 Sep 2024' },
    { id: '3', name: 'Digital Education Allowance', status: 'Pending', amount: '₹1,500' },
    { id: '4', name: 'Health Insurance Rebate', status: 'Paused', amount: '₹500' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.welfareTitle}</h2>
        <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center space-x-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Real-time DB Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-950 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">Total Benefits (Monthly)</p>
          <p className="text-4xl font-black tracking-tight">₹7,500</p>
          <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full"></div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Active Programs</p>
          <p className="text-4xl font-black text-slate-900 tracking-tight">02</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Next Payout</p>
          <p className="text-4xl font-black text-slate-900 tracking-tight">15 Oct</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Avg. Processing</p>
          <p className="text-4xl font-black text-slate-900 tracking-tight">1.2d</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Welfare Program</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Transfer</th>
              <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {benefits.map((b) => (
              <tr key={b.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-10 py-8 font-black text-slate-900">{b.name}</td>
                <td className="px-10 py-8">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    b.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' :
                    b.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-10 py-8 font-mono font-bold text-slate-700">{b.amount || 'N/A'}</td>
                <td className="px-10 py-8 text-sm text-slate-500 font-medium">{b.lastDisbursement || 'Scheduled'}</td>
                <td className="px-10 py-8 text-right">
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800">History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WelfareTracker;
