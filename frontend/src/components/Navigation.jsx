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
    <nav className="nav">
      <div className="container">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-lg font-bold text-blue-600">
                Deeps Roller Maraude
              </h1>
            </Link>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      <div className="mobile-nav md:hidden">
        <div className="mobile-nav-grid">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;