import React, { useState, useContext } from 'react'
import "./Transactions.css"
import { TransactionContext } from '../components/TransactionContext'
import AddTransactionModal from '../components/AddTransaction'
import TransactionCard from '../components/TransactionCard';
import type { Transaction } from '../assets/datatypes';
import SearchFilterModal from '../components/SearchFilterModal';

const Transactions : React.FC = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    return <div>Error: TransactionContext not available</div>;
  }
  const { transactions } = context;
  const [isTModalOpen, setIsTModalOpen] = useState(false);
  const [isSModalOpen, setIsSModalOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [filters, setFilters] = useState<{
    startDate: string;
    endDate: string;
    selectedCategories: string[];
  } | null>(null);
  const handleAddTransactionClick = () => {
    setIsTModalOpen(true);
  };
  const handleAddSearchFilter = () => {
    setIsSModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsTModalOpen(false);
    setIsSModalOpen(false);
  };

  const handleSaveFilters = (newFilters: {
    startDate: string;
    endDate: string;
    selectedCategories: string[];
  }) => {
    setFilters(newFilters);
    setIsSModalOpen(false);
  };

  const handleSaveSearchName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value.toLowerCase());
  };

  function filterTransactions(transactions: Transaction[], filters: {
    startDate: string;
    endDate: string;
    selectedCategories: string[];
  } | null, searchName: string): Transaction[] {
    if (!filters) return transactions;

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);

      const isWithinDateRange = (!filters.startDate || transactionDate >= startDate) &&
                                (!filters.endDate || transactionDate <= endDate);

      const isInSelectedCategories = filters.selectedCategories.length === 0 ||
                                    filters.selectedCategories.includes(transaction.category.name);

      if (searchName === '') return isWithinDateRange && isInSelectedCategories;
      else {
        const regex = new RegExp(searchName);
        return isWithinDateRange && isInSelectedCategories && regex.test(transaction.name.toLowerCase());
      }
    });
  }
  const safeTransactions = transactions || [];
  const filteredTransactions = filterTransactions(safeTransactions, filters, searchName);


  return (
    <div>
      <div className="transactions-header">
        <h1>Transactions</h1>
        <div className="search-container">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
          <input type="text" placeholder="Search transactions..." className="search-bar" value={searchName} onChange={handleSaveSearchName} />
          <svg onClick={handleAddSearchFilter} className="filter-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z"/></svg>
        </div>
      </div>
      {isSModalOpen && <SearchFilterModal onClose={handleCloseModal} onSave={handleSaveFilters} />}
        <button className="add-transaction-button" onClick={handleAddTransactionClick}>
          + &nbsp; Add Transaction
        </button>
        {isTModalOpen && <AddTransactionModal onClose={handleCloseModal} />}
        <div className="transactions-list">
          {filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((transaction: Transaction) => (
          <TransactionCard key={transaction.id} id={transaction.id} name={transaction.name} category={transaction.category} amount={transaction.amount} isDebit={transaction.isDebit} isRecurring={transaction.isRecurring} date={transaction.date} />
        ))}
        </div>
    </div>
  )
}

export default Transactions
