// Séparation en composants réutilisables
import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import TransactionTable from './components/TransactionTable';
import EntryModal from './components/EntryModal';
import { useTransactionContext } from './context/TransactionContext';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex font-sans">
      <Sidebar />
      <MainContent />
    </div>
  );
}
