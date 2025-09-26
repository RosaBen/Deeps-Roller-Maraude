import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, PlusIcon, MapIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Accueil',
      href: '/',
      icon: HomeIcon
    },
    {
      name: 'Ajouter',
      href: '/add',
      icon: PlusIcon
    },
    {
      name: 'Carte',
      href: '/map',
      icon: MapIcon
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: ChartBarIcon
    }
  ];

  return (
    <>
      {/* Navigation desktop */}
      <nav className="nav-desktop">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="nav-logo">
              <h1>Deeps Roller Maraude</h1>
            </Link>
            <div className="nav-links">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <IconComponent className="nav-icon" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation mobile */}
      <div className="nav-mobile">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name + '-mobile'}
              to={item.href}
              className={`nav-mobile-item ${isActive ? 'active' : ''}`}
            >
              <IconComponent className="nav-mobile-icon" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Navigation;