// import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import './Layout.css'
function Layout() {
  return (
    <div className='layout'>
      <Sidebar />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
