
// app/transactions/page.tsx


// app/transactions/[id]/page.tsx
'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Copy } from 'lucide-react';

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

// This would typically come from an API or database
const getTransaction = (id: string): Transaction | undefined => {
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
  
  return transactions.find(t => t.id === id);
};

export default function TransactionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params?.id as string;
  
  const transaction = getTransaction(transactionId);

  if (!transaction) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Transaction not found</p>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Transaction Details</h1>
        </div>
      </header>

      {/* Transaction Details Card */}
      <main className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md mx-auto">
          {/* Center Icon */}
          

          {/* Transaction Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Date</span>
              <span className="text-gray-900 font-medium text-sm">{transaction.date}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Type</span>
              <span className="text-gray-900 font-medium text-sm">{transaction.transactionType}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Amount</span>
              <span className="text-gray-900 font-semibold text-sm">₦{Math.abs(transaction.amount).toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Fee</span>
              <span className="text-gray-900 font-medium text-sm">₦{transaction.fee}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">ID</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium text-sm">{transaction.id}</span>
                <button
                  onClick={() => copyToClipboard(transaction.id)}
                  className="text-orange-500 hover:text-orange-600 transition-colors"
                  aria-label="Copy ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 text-sm">Status</span>
              <span className={`font-medium text-sm ${
                transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {transaction.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Go Back Button */}
          
        </div>
        <button
            onClick={() => router.back()}
            className="w-full mt-6 py-2 border-1 border-[#3652AD] text-[#3652AD] rounded-full font-medium hover:bg-blue-50 transition-colors"
          >
            Go back
          </button>
      </main>
    </div>
  );
}