import React, { useState, useEffect } from 'react';
import { Bell, Search, UserCircle, Database } from 'lucide-react';

const Topbar = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/distributed/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('Failed to fetch health', err));
  }, []);

  return (
    <header className="glass-header">
      <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', width: '300px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search shipments, orders..." 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
        />
      </div>

      <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {health && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <Database size={16} color="var(--text-muted)" />
            <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>DB Nodes:</span>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
               <span title="North DB" style={{ width: 10, height: 10, borderRadius: '50%', background: health.north_db === 'Online' ? 'var(--accent-success)' : 'var(--accent-danger)' }}></span>
               <span title="West DB" style={{ width: 10, height: 10, borderRadius: '50%', background: health.west_db === 'Online' ? 'var(--accent-success)' : 'var(--accent-danger)' }}></span>
               <span title="South DB" style={{ width: 10, height: 10, borderRadius: '50%', background: health.south_db === 'Online' ? 'var(--accent-success)' : 'var(--accent-danger)' }}></span>
               <span title="Central DB" style={{ width: 10, height: 10, borderRadius: '50%', background: health.central_db === 'Online' ? 'var(--accent-success)' : 'var(--accent-danger)' }}></span>
            </div>
          </div>
        )}
        <Bell size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
          <UserCircle size={28} color="var(--accent-primary)" />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>Admin</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>System Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
