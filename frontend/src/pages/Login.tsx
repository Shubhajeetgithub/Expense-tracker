import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import "./Login.css"
import { useAuth } from '../AuthContext';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home/dashboard";
  
  interface LoginFormData {
    email: string;
    password: string;
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) : void => {
    e.preventDefault();
    setIsLoading(true);
    const data : LoginFormData = {email, password};
    axios.post('/api/proxy/login', data)
    .then((result: any) => {
      alert(result.data.message);
      if (result.data.message === "Login successful") {
        auth.login({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
          username: result.data.user.fullName,
          transactionRecord: result.data.user.transactionRecord,
          email: result.data.user.email
        })
        navigate(from);
      }
    }).catch((err: any) => {
      alert(err.response.data.message);
    }
    ).finally(() => {
      setIsLoading(false);
    }
    );
  }

  return (
    <div className='register-page'>
      <div className="register-login">
        <NavLink to="/register" className="nav-link">
          <div className="register">Register</div>
        </NavLink>
        <div className="login active">Login</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='form-field-group'>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className='form-field-group'> 
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
