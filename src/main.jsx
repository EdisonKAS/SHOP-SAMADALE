import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, History, Users, Wallet, PlusCircle, 
  TrendingUp, RefreshCcw, ArrowRightLeft, Landmark, MessageSquare, Sparkles, X 
} from 'lucide-react';

/**
 * SHOP SAMADALE - Système de Gestion Super Agent & Bureau de Change
 * Correction de l'erreur d'initialisation React-DOM
 */

const apiKey = ""; 

const Dashboard = ({ stats, transactions, onAddClick, aiAnalysis, isAiLoading, exchangeRate }) => (
  <div className="p-10 space-y-10 max-w-7xl mx-auto animate-in fade-in duration-700">
    {/* Analyse IA stratégique */}
    {aiAnalysis && (
      <div className="bg-gradient-to-r from-red-600/10 to-transparent border-l-4 border-red-600 p-8 rounded-r-3xl flex items-start gap-6 shadow-sm">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-red-900/40 text-white font-bold">
          AI
        </div>
        <p className="text-base font-medium leading-relaxed text-gray-200 italic">"{aiAnalysis}"</p>
      </div>
    )}

    {/* Statistiques Globales */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="bg-[#111] p-8 rounded-[2rem] border border-gray-800 hover:border-gray-700 transition-colors group">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform"><Landmark size={24}/></div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Dépôts M-Pesa</p>
        <h3 className="text-3xl font-black text-white mt-2">$ {stats.totalDepots.toLocaleString()}</h3>
      </div>
      
      <div className="bg-[#111] p-8 rounded-[2rem] border border-gray-800 hover:border-gray-700 transition-colors group">
        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform"><TrendingUp size={24}/></div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Commissions Est.</p>
        <h3 className="text-3xl font-black text-red-500 mt-2">$ {stats.totalComm.toLocaleString()}</h3>
      </div>
      
      <div className="bg-[#111] p-8 rounded-[2rem] border border-gray-800 hover:border-gray-700 transition-colors group">
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform"><RefreshCcw size={24}/></div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Volume Change</p>
        <h3 className="text-3xl font-black text-blue-500 mt-2">$ {stats.changeVolume.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
      </div>

      <button 
        onClick={onAddClick} 
        className="bg-red-600 p-8 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-red-700 hover:shadow-2xl hover:shadow-red-900/40 transition-all group text-white border-none"
      >
        <PlusCircle size={40} className="group-hover:rotate-90 transition-transform duration-500"/>
        <span className="font-black text-sm uppercase tracking-widest">Nouvelle Entrée</span>
      </button>
    </div>

    {/* Table des Transactions */}
    <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-white/5">
        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Journal des Opérations</h4>
        <div className="flex gap-3 items-center">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Temps Réel</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-[10px] uppercase text-gray-500 font-black">
            <tr>
              <th className="p-8">Date</th>
              <th className="p-8">Type</th>
              <th className="p-8">Détails</th>
              <th className="p-8">Montant Brut</th>
              <th className="p-8">Résultat Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {transactions.map(t => (
              <tr key={t.id} className="text-sm hover:bg-white/5 transition-colors group">
                <td className="p-8 text-gray-400 font-medium whitespace-nowrap">{t.date}</td>
                <td className="p-8">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border ${t.category === 'AGENT' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                    {t.category === 'AGENT' ? 'M-PESA' : 'CHANGE'}
                  </span>
                </td>
                <td className="p-8 font-black text-gray-200 tracking-tight">{t.type}</td>
                <td className="p-8 font-black text-lg text-white whitespace-nowrap">
                  {t.amount.toLocaleString()} <span className="text-xs text-gray-500 ml-1">{t.currency}</span>
                </td>
                <td className="p-8">
                  {t.category === 'CHANGE' ? (
                    <div className="flex flex-col">
                      <span className="font-black text-blue-400 text-lg">{t.converted?.toLocaleString()} {t.currency === 'USD' ? 'FC' : 'USD'}</span>
                      <span className="text-[10px] text-gray-500 font-black italic">Taux: {t.rate}</span>
                    </div>
                  ) : (
                    <span className="font-black text-red-500 text-lg">+{t.comm?.toLocaleString()} USD</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryType, setEntryType] = useState('AGENT');
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(2850);

  const [transactions, setTransactions] = useState([
    { id: 1, date: "15/04/2026 09:00", category: "AGENT", type: "APPRO", amount: 10000, currency: "USD", comm: 0 },
    { id: 2, date: "15/04/2026 10:15", category: "CHANGE", type: "VENTE", amount: 200, currency: "USD", converted: 570000, rate: 2850 }
  ]);

  const stats = useMemo(() => {
    const totalDepots = transactions
      .filter(t => t.category === 'AGENT' && t.type === 'DEPOT')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalComm = transactions
      .filter(t => t.category === 'AGENT')
      .reduce((acc, t) => acc + (t.comm || 0), 0);
    const changeVolume = transactions
      .filter(t => t.category === 'CHANGE')
      .reduce((acc, t) => acc + (t.currency === 'USD' ? t.amount : t.amount / (t.rate || 2850)), 0);
    return { totalDepots, totalComm, changeVolume };
  }, [transactions]);

  const [newEntry, setNewEntry] = useState({ type: "DEPOT", amount: "", currency: "USD" });

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(newEntry.amount);
    if (!amountNum) return;

    let entry = {
      id: Date.now(),
      date: new Date().toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
      category: entryType,
      type: newEntry.type,
      amount: amountNum,
      currency: newEntry.currency,
    };

    if (entryType === 'CHANGE') {
      entry.rate = exchangeRate;
      entry.converted = newEntry.currency === 'USD' ? amountNum * exchangeRate : amountNum / exchangeRate;
    } else {
      entry.comm = newEntry.type === 'DEPOT' ? amountNum * 0.01 : 0;
    }

    setTransactions(prev => [entry, ...prev]);
    setShowEntryModal(false);
    setNewEntry({ type: "DEPOT", amount: "", currency: "USD" });
  };

  const askAi = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Donne-moi un conseil stratégique pour une agence M-Pesa et bureau de change en RDC. Taux actuel: ${exchangeRate}. Dépôts ce jour: ${stats.totalDepots}$. Volume change: ${stats.changeVolume}$. Sois très bref et direct.` }] }]
        })
      });
      const data = await response.json();
      setAiAnalysis(data.candidates?.[0]?.content?.parts?.[0]?.text || "Conseil indisponible.");
    } catch (e) {
      setAiAnalysis("L'IA est momentanément indisponible.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex font-sans selection:bg-red-500/30">
      {/* Sidebar de navigation */}
      <aside className="w-72 bg-[#0f0f0f] border-r border-gray-800 p-8 hidden lg:flex flex-col">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl text-white">S</div>
          <div>
            <h1 className="font-bold text-xl leading-tight text-white uppercase tracking-tighter">SAMADALE</h1>
            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">Fintech & Change</p>
          </div>
        </div>
        
        <nav className="space-y-3">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:bg-gray-800'}`}>
            <LayoutDashboard size={20}/> <span className="font-bold text-sm">Dashboard</span>
          </button>
        </nav>

        <div className="mt-auto bg-[#1a1a1a] p-5 rounded-3xl border border-gray-800">
          <p className="text-[10px] text-gray-500 font-black uppercase mb-3 text-center">Taux USD/FC</p>
          <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-gray-800">
            <input 
              type="number" 
              className="bg-transparent text-red-500 font-black text-center w-full outline-none text-xl" 
              value={exchangeRate} 
              onChange={(e) => setExchangeRate(Number(e.target.value))}
            />
          </div>
        </div>
      </aside>

      {/* Zone de contenu principale */}
      <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
        <header className="h-24 border-b border-gray-800 flex items-center justify-between px-10 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-20">
          <h2 className="text-xl font-black uppercase text-white tracking-widest">{activeTab}</h2>
          <button 
            onClick={askAi} 
            disabled={isAiLoading} 
            className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 text-xs font-black text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <Sparkles size={16} className={isAiLoading ? "animate-spin text-red-500" : "text-red-500"}/>
            {isAiLoading ? "ANALYSE..." : "CONSEILLER IA"}
          </button>
        </header>

        <Dashboard 
          stats={stats} 
          transactions={transactions} 
          onAddClick={() => setShowEntryModal(true)}
          aiAnalysis={aiAnalysis}
          isAiLoading={isAiLoading}
          exchangeRate={exchangeRate}
        />
      </main>

      {/* Fenêtre modale d'enregistrement */}
      {showEntryModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#0f0f0f] border border-gray-800 w-full max-w-xl rounded-[3rem] p-12 relative shadow-2xl overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[100px] opacity-20 ${entryType === 'AGENT' ? 'bg-red-600' : 'bg-blue-600'}`}></div>

            <button onClick={() => setShowEntryModal(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors z-10"><X size={32}/></button>
            <h3 className="text-2xl font-black mb-8 text-white uppercase tracking-tight">Nouvelle Transaction</h3>
            
            <div className="flex bg-gray-900/50 p-2 rounded-2xl mb-8 border border-gray-800 relative z-10">
              <button onClick={() => setEntryType('AGENT')} className={`flex-1 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all ${entryType === 'AGENT' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-gray-500'}`}>M-PESA</button>
              <button onClick={() => setEntryType('CHANGE')} className={`flex-1 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all ${entryType === 'CHANGE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500'}`}>CHANGE</button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] text-gray-500 font-black ml-2 uppercase">Type</label>
                   <select className="w-full bg-gray-800 p-5 rounded-2xl font-black text-white outline-none border border-gray-700 appearance-none" value={newEntry.type} onChange={e => setNewEntry({...newEntry, type: e.target.value})}>
                    {entryType === 'AGENT' ? (<><option value="DEPOT">DÉPÔT CLIENT</option><option value="RETRAIT">RETRAIT CLIENT</option></>) : (<><option value="ACHAT">ACHAT DEVISE</option><option value="VENTE">VENTE DEVISE</option></>)}
                  </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] text-gray-500 font-black ml-2 uppercase">Devise</label>
                   <select className="w-full bg-gray-800 p-5 rounded-2xl font-black text-white outline-none border border-gray-700 appearance-none" value={newEntry.currency} onChange={e => setNewEntry({...newEntry, currency: e.target.value})}>
                    <option value="USD">USD ($)</option><option value="FC">FC (Francs)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black ml-2 uppercase">Montant Net</label>
                <input type="number" placeholder="0.00" className="w-full bg-gray-800 p-8 rounded-3xl text-4xl font-black text-white outline-none border border-transparent focus:border-white/20 transition-all" value={newEntry.amount} onChange={e => setNewEntry({...newEntry, amount: e.target.value})} required />
              </div>
              <button type="submit" className={`w-full py-6 rounded-3xl font-black uppercase text-white transition-all active:scale-95 shadow-xl ${entryType === 'AGENT' ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'}`}>Confirmer l'opération</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

// Initialisation via le point d'entrée standard
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
