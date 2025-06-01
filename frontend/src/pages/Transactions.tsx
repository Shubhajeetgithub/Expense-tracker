import React, { useState, useContext } from 'react'
import "./Transactions.css"
import { TransactionContext } from '../components/TransactionContext'
import AddTransactionModal from '../components/AddTransaction'
import TransactionCard from '../components/TransactionCard';


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
        <h1>Transactions</h1>
        <button className="add-transaction-button" onClick={handleAddTransactionClick}>
          + &nbsp; Add Transaction
        </button>
        {isModalOpen && <AddTransactionModal onClose={handleCloseModal} />}
        <div className="transactions-list">
          {transactions.map((transaction: Transaction) => (
          <TransactionCard key={transaction.id} id={transaction.id} name={transaction.name} category={transaction.category} amount={transaction.amount} isDebit={transaction.isDebit} />
        ))}
        </div>
    </div>
  )
}

export default Transactions
