import React, { useContext } from 'react';
import "./CategoryCard.css";
import { CategoryContext } from './CategoryContext';

interface CategoryCardProps {
  id: number,
  title: string,
  color: string,
  transaction_cnt: number
}

function CategoryCard({ id, title, color, transaction_cnt = 0 }: CategoryCardProps) {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error("CategoryCard must be used within a CategoryProvider");
  }

  const { deleteCategory } = context;

  return (
    <div className="category-card">
      <div className="color-box" style={{ background: color }}></div>
      <div className="lower-box">
        <div className="text-box">
          <div className="title">{title}</div>
          <div className="transactions">{transaction_cnt} transactions</div>
        </div>
        <div className="icon-box">
          <svg
            id={String(id)}
            onClick={(e) => {
              const target = e.target as SVGElement;
              deleteCategory(Number(target.id));
            }}
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
          >
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
          </svg>

        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
