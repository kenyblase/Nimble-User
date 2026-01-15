'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Settings, 
  Home, 
  FileText, 
  MessageSquare, 
  MessageCircle, 
  User,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNav';


// types/transaction.ts
interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  fee: number;
  status: 'completed' | 'pending';
  type: 'debit' | 'credit';
  transactionType: string;
}

const transactions: Transaction[] = [
  {
    id: '1',
    title: 'Payout processed successfully',
    date: '10/05/2026 18:57',
    amount: -40000,
    fee: 100,
    status: 'completed',
    type: 'debit',
    transactionType: 'Payout'
  },
  {
    id: '2',
    title: 'Opeyemi paid for female butterfly...',
    date: '10/05/2024 14:30',
    amount: 50000,
    fee: 100,
    status: 'pending',
    type: 'credit',
    transactionType: 'Payment'
  }
];

export default function TransactionsPage() {
  const router = useRouter();

  const handleTransactionClick = (transactionId: string) => {
    router.push(`/dashboard/transactions/${transactionId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Transactions</h1>
          </div>
          <button 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-900" />
          </button>
        </div>
      </header>

      {/* Transactions List */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              onClick={() => handleTransactionClick(transaction.id)}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'debit' 
                    ? 'bg-red-50' 
                    : 'bg-green-50'
                }`}>
                  {transaction.type === 'debit' ? (
                    <ArrowUpRight className="w-5 h-5 text-red-500" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5 text-green-500" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {transaction.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {transaction.date.split(' ')[0]}
                  </p>
                </div>

                {/* Amount and Status */}
                <div className="flex flex-col items-end gap-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {transaction.amount > 0 ? '+' : ''}₦{Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    transaction.status === 'completed'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      {/* <nav className="bg-white border-t border-gray-200 px-6 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="text-xs">Orders</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">Requests</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Messages</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-blue-600 transition-colors">
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Account</span>
          </button>
        </div>
      </nav> */}
      <BottomNavigation/>
    </div>
  );
}