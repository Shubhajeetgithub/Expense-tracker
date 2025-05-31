import React, { useState, useContext } from 'react';
import { CategoryContext } from './CategoryContext';
import "./AddCategoryModal.css"; 
// Define props type
interface AddCategoryModalProps {
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff');
  const context = useContext(CategoryContext);

  // Handle undefined context
  if (!context) {
    throw new Error('AddCategoryModal must be used within a CategoryProvider');
  }

  const { addCategory } = context;

  const handleSave = () => {
    if (name.trim()) {
      addCategory(name, color);
      onClose();
    } else {
      alert('Category name cannot be empty.');
    }
  };

  return (
    <div className="add-category-modal">
      <h3>Add New Category</h3>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Color:</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>
      <button onClick={handleSave} style={{cursor: 'pointer'}}>Save</button>
      <button onClick={onClose} style={{cursor: 'pointer'}}>Cancel</button>
    </div>
  );
};

export default AddCategoryModal;
