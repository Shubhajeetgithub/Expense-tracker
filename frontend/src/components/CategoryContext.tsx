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
  deleteCategory: (id: number) => void;
  updateCategory: (id: number, name: string, color: string) => void;
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
  const deleteCategory = (id: number) => {
    setCategories((prev: Category[]) => prev.filter((item: Category) => item.id !== id));
  };
  const updateCategory = (id: number, name: string, color: string) => {
    setCategories((prev: Category[]) =>
      prev.map((item: Category) => (item.id === id ? { ...item, name, color } : item))
    );
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, deleteCategory, updateCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
