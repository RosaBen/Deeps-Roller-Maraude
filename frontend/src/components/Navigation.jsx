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
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-600">
                Deeps Roller Maraude
              </h1>
            </Link>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-1 transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-500'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;