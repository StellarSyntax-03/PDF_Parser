import React from 'react';
import { StatementData, Transaction } from '../types';

interface ResultsDisplayProps {
  data: StatementData;
}

const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);


const ResultRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => {
    const formattedValue = typeof value === 'number' ? formatCurrency(value) : value;

    return (
        <div className="flex justify-between items-center py-4 border-b border-slate-200 last:border-b-0">
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="text-base font-semibold text-slate-800 text-right">{formattedValue}</dd>
        </div>
    );
};

const TransactionsTable: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="mt-6 text-center text-slate-500">
                <p>No transactions found in this statement.</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Transactions</h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                        <tr>
                            <th scope="col" className="px-4 py-3">Date</th>
                            <th scope="col" className="px-4 py-3">Description</th>
                            <th scope="col" className="px-4 py-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={index} className="bg-white border-b last:border-b-0 hover:bg-slate-50">
                                <td className="px-4 py-3 whitespace-nowrap">{tx.date}</td>
                                <td className="px-4 py-3 font-medium text-slate-900">{tx.description}</td>
                                <td className="px-4 py-3 text-right font-mono whitespace-nowrap">{formatCurrency(tx.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">Extraction Complete</h2>
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
        <p className="text-sm text-green-800">Successfully parsed your statement.</p>
      </div>
      <dl>
        <ResultRow label="Card Issuer" value={data.issuerName} />
        <ResultRow label="Card Variant" value={data.cardVariant} />
        <ResultRow label="Card Number" value={`**** **** **** ${data.cardLast4}`} />
        <ResultRow label="Billing Cycle" value={data.billingCycle} />
        <ResultRow label="Payment Due Date" value={data.dueDate} />
        <ResultRow label="Total Balance" value={data.totalBalance} />
      </dl>
      <TransactionsTable transactions={data.transactions} />
    </div>
  );
};
