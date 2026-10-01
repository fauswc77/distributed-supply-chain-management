import React from 'react';
import { NavLink } from 'react-router-dom';
import { Database, LayoutDashboard, TableProperties, Network, GitMerge } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <Database size={24} color="var(--primary-color)" />
        <span>SCM DistDB</span>
      </div>
      
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/data" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <TableProperties size={20} />
          <span>Data Viewer</span>
        </NavLink>
        
        <NavLink to="/compare" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <GitMerge size={20} />
          <span>Cent. vs Dist.</span>
        </NavLink>
        
        <NavLink to="/fragmentation" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Network size={20} />
          <span>Fragmentation</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
