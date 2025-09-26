import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  MapIcon,
  ChartBarIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Accueil',
      href: '/',
      icon: HomeIcon,
    },
    {
      name: 'Ajouter',
      href: '/add',
      icon: PlusCircleIcon,
    },
    {
      name: 'Carte',
      href: '/map',
      icon: MapIcon,
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: ChartBarIcon,
    },
  ];

  return (
    <>
      {/* Navigation simple en haut pour desktop */}
      <nav className="nav-desktop">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="nav-logo">
              <h1>Deeps Roller</h1>
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
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation mobile en bas */}
      <div className="nav-mobile">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-mobile-item ${isActive ? 'active' : ''}`}
            >
              <item.icon />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Navigation;