import React, { useState, useEffect } from 'react';
import { Layers, Database, Server, Filter, PieChart as PieChartIcon } from 'lucide-react';
import api from '../api/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';

export default function Fragmentation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState('supplier');

  const fetchFragmentationData = async () => {
    try {
      setLoading(true);
      // We will fetch from the central node and then bucket by region on the frontend
      // to demonstrate how the data is distributed
      const suppliers = await api.get('/distributed/suppliers');
      const warehouses = await api.get('/distributed/warehouses');
      const inventory = await api.get('/distributed/inventory');
      
      const bucketByRegion = (arr) => {
        return arr.reduce((acc, item) => {
          const r = item.region || 'Unknown';
          if (!acc[r]) acc[r] = [];
          acc[r].push(item);
          return acc;
        }, {});
      };

      setData({
        supplier: bucketByRegion(suppliers.data),
        warehouse: bucketByRegion(warehouses.data),
        inventory: bucketByRegion(inventory.data)
      });
    } catch (err) {
      console.error('Failed to fetch fragmentation data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFragmentationData();
  }, []);

  const regions = ['North', 'South', 'West', 'East', 'Central'];
  const colors = {
    'North': 'bg-blue-500',
    'South': 'bg-orange-500',
    'West': 'bg-green-500',
    'East': 'bg-purple-500',
    'Central': 'bg-red-500',
    'Unknown': 'bg-gray-500'
  };

  const textColors = {
    'North': 'text-blue-500',
    'South': 'text-orange-500',
    'West': 'text-green-500',
    'East': 'text-purple-500',
    'Central': 'text-red-500',
    'Unknown': 'text-gray-500'
  };

  const renderFragmentationRules = () => (
    <div className="space-y-4">
      <div className="p-4 bg-white/5 border border-glass-border rounded-xl">
        <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
          <Database size={16} className="text-accent-primary" /> Global Relation
        </h4>
        <div className="font-mono text-sm bg-black/30 p-2 rounded text-text-muted">
          R = {selectedTable.toUpperCase()}({selectedTable === 'supplier' ? 'supplier_id, name, contact, region' : (selectedTable === 'warehouse' ? 'warehouse_id, name, location, capacity, region' : 'inventory_id, product_id, warehouse_id, quantity, region')})
        </div>
      </div>
      <div className="p-4 bg-white/5 border border-glass-border rounded-xl">
        <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
          <Filter size={16} className="text-accent-warning" /> Horizontal Fragmentation Predicates
        </h4>
        <div className="space-y-2">
          {regions.map(r => (
            <div key={r} className="font-mono text-sm flex items-center gap-2">
              <Badge variant="secondary" className="w-12 text-center">F_{r[0]}</Badge>
              <span className="text-text-muted">σ <sub>region='{r}'</sub> (R)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDistributionBar = () => {
    if (!data) return null;
    const tableData = data[selectedTable];
    const total = Object.values(tableData).reduce((sum, arr) => sum + arr.length, 0);

    return (
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <h4 className="font-semibold text-text-primary">Data Distribution Across Nodes</h4>
          <span className="text-sm text-text-muted">Total Tuples: {total}</span>
        </div>
        <div className="h-6 w-full rounded-full overflow-hidden flex bg-black/40 border border-white/10">
          {Object.entries(tableData).map(([region, arr]) => {
            if (arr.length === 0) return null;
            const percentage = (arr.length / total) * 100;
            return (
              <div 
                key={region} 
                className={`h-full ${colors[region] || colors['Unknown']} flex items-center justify-center text-[10px] font-bold text-white shadow-[inset_0_1px_3px_rgba(255,255,255,0.3)]`}
                style={{ width: `${percentage}%` }}
                title={`${region}: ${arr.length} rows (${percentage.toFixed(1)}%)`}
              >
                {percentage > 5 && region}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {Object.entries(tableData).map(([region, arr]) => (
            <div key={region} className="flex items-center gap-2 text-sm">
              <span className={`w-3 h-3 rounded-full ${colors[region] || colors['Unknown']}`}></span>
              <span className="text-text-secondary">{region} Node:</span>
              <span className="font-semibold text-text-primary">{arr.length} tuples</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSampleData = () => {
    if (!data) return null;
    const tableData = data[selectedTable];
    
    // Flatten data for table view
    const flatData = [];
    Object.entries(tableData).forEach(([region, arr]) => {
      arr.forEach(item => flatData.push({ ...item, __node: region }));
    });
    
    let columns = [];
    if (selectedTable === 'supplier') {
      columns = [
        { accessor: 'supplier_id', header: 'ID', render: r => `SUP-${r.supplier_id}` },
        { accessor: 'supplier_name', header: 'Name' },
        { accessor: 'contact_info', header: 'Contact' },
        { accessor: 'region', header: 'Fragment Attribute (Region)', render: r => <span className={`font-bold ${textColors[r.region]}`}>{r.region}</span> },
        { accessor: '__node', header: 'Stored At Node', render: r => <Badge variant="primary">{r.__node} DB Node</Badge> }
      ];
    } else if (selectedTable === 'warehouse') {
      columns = [
        { accessor: 'warehouse_id', header: 'ID', render: r => `WH-${r.warehouse_id}` },
        { accessor: 'warehouse_name', header: 'Name' },
        { accessor: 'location', header: 'Location' },
        { accessor: 'region', header: 'Fragment Attribute (Region)', render: r => <span className={`font-bold ${textColors[r.region]}`}>{r.region}</span> },
        { accessor: '__node', header: 'Stored At Node', render: r => <Badge variant="primary">{r.__node} DB Node</Badge> }
      ];
    } else if (selectedTable === 'inventory') {
      columns = [
        { accessor: 'inventory_id', header: 'ID', render: r => `INV-${r.inventory_id}` },
        { accessor: 'product_id', header: 'Product ID' },
        { accessor: 'warehouse_id', header: 'Warehouse ID' },
        { accessor: 'quantity', header: 'Quantity' },
        { accessor: 'region', header: 'Fragment Attribute (Region)', render: r => <span className={`font-bold ${textColors[r.region]}`}>{r.region}</span> },
        { accessor: '__node', header: 'Stored At Node', render: r => <Badge variant="primary">{r.__node} DB Node</Badge> }
      ];
    }

    return (
      <div className="mt-8">
        <h4 className="font-semibold text-text-primary mb-4">Sample Fragmented Data</h4>
        <Table columns={columns} data={flatData.slice(0, 10)} keyField={selectedTable + "_id"} />
        <div className="text-center mt-4 text-sm text-text-muted">
          Showing top 10 records across all fragments
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header mb-8">
        <h1 className="text-3xl font-bold mb-2">Horizontal Fragmentation</h1>
        <p className="text-text-secondary">Visualize how global relations are divided into disjoint subsets based on regional predicates.</p>
      </div>

      <div className="flex gap-2 p-1 bg-black/20 rounded-xl w-fit mb-8 border border-glass-border">
        {['supplier', 'warehouse', 'inventory'].map(table => (
          <button
            key={table}
            onClick={() => setSelectedTable(table)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTable === table 
                ? 'bg-accent-primary text-white shadow-lg' 
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
          >
            {table.charAt(0).toUpperCase() + table.slice(1)} Relation
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner size="lg" className="text-accent-primary" />
          <p className="text-text-muted">Analyzing fragmentation schema...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 !p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-glass-border">
              <div className="p-2 bg-accent-secondary/20 rounded-lg text-accent-secondary">
                <Layers size={20} />
              </div>
              <h3 className="text-xl font-semibold m-0">Fragmentation Rules</h3>
            </div>
            
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              The Distributed Supply Chain database utilizes <strong>Primary Horizontal Fragmentation</strong>. 
              The global relation is partitioned into fragments based on the <code>region</code> attribute.
            </p>
            
            {renderFragmentationRules()}
          </Card>

          <Card className="lg:col-span-2 !p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-glass-border">
              <div className="p-2 bg-accent-primary/20 rounded-lg text-accent-primary">
                <PieChartIcon size={20} />
              </div>
              <h3 className="text-xl font-semibold m-0">Fragment Distribution</h3>
            </div>
            
            {renderDistributionBar()}
            
            <div className="border-t border-glass-border pt-6">
              {renderSampleData()}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
