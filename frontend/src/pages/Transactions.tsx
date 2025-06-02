import React, { useState, useContext } from 'react'
import "./Transactions.css"
import { TransactionContext } from '../components/TransactionContext'
import AddTransactionModal from '../components/AddTransaction'
import TransactionCard from '../components/TransactionCard';
import type { Transaction } from '../assets/datatypes';

const Transactions : React.FC = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    return <div>Error: TransactionContext not available</div>;
  }
  const { transactions } = context;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddTransactionClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <div className="transactions-header">
        <h1>Transactions</h1>
        <div className="search-container">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
          <input type="text" placeholder="Search transactions..." className="search-bar" />
          <svg className="filter-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z"/></svg>
        </div>
      </div>
        <button className="add-transaction-button" onClick={handleAddTransactionClick}>
          + &nbsp; Add Transaction
        </button>
        {isModalOpen && <AddTransactionModal onClose={handleCloseModal} />}
        <div className="transactions-list">
          {transactions.map((transaction: Transaction) => (
          <TransactionCard key={transaction.id} id={transaction.id} name={transaction.name} category={transaction.category} amount={transaction.amount} isDebit={transaction.isDebit} isRecurring={transaction.isRecurring} />
        ))}
        </div>
    </div>
  )
}

export default Transactions
