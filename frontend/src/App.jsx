import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Pages
import Dashboard from './pages/Dashboard';
import RegionalOperations from './pages/RegionalOperations';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import Warehouses from './pages/Warehouses';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Shipments from './pages/Shipments';
import Fragmentation from './pages/Fragmentation';
import FragmentAllocation from './pages/FragmentAllocation';
import QueryLab from './pages/QueryLab';
import CentralizedVsDistributed from './pages/CentralizedVsDistributed';
import DatabaseTopology from './pages/DatabaseTopology';
import DatabaseExplorer from './pages/DatabaseExplorer';
import SystemHealth from './pages/SystemHealth';

function App() {
  return (
    <Router>
      <div className="layout-container">
        <Sidebar />
        <main className="main-content">
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/regions" element={<RegionalOperations />} />
            
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/shipments" element={<Shipments />} />
            
            <Route path="/fragmentation" element={<Fragmentation />} />
            <Route path="/allocation" element={<FragmentAllocation />} />
            <Route path="/query-lab" element={<QueryLab />} />
            <Route path="/compare" element={<CentralizedVsDistributed />} />
            <Route path="/topology" element={<DatabaseTopology />} />
            
            <Route path="/explorer" element={<DatabaseExplorer />} />
            <Route path="/health" element={<SystemHealth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
