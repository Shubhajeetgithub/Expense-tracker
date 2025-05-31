import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Define the shape of a category
interface Category {
  id: number;
  name: string;
  color: string;
}

// Define the context type
interface CategoryContextType {
  categories: Category[];
  addCategory: (name: string, color: string) => void;
}

// Create the context with a default value (can be null initially and checked in consumer)
export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// Props type for the provider
interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const storedCategories = localStorage.getItem('expenseTrackerCategories');
    return storedCategories ? JSON.parse(storedCategories) : [];
  });

  useEffect(() => {
    localStorage.setItem('expenseTrackerCategories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name: string, color: string) => {
    setCategories([...categories, { id: Date.now(), name, color }]);
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
