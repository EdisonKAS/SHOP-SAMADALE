import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, History, Users, Wallet, PlusCircle, 
  ArrowUpRight, TrendingUp, Search, MessageSquare, 
  Volume2, Sparkles, X, Bell, Package, RefreshCcw, ArrowRightLeft, Landmark
} from 'lucide-react';

// Configuration API (La clé est injectée par l'environnement)
const apiKey = ""; 

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryType, setEntryType] = useState('AGENT'); // 'AGENT' ou 'CHANGE'
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Taux de change par défaut (Exemple: 1 USD = 2800 FC)
  const [exchangeRate, setExchangeRate] = useState(2800);

  // --- ÉTAT DES TRANSACTIONS ---
  const [transactions, setTransactions] = useState([
    { id: 1, date: "14/04/2026 10:00", category: "AGENT", type: "APPRO", amount: 5000, currency: "USD", comm: 0, note: "Admin Initial" },
    { id: 2, date: "14/04/2026 11:30", category: "CHANGE", type: "VENTE", amount: 100, currency: "USD", converted: 280000, rate: 2800, note: "Client Comptant" }
  ]);

  const [newEntry, setNewEntry] = useState({ 
    agent: "", 
    type: "DEPOT", 
    amount: "", 
    currency: "USD",
    rate: 2800
  });

  // --- CALCULS STATISTIQUES ---
  const stats = useMemo(() => {
    const totalDepots = transactions
      .filter(t => t.category === 'AGENT' && t.type === 'DEPOT')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalComm = transactions
      .filter(t => t.category === 'AGENT')
      .reduce((acc, t) => acc + (t.comm || 0), 0);
    
    const changeVolume = transactions
      .filter(t => t.category === 'CHANGE')
      .reduce((acc, t) => acc + (t.currency === 'USD' ? t.amount : t.amount / (t.rate || 2800)), 0);
      
    return { totalDepots, totalComm, changeVolume };
  }, [transactions]);

  // --- GESTION DES OPÉRATIONS ---
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newEntry.amount || isNaN(newEntry.amount)) return;

    const isChange = entryType === 'CHANGE';
    const amountNum = parseFloat(newEntry.amount);
    const rateNum = parseFloat(exchangeRate);
    
    let entry = {
      id: Date.now(),
      date: new Date().toLocaleString('fr-FR'),
      category: entryType,
      type: newEntry.type,
      amount: amountNum,
      currency: newEntry.currency,
      note: newEntry.agent || (isChange ? "Client Change" : "Client Agent")
    };

    if (isChange) {
      entry.rate = rateNum;
      entry.converted = newEntry.currency === 'USD' ? amountNum * rateNum : amountNum / rateNum;
    } else {
      entry.agent = newEntry.agent || "Admin";
      // Simulation commission 1% pour les dépôts (Exemple métier)
      entry.comm = newEntry.type === 'DEPOT' ? amountNum * 0.01 : 0;
    }

    setTransactions(prev => [entry, ...prev]);
    setShowEntryModal(false);
    setNewEntry({ ...newEntry, amount: "", agent: "", type: "DEPOT", currency: "USD" });
  };

  const getAiInsight = async () => {
    setIsAiLoading(true);
    try {
      const prompt = `Analyse pour SHOP SAMADALE (RDC). Taux actuel: ${exchangeRate} FC. Volume M-Pesa: ${stats.totalDepots} USD. Volume Change: ${stats.changeVolume.toFixed(2)} USD. Donne un conseil de gestion financière très court et stratégique.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiAnalysis(text || "Analyse indisponible pour le moment.");
    } catch (err) {
      setAiAnalysis("Impossible de contacter le moteur d'intelligence artificielle.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex font-sans selection:bg-red-500/30">
      {/* Barre Latérale */}
      <aside className="w-72 bg-[#0f0f0f] border-r border-gray-800 p-8 hidden lg:flex flex-col">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-gradient-to-tr from-red-600 to-red-800 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-red-900/20 text-white">S</div>
          <div>
            <h1 className="font-bold text-xl leading-tight tracking-tight text-white">SAMADALE</h1>
            <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em]">Super Agent & Change</p>
          </div>
        </div>
        
        <nav className="space-y-3 flex-1">
          {[
            { id: 'dashboard', label: 'Tableau de Bord', icon: <LayoutDashboard size={20}/> },
            { id: 'change', label: 'Bureau de Change', icon: <RefreshCcw size={20}/> },
            { id: 'journal', label: 'Historique Global', icon: <History size={20}/> },
            { id: 'agents', label: 'Gestion Agents', icon: <Users size={20}/> }
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id)} 
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${activeTab === t.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/30 translate-x-1' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              {t.icon} <span className="font-bold text-sm">{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-[#1a1a1a] border border-gray-800 p-5 rounded-3xl">
          <p className="text-[10px] text-gray-500 font-black uppercase mb-3 tracking-widest text-center text-white/50 text-white/50">Taux de Change Actuel</p>
          <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
            <span className="text-xs font-bold text-gray-400">1 USD =</span>
            <input 
              type="number" 
              className="bg-transparent text-red-500 font-black text-right w-24 outline-none text-lg" 
              value={exchangeRate} 
              onChange={(e) => setExchangeRate(Number(e.target.value))}
            />
            <span className="text-[10px] text-gray-500 ml-1 font-black">FC</span>
          </div>
        </div>
      </aside>

      {/* Zone Principale */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-900/5 via-transparent to-transparent">
        <header className="h-24 border-b border-gray-800 flex items-center justify-between px-10 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-20">
          <div className="flex items-center gap-5">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{activeTab}</h2>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-500 text-[10px] font-black uppercase">Système en ligne</span>
            </div>
          </div>
          <button 
            onClick={getAiInsight} 
            disabled={isAiLoading} 
            className="group bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 text-xs font-black hover:bg-white/10 hover:border-red-500/50 transition-all active:scale-95 disabled:opacity-50 text-white"
          >
            <Sparkles size={16} className={`${isAiLoading ? 'animate-spin' : 'group-hover:rotate-12'} text-red-500 transition-transform`} />
            {isAiLoading ? "ANALYSE..." : "STRATÉGIE IA"}
          </button>
        </header>

        <div className="p-10 space-y-10 max-w-7xl mx-auto">
          {aiAnalysis && (
            <div className="bg-gradient-to-r from-red-600/10 to-transparent border-l-4 border-red-600 p-8 rounded-r-3xl flex items-start gap-6 animate-in fade-in slide-in-from-top-4">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-red-900/40 text-white text-white">
                <MessageSquare size={18} />
              </div>
              <p className="text-base font-medium leading-relaxed text-gray-200 italic">"{aiAnalysis}"</p>
            </div>
          )}

          {/* Cartes de Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#111] p-8 rounded-[2rem] border border-gray-800 hover:border-gray-700 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform"><Landmark size={24}/></div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Dépôts M-Pesa</p>
              <h3 className="text-3xl font-black text-white mt-2">$ {stats.totalDepots.toLocaleString()}</h3>
            </div>
            <div className="bg-[#111] p-8 rounded-[2rem] border border-gray-800 hover:border-gray-700 transition-colors group">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform"><TrendingUp size={24}/></div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Commissions</p>
              <h3 className="text-3xl font-black text-red-500 mt-2">$ {stats.totalComm.toLocaleString()}</h3>
            </div>
            <div className="bg-[#111] p-8 rounded-[2rem] border border-gray-800 hover:border-gray-700 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform"><RefreshCcw size={24}/></div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Flux de Change</p>
              <h3 className="text-3xl font-black text-blue-500 mt-2">$ {stats.changeVolume.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
            </div>
            <button 
              onClick={() => setShowEntryModal(true)} 
              className="bg-red-600 p-8 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-red-700 hover:shadow-2xl hover:shadow-red-900/40 transition-all group text-white text-white"
            >
              <PlusCircle size={40} className="group-hover:rotate-90 transition-transform duration-500"/>
              <span className="font-black text-sm uppercase tracking-widest text-white text-white">Saisie Rapide</span>
            </button>
          </div>

          {/* Tableau des Flux */}
          <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-white/5">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Journal des Flux Financiers</h4>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Synchronisé</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50 text-[10px] uppercase text-gray-500 font-black">
                  <tr>
                    <th className="p-8">Horodatage</th>
                    <th className="p-8">Département</th>
                    <th className="p-8">Opération</th>
                    <th className="p-8">Montant</th>
                    <th className="p-8">Résultat / Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {transactions.map(t => (
                    <tr key={t.id} className="text-sm hover:bg-white/5 transition-colors group">
                      <td className="p-8 text-gray-400 font-medium whitespace-nowrap text-gray-400">{t.date}</td>
                      <td className="p-8">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border ${t.category === 'AGENT' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                          {t.category === 'AGENT' ? 'M-PESA' : 'CHANGE'}
                        </span>
                      </td>
                      <td className="p-8 font-black text-gray-200 tracking-tight text-gray-200">{t.type}</td>
                      <td className="p-8 font-black text-lg text-white text-white">
                        {t.amount.toLocaleString()} <span className="text-xs text-gray-500 ml-1 text-gray-500">{t.currency}</span>
                      </td>
                      <td className="p-8">
                        {t.category === 'CHANGE' ? (
                          <div className="flex flex-col">
                            <span className="font-black text-blue-400 text-lg">{t.converted?.toLocaleString()} {t.currency === 'USD' ? 'FC' : 'USD'}</span>
                            <span className="text-[10px] text-gray-500 font-black">@ {t.rate} FC</span>
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
      </main>

      {/* Fenêtre Modale d'enregistrement */}
      {showEntryModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#0f0f0f] border border-gray-800 w-full max-w-xl rounded-[3rem] p-12 relative shadow-2xl overflow-hidden">
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 ${entryType === 'AGENT' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
            
            <button onClick={() => setShowEntryModal(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors z-10 text-gray-500 hover:text-white">
              <X size={32}/>
            </button>
            
            <h3 className="text-3xl font-black mb-10 flex items-center gap-4 tracking-tighter text-white uppercase text-white">
              {entryType === 'AGENT' ? <Landmark className="text-red-600" size={32}/> : <RefreshCcw className="text-blue-600" size={32}/>}
              Nouvelle Saisie
            </h3>

            <div className="flex bg-gray-900/50 p-2 rounded-2xl mb-10 border border-gray-800 border-gray-800">
              <button 
                onClick={() => setEntryType('AGENT')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all ${entryType === 'AGENT' ? 'bg-red-600 text-white shadow-xl shadow-red-900/20' : 'text-gray-500 hover:text-gray-300 text-gray-500 hover:text-gray-300'}`}
              >
                M-PESA
              </button>
              <button 
                onClick={() => setEntryType('CHANGE')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all ${entryType === 'CHANGE' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-gray-500 hover:text-gray-300 text-gray-500 hover:text-gray-300'}`}
              >
                CHANGE
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-8 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest text-white/40 text-white/40">Type d'opération</label>
                  <select 
                    className="w-full bg-gray-800 border border-gray-700 p-5 rounded-2xl font-black text-sm focus:ring-4 focus:ring-red-600/20 outline-none appearance-none cursor-pointer text-white text-white border-gray-700"
                    value={newEntry.type}
                    onChange={e => setNewEntry({...newEntry, type: e.target.value})}
                  >
                    {entryType === 'AGENT' ? (
                      <>
                        <option value="DEPOT">DÉPÔT CLIENT</option>
                        <option value="RETRAIT">RETRAIT CLIENT</option>
                        <option value="APPRO">APPROVISIONNEMENT</option>
                      </>
                    ) : (
                      <>
                        <option value="ACHAT">ACHAT DEVISE</option>
                        <option value="VENTE">VENTE DEVISE</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest text-white/40 text-white/40">Devise</label>
                  <select 
                    className="w-full bg-gray-800 border border-gray-700 p-5 rounded-2xl font-black text-sm focus:ring-4 focus:ring-red-600/20 outline-none appearance-none cursor-pointer text-white text-white border-gray-700"
                    value={newEntry.currency}
                    onChange={e => setNewEntry({...newEntry, currency: e.target.value})}
                  >
                    <option value="USD">DOLLAR (USD)</option>
                    <option value="FC">FRANC CONGOLAIS (FC)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest text-white/40 text-white/40">Montant</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full bg-gray-800 border border-gray-700 p-8 rounded-3xl text-4xl font-black text-white focus:ring-4 focus:ring-red-600/20 outline-none placeholder:text-gray-700 text-white placeholder:text-gray-700 border-gray-700"
                    value={newEntry.amount}
                    onChange={e => setNewEntry({...newEntry, amount: e.target.value})}
                    required 
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-600 text-gray-600">{newEntry.currency}</span>
                </div>
              </div>

              {entryType === 'CHANGE' && (
                <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-[2rem] flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 text-blue-500">Équivalent calculé</p>
                    <p className="text-3xl font-black text-white text-white">
                      {newEntry.amount ? (newEntry.currency === 'USD' ? (parseFloat(newEntry.amount) * exchangeRate).toLocaleString() : (parseFloat(newEntry.amount) / exchangeRate).toFixed(2)) : 0} 
                      <span className="text-sm ml-2 text-gray-500 text-gray-500">{newEntry.currency === 'USD' ? 'FC' : 'USD'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 text-blue-500">Taux</p>
                    <p className="font-black text-xl text-gray-300 text-gray-300">{exchangeRate} <span className="text-xs">FC</span></p>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-white text-white ${entryType === 'AGENT' ? 'bg-red-600 shadow-red-900/30' : 'bg-blue-600 shadow-blue-900/30'}`}
              >
                Enregistrer l'opération <ArrowRightLeft size={18}/>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
