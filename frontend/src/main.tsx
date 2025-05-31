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


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path='' element={<Dashboard />} />
      <Route path='transactions' element={<Transactions />} />
      <Route path='reports' element={<Reports />} />
      <Route path='categories' element={
        <CategoryProvider>
        <Categories />
        </CategoryProvider>
        } />
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
