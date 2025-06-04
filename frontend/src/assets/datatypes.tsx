// import React from "react";
export interface Category {
    id: number;
    name: string;
    color: string;
}
export interface Transaction {
    id: number;
    name: string;
    category: Category;
    amount: number;
    isDebit: boolean;
    isRecurring: boolean;
    date: string;
}