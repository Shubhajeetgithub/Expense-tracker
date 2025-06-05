import React, { useState, useEffect } from 'react'
import "./Dashboard.css"
import Card from './../components/Card'
import { useNavigate } from 'react-router-dom'
import type { Transaction} from '../assets/datatypes'


function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const username = localStorage.getItem('username') || "";
  const [greeting, setGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) setGreeting("Good Morning");
    else if (hours >= 12 && hours < 17) setGreeting("Good Afternoon");
    else if (hours >= 17 && hours < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");
    const storedTransactions = localStorage.getItem('expenseTrackerTransactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);
  function calculateIncome() {
    try {
      return transactions
      .filter(transaction => !transaction.isDebit)
      .reduce((total, transaction) => total + transaction.amount, 0);
    } catch (error) {
      return 0;
    }
  }
  function calculateExpenses() {
    try { 
      return transactions
      .filter(transaction => transaction.isDebit)
      .reduce((total, transaction) => total + transaction.amount, 0);
    } catch (error) {
      return 0;
    }
  }
  //calculate percentage change in income from last week
  function calculateChangesOverWeek() {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // This week: from 7 days ago to today
    const thisWeekStart = new Date(todayStart);
    thisWeekStart.setDate(thisWeekStart.getDate() - 6); // 7 days including today
    
    // Last week: from 14 days ago to 7 days ago
    const lastWeekStart = new Date(todayStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 13); // 14 days ago
    const lastWeekEnd = new Date(todayStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 7); // 7 days ago
    
    // Filter transactions for last week (14 days ago to 7 days ago)
    const lastWeekTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= lastWeekStart && transactionDate < lastWeekEnd;
    });
    
    const lastWeekIncome = lastWeekTransactions
      .filter(transaction => !transaction.isDebit)
      .reduce((total, transaction) => total + transaction.amount, 0);
    const lastWeekExpenses = lastWeekTransactions
      .filter(transaction => transaction.isDebit)
      .reduce((total, transaction) => total + transaction.amount, 0);
    const lastWeekTotal = lastWeekIncome - lastWeekExpenses;
    
    // Filter transactions for this week (7 days ago to today)
    const thisWeekTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= thisWeekStart && transactionDate <= todayStart;
    });
    
    const thisWeekIncome = thisWeekTransactions
      .filter(transaction => !transaction.isDebit)
      .reduce((total, transaction) => total + transaction.amount, 0);
    const thisWeekExpenses = thisWeekTransactions
      .filter(transaction => transaction.isDebit)
      .reduce((total, transaction) => total + transaction.amount, 0);
    const thisWeekTotal = thisWeekIncome - thisWeekExpenses;
    let income = 0;
    let expenses = 0;
    let total = 0;
    try {
      income = ((thisWeekIncome - lastWeekIncome) / lastWeekIncome) * 100;
    } catch (error) {
      income = (thisWeekIncome > 0) ? 100 : 0;
    }
    try {
      expenses = ((thisWeekExpenses - lastWeekExpenses) / lastWeekExpenses) * 100;
    } catch (error) {
      expenses = (thisWeekExpenses > 0) ? 100 : 0;
    }
    try {
      total = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
    } catch (error) {
      total = (thisWeekTotal > 0) ? 100 : 0;
    }
    
    
    return {
      income: income,
      expenses: expenses,
      total: total
    };
  }
  

  interface HandleLogOutEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> {}

  const handleLogOut = (e: HandleLogOutEvent): void => {
    e.preventDefault();
    setIsLoading(true);
    fetch('http://localhost:8000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({fullName: localStorage.getItem('username'), email: localStorage.getItem('email'), transactions_string: localStorage.getItem('expenseTrackerTransactions')})
    }).then((res) => {
        if (res.ok) {
          localStorage.clear();
          alert('Details saved');
          navigate('/login');
        }
        else alert('Something went wrong')
    }).catch((err) => alert(err))
    .finally(() => setIsLoading(false));
  }
  return (
    <div>
    <div className="wrapper">
    <header className="dashboard-header"> {greeting} {username.split(" ")[0]}!! </header>
    <button className="logout" onClick={handleLogOut} disabled={isLoading}>{isLoading ? 'Logging out...' : 'Log out'}</button>
    </div>
      <div className="summary">
      <Card 
      title="Total Balance" 
      icon = {<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M531-260h96v-3L462-438l1-3h10q54 0 89.5-33t43.5-77h40v-47h-41q-3-15-10.5-28.5T576-653h70v-47H314v57h156q26 0 42.5 13t22.5 32H314v47h222q-6 20-23 34.5T467-502H367v64l164 178ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>} 
      amount = {(calculateIncome() - calculateExpenses()).toFixed(2)}
      sidenote={`${calculateChangesOverWeek().total.toFixed(2)}% from last week`}
      color='#cccccc'
      />
      <Card 
      title="Income" 
      icon = {<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M531-260h96v-3L462-438l1-3h10q54 0 89.5-33t43.5-77h40v-47h-41q-3-15-10.5-28.5T576-653h70v-47H314v57h156q26 0 42.5 13t22.5 32H314v47h222q-6 20-23 34.5T467-502H367v64l164 178ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>} 
      amount = {calculateIncome().toFixed(2)}
      sidenote={`${calculateChangesOverWeek().income.toFixed(2)}% from last week`}
      color='#4CAF50'
      />
      <Card 
      title="Expenses" 
      icon = {<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M531-260h96v-3L462-438l1-3h10q54 0 89.5-33t43.5-77h40v-47h-41q-3-15-10.5-28.5T576-653h70v-47H314v57h156q26 0 42.5 13t22.5 32H314v47h222q-6 20-23 34.5T467-502H367v64l164 178ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>} 
      amount = {calculateExpenses().toFixed(2)}
      sidenote={`${calculateChangesOverWeek().expenses.toFixed(2)}% from last week`}
      color='#ff595e'
      />
      </div>
    </div>
  )
}

export default Dashboard
