import React, { useState, useContext } from 'react';
import { TransactionContext } from './TransactionContext';
import "./AddTransactionModal.css"; 
// Define props type
interface Category {
  id: number, 
  name: string,
  color: string
}
interface AddTransactionModalProps {
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [isDebit, setIsDebit] = useState(true);
  const context = useContext(TransactionContext);

  const storedCategories = JSON.parse(localStorage.getItem('expenseTrackerCategories') || '[]');
  const categories = storedCategories.map((category: Category) => category.name)

  // Handle undefined context
  if (!context) {
    throw new Error('AddTransactionModal must be used within a TransactionProvider');
  }

  const { addTransaction } = context;

  const handleSave = () => {
    if (name.trim()) {
      if (category.trim()) {
        const categoryObj = storedCategories.find((cat: { name: string }) => cat.name.toLowerCase() === category.toLowerCase());
        if (!categoryObj) {
          alert('Category not found. Please add the category first.');
          return;
        }
        addTransaction(name, categoryObj, amount, isDebit);
        onClose();
      } else {
        alert('Category cannot be empty');
      }
    } else {
      alert('Transaction name cannot be empty.');
    }
  };

  return (
    <div className="add-Transaction-modal" style={{textAlign: 'left', marginLeft: '20px'}}>
      <h3>Add New Transaction</h3>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
        <option value="" disabled>Select a category:</option>
        {categories.map((option: string) => (
          <option key={option} value={option}>{option}</option>
        ))}
        </select>
      </div>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>
        <div>
            <label>Type:</label>
            <select value={isDebit ? 'debit' : 'credit'} onChange={(e) => setIsDebit(e.target.value === 'debit')}>
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
            </select>
        </div>
      <button onClick={handleSave} style={{cursor: 'pointer'}}>Save</button>
      <button onClick={onClose} style={{cursor: 'pointer'}}>Cancel</button>
    </div>
  );
};

export default AddTransactionModal;
