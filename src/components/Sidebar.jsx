// src/components/Sidebar.jsx
import React from 'react';
import { Plane, Calendar, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const { logout, user } = useAuth();
  const menuItems = [
    {
      id: 'book-flight',
      label: 'Book Flight',
      icon: Plane,
      description: 'Search and book flights'
    },
    {
      id: 'booked-flights',
      label: 'Booked Flights',
      icon: Calendar,
      description: 'View booked flights'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      description: 'Manage customers'
    }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="w-64 bg-slate-900 min-h-screen border-r border-slate-700 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">Season Travels</h1>
        <p className="text-slate-400 text-sm">Travel Management</p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-700">
        <div className="mb-3">
          <p className="text-slate-400 text-xs">Logged in as</p>
          <p className="text-white text-sm font-medium truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
