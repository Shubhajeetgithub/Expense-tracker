// import React from 'react'
import "./Welcome.css"
import Card from '../components/Card'
import { NavLink } from 'react-router-dom'
function Welcome() {
  return (
    <div className='welcome-page'>
    <NavLink to="/register" className="nav-link"><button className="register-button">Register/Login</button></NavLink>
    <div className="title">Expense Tracker</div>
    <div className="quote">Your one-stop solution to manage your expenses.</div>
    
    <div className="card-container">
      <Card 
        title="Income" 
        icon = {<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M531-260h96v-3L462-438l1-3h10q54 0 89.5-33t43.5-77h40v-47h-41q-3-15-10.5-28.5T576-653h70v-47H314v57h156q26 0 42.5 13t22.5 32H314v47h222q-6 20-23 34.5T467-502H367v64l164 178ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>} 
        amount = '2700.00'
        sidenote='+4.3% from last month'
        color='#4CAF50'
        />
        <Card 
        title="Expenses" 
        icon = {<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M531-260h96v-3L462-438l1-3h10q54 0 89.5-33t43.5-77h40v-47h-41q-3-15-10.5-28.5T576-653h70v-47H314v57h156q26 0 42.5 13t22.5 32H314v47h222q-6 20-23 34.5T467-502H367v64l164 178ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>} 
        amount = '1534.52'
        sidenote='+0.8% from last month'
        color='#ff595e'
        />
      </div>

    <footer>
        <div className="line1">Made by Shubhajeet Das</div>
        <div className="line2">Sophomore</div>
        <div className="line3">BTech AI @ IIT Kharagpur</div>
    </footer>
    </div>
  )
}

export default Welcome
