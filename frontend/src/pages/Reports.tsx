// import React from 'react'
import {useState, useEffect} from 'react';
import CanvasPieChart from "../components/CanvasPieChart"
import type { Transaction } from '../assets/datatypes';
// const spendingData = {
//   data: [
//     { label: 'Food', value: 300, color: '#FF6384' },
//     { label: 'Transport', value: 200, color: '#36A2EB' },
//     { label: 'Entertainment', value: 150, color: '#FFCE56' },
//     { label: 'Utilities', value: 100, color: '#4BC0C0' },
//     { label: 'Other', value: 50, color: '#9966FF' }
//   ]
// }
// transactions is of this form : [
//   {id, name, category: {id, name, color}, amount, isDebit, isRecurrring, date}
// ]
function Reports() {
  const [spendingData, setSpendingData] = useState({
    data: [
      { label: 'Food', value: 300, color: '#FF6384' },
      { label: 'Transport', value: 200, color: '#36A2EB' },
      { label: 'Entertainment', value: 150, color: '#FFCE56' },
      { label: 'Utilities', value: 100, color: '#4BC0C0' },
      { label: 'Other', value: 50, color: '#9966FF' }
    ]
  });
  const [incomeData, setIncomeData] = useState({
    data: [
      { label: 'Salary', value: 5000, color: '#FF6384' },
      { label: 'Investments', value: 2000, color: '#36A2EB' },
      { label: 'Freelancing', value: 1500, color: '#FFCE56' },
      { label: 'Other', value: 500, color: '#4BC0C0' }
    ]
  });
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const storedTransactions = localStorage.getItem('expenseTrackerTransactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);
  //choose color as in transactions[i].category.color
  useEffect(() => {
    if (transactions.length > 0) {
      const spendingMap = new Map();
      const incomeMap = new Map();
      transactions.forEach((transaction: Transaction) => {
        const category = transaction.category.name;
        const amount = transaction.amount;
        const color = transaction.category.color || '#000000'; // Default color if not specified
        if (transaction.isDebit) {
          if (spendingMap.has(category)) {
            spendingMap.set(category, {
              value: spendingMap.get(category).value + amount,
              color: spendingMap.get(category).color
            });
          } else {
            spendingMap.set(category, { value: amount, color });
          }
        } else {
          if (incomeMap.has(category)) {
            incomeMap.set(category, {
              value: incomeMap.get(category).value + amount,
              color: incomeMap.get(category).color
            });
          } else {
            incomeMap.set(category, { value: amount, color });
          }
        }
      });
      const spendingData = Array.from(spendingMap.entries()).map(([label, { value, color }]) => ({
        label,
        value,
        color
      }));
      const incomeData = Array.from(incomeMap.entries()).map(([label, { value, color }]) => ({
        label,
        value,
        color
      }));
      setSpendingData({ data: spendingData });
      setIncomeData({ data: incomeData });
    }
  }, [transactions]);

  return (
    <div>
    <h1>Reports</h1>
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
    <div className="expenses">
      <h2 style={{textAlign: 'center'}}>Spending by category</h2>
      <CanvasPieChart data={spendingData.data} width={500} height={300} />
    </div>
    <div className="income">
      <h2 style={{textAlign: 'center'}}>Income by category</h2>
      <CanvasPieChart data={incomeData.data} width={500} height={300} />
    </div>
    </div>
    </div>
  )
}

export default Reports