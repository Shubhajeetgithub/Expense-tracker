import { useContext } from 'react'
import "./TransactionCard.css"
import { TransactionContext } from './TransactionContext';
import type { Transaction } from '../assets/datatypes';

function TransactionCard(props: Transaction) {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("CategoryCard must be used within a CategoryProvider");
    }
    const formattedDate = //convert 2025-06-03 to 3 June 2025
        new Date(props.date).toLocaleDateString('en-US', {  
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    const { deleteTransaction } = context;
    function hexToRgba(hex: string, alpha: number) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    let backgroundColor = '';
    try {
        backgroundColor = hexToRgba(props.category.color, 0.1);
    } catch (error) {
        backgroundColor = '#f0f0f0';
    }
  return (
    <div className='transaction-card'>
      <div className="left-box">
        <div className="name">{props.name}</div>
        <div className="date-category">
            <div className="date">{formattedDate}</div>
            <div className="category" style={{color: props.category.color, backgroundColor}}>{props.category.name}</div>
            <div className="recurring"
            style={{
                display: props.isRecurring ? 'block' : 'none'}}>
                Recurring</div>
        </div>
      </div>
      <div
        className="right-box"
        style={{
            color: props.isDebit ? '#ff595e' : '#4CAF50',
        }}
        >
        <div className="signed-amt">
        <span
            className="plus"
            style={{ display: props.isDebit ? 'none' : 'block' }}
        >
            +
        </span>
        <span
            className="minus"
            style={{ display: props.isDebit ? 'block' : 'none' }}
        >
            -
        </span>
        <span className="amount">{String(props.amount)}</span>
        </div>
        <svg 
        id={String(props.id)}
        onClick={(e) => {
        const target = e.target as SVGElement;
        deleteTransaction(Number(target.id));
        }}
        style={{cursor: 'pointer'}}
        xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
      </div>
    </div>
  )
}

export default TransactionCard
