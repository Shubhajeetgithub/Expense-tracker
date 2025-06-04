import React, { useState, useContext, useEffect} from 'react';
import './Categories.css';
import { CategoryContext } from '../components/CategoryContext';
import AddCategoryModal from '../components/AddCategory';
import CategoryCard from '../components/CategoryCard';
import type { Transaction, Category } from '../assets/datatypes';

const Categories: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    const storedTransactions = localStorage.getItem('expenseTrackerTransactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);
  const context = useContext(CategoryContext);
  // function calculateTransactionsByCategory(category: Category) {
  //   return transactions
  //     .filter(transaction => transaction.category.id === category.id)
  //     .reduce((total, transaction) => total + (transaction.isDebit ? -transaction.amount : transaction.amount), 0);
  // }
  function calculateTransactionCountByCategory(category: Category) {
    return transactions.filter(transaction => transaction.category.name === category.name).length;
  }

  // Handle missing provider
  if (!context) {
    throw new Error('Categories must be used within a CategoryProvider');
  }

  const { categories } = context;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategoryClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='categories-container'>
      <header className="categories-header">
        <h1>Categories</h1>
        <button className="add-category-button" onClick={handleAddCategoryClick}>
          + &nbsp; Add Category
        </button>
      </header>

      {isModalOpen && <AddCategoryModal onClose={handleCloseModal} />}

      <div className='categories-list'>
        {categories.map((category: Category) => (
          <CategoryCard key={category.id} title= {category.name} color = {category.color} id = {category.id} transaction_cnt={calculateTransactionCountByCategory(category)}/>
        ))}
      </div>
    </div>
  );
};

export default Categories;
