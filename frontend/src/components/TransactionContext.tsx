import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface Category {
    id: number;
    name: string;
    color: string;
}

interface Transaction {
  id: number;
  name: string;
  category: Category;
  amount: number;
  isDebit: boolean;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (name: string, category: Category, amount: number, isDebit: boolean) => void;
  deleteTransaction: (id: number) => void;
  updateTransaction: (id: number, amount: number) => void;
}


export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Props type for the provider
interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const storedTransactions = localStorage.getItem('expenseTrackerTransactions');
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  });

  useEffect(() => {
    localStorage.setItem('expenseTrackerTransactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (name: string, category: Category, amount: number, isDebit: boolean) => {
    setTransactions([{ id: Date.now(), name, category, amount, isDebit }, ...transactions]);
  };
  const deleteTransaction = (id: number) => {
    setTransactions((prev: Transaction[]) => prev.filter((item: Transaction) => item.id !== id));
  };
  const updateTransaction = (id: number, amount: number) => {
    setTransactions((prev: Transaction[]) =>
      prev.map((item: Transaction) => (item.id === id ? { ...item, amount } : item))
    );
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};
