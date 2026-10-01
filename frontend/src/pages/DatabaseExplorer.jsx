import React, { useState } from 'react';
import { Database, Table as TableIcon, Key, Link as LinkIcon, FileJson, Layout } from 'lucide-react';
import Card from '../components/ui/Card';

export default function DatabaseExplorer() {
  const [selectedTable, setSelectedTable] = useState('supplier');

  const schema = {
    supplier: {
      description: 'Stores information about global and regional suppliers.',
      fragmentation: 'Horizontal by region',
      columns: [
        { name: 'supplier_id', type: 'INT', isPK: true, desc: 'Unique identifier for the supplier' },
        { name: 'supplier_name', type: 'VARCHAR(255)', isPK: false, desc: 'Name of the supplier company' },
        { name: 'contact_info', type: 'VARCHAR(255)', isPK: false, desc: 'Email or phone number' },
        { name: 'region', type: 'VARCHAR(50)', isPK: false, desc: 'Operating region (Fragment Attribute)' },
      ]
    },
    warehouse: {
      description: 'Physical storage nodes across different regions.',
      fragmentation: 'Horizontal by region',
      columns: [
        { name: 'warehouse_id', type: 'INT', isPK: true, desc: 'Unique identifier for the warehouse node' },
        { name: 'warehouse_name', type: 'VARCHAR(255)', isPK: false, desc: 'Name of the facility' },
        { name: 'location', type: 'VARCHAR(255)', isPK: false, desc: 'City or geographic location' },
        { name: 'capacity', type: 'INT', isPK: false, desc: 'Maximum storage capacity in units' },
        { name: 'region', type: 'VARCHAR(50)', isPK: false, desc: 'Operating region (Fragment Attribute)' },
      ]
    },
    product: {
      description: 'Global catalog of products available in the supply chain.',
      fragmentation: 'Fully Replicated (All Nodes)',
      columns: [
        { name: 'product_id', type: 'INT', isPK: true, desc: 'Unique product identifier' },
        { name: 'product_name', type: 'VARCHAR(255)', isPK: false, desc: 'Name of the product' },
        { name: 'category', type: 'VARCHAR(255)', isPK: false, desc: 'Product classification' },
        { name: 'unit_price', type: 'DECIMAL(10,2)', isPK: false, desc: 'Base price per unit' },
      ]
    },
    inventory: {
      description: 'Stock levels of products at specific warehouses.',
      fragmentation: 'Derived Horizontal (Based on Warehouse.region)',
      columns: [
        { name: 'inventory_id', type: 'INT', isPK: true, desc: 'Unique inventory record identifier' },
        { name: 'warehouse_id', type: 'INT', isPK: false, isFK: true, fkRef: 'warehouse.warehouse_id', desc: 'Foreign key to warehouse' },
        { name: 'product_id', type: 'INT', isPK: false, isFK: true, fkRef: 'product.product_id', desc: 'Foreign key to product catalog' },
        { name: 'quantity', type: 'INT', isPK: false, desc: 'Current stock level' },
        { name: 'region', type: 'VARCHAR(50)', isPK: false, desc: 'Region inherited from warehouse (Derived Fragment Attribute)' },
      ]
    },
    orders: {
      description: 'Procurement orders placed to suppliers for specific warehouses.',
      fragmentation: 'Horizontal by region',
      columns: [
        { name: 'order_id', type: 'INT', isPK: true, desc: 'Unique order identifier' },
        { name: 'supplier_id', type: 'INT', isPK: false, isFK: true, fkRef: 'supplier.supplier_id', desc: 'Foreign key to supplier' },
        { name: 'warehouse_id', type: 'INT', isPK: false, isFK: true, fkRef: 'warehouse.warehouse_id', desc: 'Foreign key to destination warehouse' },
        { name: 'order_date', type: 'DATE', isPK: false, desc: 'Date the order was placed' },
        { name: 'status', type: 'VARCHAR(50)', isPK: false, desc: 'Current processing status' },
        { name: 'total_amount', type: 'DECIMAL(10,2)', isPK: false, desc: 'Total monetary value of the order' },
        { name: 'region', type: 'VARCHAR(50)', isPK: false, desc: 'Region (Fragment Attribute)' },
      ]
    },
    shipments: {
      description: 'Logistics tracking for orders moving between facilities.',
      fragmentation: 'Horizontal by source/destination region',
      columns: [
        { name: 'shipment_id', type: 'INT', isPK: true, desc: 'Unique shipment identifier' },
        { name: 'order_id', type: 'INT', isPK: false, isFK: true, fkRef: 'orders.order_id', desc: 'Associated order reference' },
        { name: 'source', type: 'VARCHAR(255)', isPK: false, desc: 'Origin facility or supplier' },
        { name: 'destination', type: 'VARCHAR(255)', isPK: false, desc: 'Destination warehouse' },
        { name: 'shipment_date', type: 'DATE', isPK: false, desc: 'Dispatch date' },
        { name: 'expected_delivery', type: 'DATE', isPK: false, desc: 'ETA date' },
        { name: 'actual_delivery', type: 'DATE', isPK: false, desc: 'Actual arrival date' },
        { name: 'status', type: 'VARCHAR(50)', isPK: false, desc: 'Transit status' },
        { name: 'region', type: 'VARCHAR(50)', isPK: false, desc: 'Region (Fragment Attribute)' },
      ]
    }
  };

  const tables = Object.keys(schema);

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header mb-8">
        <h1 className="text-3xl font-bold mb-2">Global Schema Explorer</h1>
        <p className="text-text-secondary">Interactive dictionary of the distributed database schema and fragmentation mappings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <h3 className="font-semibold text-text-muted text-sm uppercase tracking-wider mb-2 px-2">Relations</h3>
          {tables.map(table => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                selectedTable === table 
                  ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30' 
                  : 'bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 border border-transparent'
              }`}
            >
              <TableIcon size={16} className={selectedTable === table ? 'text-accent-primary' : 'text-text-muted'} />
              {table.charAt(0).toUpperCase() + table.slice(1)}
            </button>
          ))}
          
          <div className="mt-8 p-4 bg-black/30 rounded-xl border border-glass-border">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layout size={14} /> Legend
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><Key size={12} className="text-accent-warning" /> Primary Key</div>
              <div className="flex items-center gap-2"><LinkIcon size={12} className="text-accent-secondary" /> Foreign Key</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent-primary"></span> Fragment Attribute</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <Card className="!p-6 relative overflow-hidden">
            {/* Header info */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-glass-border">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2 flex items-center gap-3">
                  <Database size={24} className="text-accent-primary" />
                  {selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)} Relation
                </h2>
                <p className="text-text-secondary m-0">{schema[selectedTable].description}</p>
              </div>
              <div className="bg-black/40 px-4 py-2 rounded-lg border border-glass-border text-right">
                <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Fragmentation Type</div>
                <div className="text-sm font-medium text-accent-secondary">{schema[selectedTable].fragmentation}</div>
              </div>
            </div>

            {/* Schema Table */}
            <div className="overflow-x-auto rounded-lg border border-glass-border bg-black/20">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-glass-border text-text-muted">
                    <th className="p-4 font-semibold">Column Name</th>
                    <th className="p-4 font-semibold">Data Type</th>
                    <th className="p-4 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {schema[selectedTable].columns.map((col, idx) => (
                    <tr key={col.name} className="border-b border-glass-border/50 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-text-primary flex items-center gap-2">
                        {col.isPK && <Key size={14} className="text-accent-warning flex-shrink-0" title="Primary Key" />}
                        {col.isFK && <LinkIcon size={14} className="text-accent-secondary flex-shrink-0" title={`Foreign Key referencing ${col.fkRef}`} />}
                        {!col.isPK && !col.isFK && <span className="w-[14px] flex-shrink-0"></span>}
                        
                        <span className={col.name === 'region' ? 'text-accent-primary font-bold' : ''}>
                          {col.name}
                        </span>
                      </td>
                      <td className="p-4 text-accent-success font-mono text-xs">{col.type}</td>
                      <td className="p-4 text-text-secondary">
                        {col.desc}
                        {col.isFK && (
                          <div className="mt-1 text-[10px] text-text-muted font-mono flex items-center gap-1">
                            <LinkIcon size={10} /> REFERENCES {col.fkRef}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* SQL DDL Mockup */}
          <Card className="!p-0 overflow-hidden border border-glass-border">
            <div className="bg-black/60 px-4 py-3 border-b border-glass-border flex items-center gap-2 text-sm text-text-muted font-mono">
              <FileJson size={16} /> schema_definition.sql
            </div>
            <div className="p-4 font-mono text-sm overflow-x-auto text-text-primary bg-[#0f111a]">
              <div className="text-purple-400">CREATE TABLE <span className="text-yellow-200">{selectedTable}</span> (</div>
              {schema[selectedTable].columns.map((col, idx) => (
                <div key={col.name} className="ml-4 flex">
                  <span className={col.name === 'region' ? 'text-blue-300 w-32 inline-block' : 'text-blue-200 w-32 inline-block'}>{col.name}</span>
                  <span className="text-green-300 w-32 inline-block">{col.type}</span>
                  {col.isPK && <span className="text-yellow-400">PRIMARY KEY</span>}
                  {col.isFK && <span className="text-gray-400">REFERENCES {col.fkRef}</span>}
                  {idx < schema[selectedTable].columns.length - 1 && <span className="text-white">,</span>}
                </div>
              ))}
              <div className="text-purple-400">);</div>
              
              <div className="mt-4 text-gray-500 italic">-- D-SCM Distribution Rule</div>
              <div className="text-purple-400">ALTER TABLE <span className="text-yellow-200">{selectedTable}</span></div>
              <div className="text-blue-300 ml-4">DISTRIBUTE BY <span className="text-orange-300">{schema[selectedTable].fragmentation.includes('Fully') ? 'REPLICATION' : (schema[selectedTable].fragmentation.includes('Derived') ? 'REFERENCE' : 'HASH(region)')}</span>;</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
