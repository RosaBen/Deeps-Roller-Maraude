import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Accueil',
      href: '/',
      icon: '🏠'
    },
    {
      name: 'Ajouter',
      href: '/add',
      icon: '➕'
    },
    {
      name: 'Carte',
      href: '/map',
      icon: '🗺️'
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊'
    }
  ];

  return (
    <nav className="navigation">
      {/* Navigation desktop */}
      <div className="nav-desktop">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="nav-logo">
              <h1>Deeps Roller Maraude</h1>
            </Link>
            <div className="nav-links">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      <div className="nav-mobile">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name + '-mobile'}
              to={item.href}
              className={`nav-mobile-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-mobile-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;