import React, { useState, useContext } from 'react';
import "./SearchFilterModal.css"; 
import type { Category, Transaction } from '../assets/datatypes';

interface SearchFilterModalProps {
  onClose: () => void;
  onSave: (filters: {
    startDate: string;
    endDate: string;
    selectedCategories: string[];
  }) => void;
}


const SearchFilterModal: React.FC<SearchFilterModalProps> = ({ onClose, onSave }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const storedCategories = JSON.parse(localStorage.getItem('expenseTrackerCategories') || '[]');
  const categories = storedCategories.map((category: Category) => category.name)


  

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
        prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const handleSave = () => {
    onSave({ startDate, endDate, selectedCategories });
    onClose();
  }


  return (
    <div className="search-filter-modal" style={{textAlign: 'left', marginLeft: '20px'}}>
      <div className="category-filters">
        <p>Filter by category:</p>
        {categories.map((category: string) => (
            <label key={category}>
                <input type="checkbox" value={category} checked={selectedCategories.includes(category)} onChange={() => handleCategoryChange(category)} />
                {category}
            </label>
        ))}
      </div>
      
      <div className="date-filters">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <button onClick={handleSave} style={{cursor: 'pointer'}}>Save</button>
      <button onClick={onClose} style={{cursor: 'pointer'}}>Cancel</button>
    </div>
  );
};

export default SearchFilterModal;
