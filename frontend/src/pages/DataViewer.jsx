import React, { useState, useEffect } from 'react';
import { getDistributedData } from '../api/api';

const DataViewer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('suppliers');

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      const result = await getDistributedData(tab);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const renderBadge = (sourceNode) => {
    if (!sourceNode) return null;
    let badgeClass = 'badge ';
    if (sourceNode.includes('North')) badgeClass += 'badge-north';
    else if (sourceNode.includes('West')) badgeClass += 'badge-west';
    else if (sourceNode.includes('South')) badgeClass += 'badge-south';
    
    return <span className={badgeClass}>{sourceNode}</span>;
  };

  const renderTable = () => {
    if (data.length === 0) return <p>No data available.</p>;

    const keys = Object.keys(data[0]).filter(k => k !== '_source_node');

    return (
      <div className="table-container animate-fade-in">
        <table>
          <thead>
            <tr>
              {keys.map(key => <th key={key}>{key.replace(/_/g, ' ')}</th>)}
              <th>Data Origin Site</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {keys.map(key => (
                  <td key={key}>{row[key] !== null ? row[key].toString() : 'N/A'}</td>
                ))}
                <td>{renderBadge(row['_source_node'] || 'Global/Replicated')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <h2>Distributed Data Viewer</h2>
      <p>This page transparently queries the three regional databases and merges the results.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn ${activeTab === 'suppliers' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('suppliers')}
          style={activeTab !== 'suppliers' ? { background: 'var(--surface-color)', color: 'white', border: '1px solid var(--border-color)' } : {}}
        >
          Suppliers
        </button>
        <button 
          className={`btn ${activeTab === 'inventory' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('inventory')}
          style={activeTab !== 'inventory' ? { background: 'var(--surface-color)', color: 'white', border: '1px solid var(--border-color)' } : {}}
        >
          Inventory
        </button>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('orders')}
          style={activeTab !== 'orders' ? { background: 'var(--surface-color)', color: 'white', border: '1px solid var(--border-color)' } : {}}
        >
          Orders
        </button>
      </div>

      {loading ? <div className="loader"></div> : renderTable()}
    </div>
  );
};

export default DataViewer;
