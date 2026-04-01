import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          🐾 Paw<span>Alert</span>
        </Link>
        <div className="navbar-links">
          <NavLink to="/"       className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')} end>Home</NavLink>
          <NavLink to="/report" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Report</NavLink>
          <NavLink to="/track"  className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Track</NavLink>
          {user?.role === 'authority' &&
            <NavLink to="/authority" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Dashboard</NavLink>}
          {user && user.role === 'user' &&
            <NavLink to="/dashboard" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>My Reports</NavLink>}
          {user
            ? <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            : <>
                <NavLink to="/login"    className="btn btn-outline btn-sm">Login</NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm">Sign Up</NavLink>
              </>
          }
        </div>
      </div>
    </nav>
  );
}
