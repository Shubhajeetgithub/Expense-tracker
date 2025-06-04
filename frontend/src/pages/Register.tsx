import React, { useState } from 'react'
import "./Register.css"
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios';
function Register() {
  const [email, setEmail] = useState('');
  const [fullName, setfullName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  interface RegisterFormData {
    email: string;
    fullName: string;
    password: string;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsLoading(true);
    const data: RegisterFormData = { email, fullName, password };
    axios.post('https://expense-tracker-server-nine-vert.vercel.app/register', data)
      .then((result: any) => {
        alert(result.data.message)
        if (result.data.message === "Success") navigate('/login');
    })
      .catch((err: any) => alert(err.response.data.message))
      .finally(() => setIsLoading(false));
  };
  return (
    <form className='register-page' onSubmit={handleSubmit}>
      <div className="register-login">
        <div className="register active">Register</div>
        <NavLink to="/login" className="nav-link"><div className="login">Login</div></NavLink>
      </div>
      <div className="inputs">
      <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
      <input type="text" placeholder='FullName' onChange={(e) => setfullName(e.target.value)} disabled={isLoading}/>
      <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
      <button type="submit" disabled={isLoading}>
      {isLoading ? 'Registering...' : 'Register'}
      </button>
      </div>
    </form>
  )
}

export default Register
