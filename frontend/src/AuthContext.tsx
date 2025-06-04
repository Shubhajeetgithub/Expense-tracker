import React, { createContext, useContext, useState, useEffect } from 'react';
let counter = 0;
interface TransactionRecord {
    name: string;
    amount: number;
    transactionType: string;
    isRecurring: boolean;
    date: string;
    categoryName: string;
    categoryColor: string;
};
interface TransactionLocalProps {
    id: number,
    name: string,
    category: {
        id: number,
        name: string,
        color: string
    },
    amount: number,
    isDebit: boolean,
    isRecurring: boolean,
    date: string
}
interface AuthContextType {
  accessToken: string | null;
  login: (tokens: { 
    accessToken: string; 
    refreshToken: string; 
    username: string; 
    transactionRecord: Array<TransactionRecord>;
    email: string;
  }) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessTokenState(token);
    setIsLoading(false);
  }, []);

  const login = (tokens: { accessToken: string; refreshToken: string, username: string, transactionRecord: Array<TransactionRecord> , email: string}) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('username', tokens.username);
    localStorage.setItem('email', tokens.email);
    let categoryObj: { [key: string]: { id: number; name: string; color: string } } = {};
    const localStorageTransaction = new Array<TransactionLocalProps>(tokens.transactionRecord.length);
    for (let i = 0; i < tokens.transactionRecord.length; i++) {
        if (!categoryObj[tokens.transactionRecord[i].categoryName]) {
            categoryObj[tokens.transactionRecord[i].categoryName] = {
                id: counter++,
                name: tokens.transactionRecord[i].categoryName,
                color: tokens.transactionRecord[i].categoryColor
            };
        }
        localStorageTransaction[i] = {id: counter++, name: tokens.transactionRecord[i].name, 
            category: {id: counter++, name: tokens.transactionRecord[i].categoryName, color: tokens.transactionRecord[i].categoryColor},
            amount: tokens.transactionRecord[i].amount,
            isDebit: tokens.transactionRecord[i].transactionType === "debit",
            isRecurring: tokens.transactionRecord[i].isRecurring,
            date: tokens.transactionRecord[i].date
        };
    }
    const categories = Object.values(categoryObj).map((cat, index) => ({
        id: index,
        name: cat.name,
        color: cat.color
    }));
    localStorage.setItem('expenseTrackerTransactions', JSON.stringify(localStorageTransaction));
    localStorage.setItem('expenseTrackerCategories', JSON.stringify(categories));
    setAccessTokenState(tokens.accessToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setAccessTokenState(null);
    // Optionally: Call an API endpoint to invalidate the refresh token on the server
    window.location.href = '/login'; // Redirect to login, clearing all app state
  };

  const getAccessToken = () => localStorage.getItem('accessToken');
  const getRefreshToken = () => localStorage.getItem('refreshToken');


  return (
    <AuthContext.Provider value={{ accessToken, login, logout, getAccessToken, getRefreshToken, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};