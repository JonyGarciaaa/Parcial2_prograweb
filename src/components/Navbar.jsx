import React from 'react';
import { ShoppingBag } from 'lucide-react';

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="logo-container">
          <ShoppingBag size={28} className="logo-icon" />
          <h1>TechStore</h1>
        </div>
      </div>
    </header>
  );
}