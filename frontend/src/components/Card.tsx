import "./Card.css";
import React from "react";

interface CardProps {
    title: string;
    icon: React.ReactNode;
    amount: number | string;
    sidenote: string;
    color: string;
}

export default function Card({ title, icon, amount, sidenote , color}: CardProps) {
    return (
        <div className="card">
            <div className="card-header">
                <h3>{title}</h3>
                <span className="icon">{icon}</span>
            </div>
            <div className="card-body">
                <p style={{ color }} className="amount">₹{amount}</p>
                <p className="sidenote">{sidenote}</p>
            </div>
        </div>
    );
}
