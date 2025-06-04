import React, { useState, useContext } from 'react';
import { TransactionContext } from './TransactionContext';
import "./AddTransactionModal.css"; 
import type { Category} from '../assets/datatypes';

interface AddTransactionModalProps {
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [isDebit, setIsDebit] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
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
        addTransaction(name, categoryObj, amount, isDebit, isRecurring, date);
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
        <label>Name:*</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
        <option value="" disabled>Select a category:*</option>
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
        <div>
            <label>Recurring:</label>
            <select value={isRecurring ? 'yes' : 'no'} onChange={(e) => setIsRecurring(e.target.value === 'yes')}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            </select>
        </div>
        <div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      <button onClick={handleSave} style={{cursor: 'pointer'}}>Save</button>
      <button onClick={onClose} style={{cursor: 'pointer'}}>Cancel</button>
    </div>
  );
};

export default AddTransactionModal;
