import React, { StrictMode } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './pages/Layout.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Transactions from './pages/Transactions.tsx'
import Reports from './pages/Reports.tsx'
import Categories from './pages/Categories.tsx'
import { CategoryProvider } from './components/CategoryContext.tsx'
import { TransactionProvider } from './components/TransactionContext.tsx'
import Welcome from './pages/Welcome.tsx'
import Register from './pages/Register.tsx'
import Login from './pages/Login.tsx'
import { AuthProvider } from './AuthContext.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Welcome />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
    <Route path="/home" element={<Layout />}>
      <Route path='dashboard' element={<Dashboard />} />
      <Route path='transactions' element={
        <TransactionProvider>
        <Transactions />
        </TransactionProvider>
        } />
      <Route path='reports' element={<Reports />} />
      <Route path='categories' element={
        <CategoryProvider>
        <Categories />
        </CategoryProvider>
        } />
      </Route>
    </Route>
    </>
  )
)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
