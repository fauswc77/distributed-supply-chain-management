import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Map, PackageSearch, Warehouse, Truck, 
  Network, Activity, Users, ShoppingCart, Database,
  PieChart, Server, Layers, Globe, Search
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Network size={24} />
        <span>Distributed SCM</span>
      </div>
      
      <nav className="sidebar-nav">
        <div style={{ padding: '1rem 1.5rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Overview</div>
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          <span>Control Tower</span>
        </NavLink>
        <NavLink to="/regions" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Map size={20} />
          <span>Regional Ops</span>
        </NavLink>
        
        <div style={{ padding: '1rem 1.5rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Supply Chain</div>
        <NavLink to="/suppliers" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Users size={20} />
          <span>Suppliers</span>
        </NavLink>
        <NavLink to="/products" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <PackageSearch size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/warehouses" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Warehouse size={20} />
          <span>Warehouses</span>
        </NavLink>
        <NavLink to="/inventory" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Layers size={20} />
          <span>Inventory</span>
        </NavLink>
        <NavLink to="/orders" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <ShoppingCart size={20} />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/shipments" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Truck size={20} />
          <span>Shipments</span>
        </NavLink>

        <div style={{ padding: '1rem 1.5rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>ADBMS Concepts</div>
        <NavLink to="/fragmentation" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <PieChart size={20} />
          <span>Fragmentation</span>
        </NavLink>
        <NavLink to="/allocation" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Globe size={20} />
          <span>Allocation</span>
        </NavLink>
        <NavLink to="/query-lab" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Database size={20} />
          <span>Query Lab</span>
        </NavLink>
        <NavLink to="/compare" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Server size={20} />
          <span>Cent. vs Dist.</span>
        </NavLink>
        <NavLink to="/topology" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Network size={20} />
          <span>DB Topology</span>
        </NavLink>

        <div style={{ padding: '1rem 1.5rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>System</div>
        <NavLink to="/explorer" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Search size={20} />
          <span>DB Explorer</span>
        </NavLink>
        <NavLink to="/health" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Activity size={20} />
          <span>System Health</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
