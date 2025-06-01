import React, { useState, useContext } from 'react';
import './Categories.css';
import { CategoryContext } from '../components/CategoryContext';
import AddCategoryModal from '../components/AddCategory';
import CategoryCard from '../components/CategoryCard';
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

      <div className='categories-list'>
        {categories.map((category: Category) => (
          <CategoryCard title= {category.name} color = {category.color} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
