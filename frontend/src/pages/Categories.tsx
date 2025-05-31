import React, { useState, useContext } from 'react';
import './Categories.css';
import { CategoryContext } from '../components/CategoryContext';
import AddCategoryModal from '../components/AddCategory';

interface Category {
  id: number;
  name: string;
  color: string;
}

const Categories: React.FC = () => {
  const context = useContext(CategoryContext);

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

      <ul className='categories-list'>
        {categories.map((category: Category) => (
          <li
            key={category.id}
            style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: category.color,
                marginRight: '10px',
              }}
            ></div>
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
