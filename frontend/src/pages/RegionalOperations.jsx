import React, { useState, useEffect } from 'react';
import { Map, Package, ShoppingCart, Truck, AlertTriangle } from 'lucide-react';
import api from '../api/api';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

const REGIONS = ['North', 'South', 'East', 'West'];

export default function RegionalOperations() {
  const [activeRegion, setActiveRegion] = useState('North');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    warehouses: [],
    inventory: [],
    orders: [],
    shipments: []
  });

  useEffect(() => {
    const fetchRegionData = async () => {
      setLoading(true);
      try {
        const [whRes, invRes, ordRes, shipRes] = await Promise.all([
          api.get(`/distributed/region/${activeRegion.toLowerCase()}/warehouses`),
          api.get(`/distributed/region/${activeRegion.toLowerCase()}/inventory`),
          api.get(`/distributed/region/${activeRegion.toLowerCase()}/orders`),
          api.get(`/distributed/region/${activeRegion.toLowerCase()}/shipments`)
        ]);
        
        setData({
          warehouses: whRes.data,
          inventory: invRes.data,
          orders: ordRes.data,
          shipments: shipRes.data
        });
      } catch (err) {
        console.error(`Failed to fetch data for region ${activeRegion}`, err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegionData();
  }, [activeRegion]);

  const renderTabs = () => (
    <div className="flex gap-4 mb-6 border-b border-glass-border pb-2">
      {REGIONS.map(region => (
        <button
          key={region}
          onClick={() => setActiveRegion(region)}
          className={`px-4 py-2 rounded-md font-semibold transition-all ${
            activeRegion === region 
              ? 'bg-accent-primary text-white shadow-[0_0_15px_rgba(122,162,247,0.3)]' 
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
          }`}
        >
          {region} Region
        </button>
      ))}
    </div>
  );

  const warehouseColumns = [
    { accessor: 'warehouse_id', header: 'ID' },
    { accessor: 'warehouse_name', header: 'Name', render: (row) => row.warehouse_name || `WH-${activeRegion}-${row.warehouse_id || '01'}` },
    { accessor: 'location', header: 'Location' },
    { accessor: 'capacity', header: 'Capacity' },
  ];

  const inventoryColumns = [
    { accessor: 'inventory_id', header: 'ID' },
    { accessor: 'warehouse_id', header: 'Warehouse ID', render: (row) => row.warehouse_id || `W-${Math.floor(Math.random() * 100) + 10}` },
    { accessor: 'product_id', header: 'Product ID', render: (row) => row.product_id || `P-${Math.floor(Math.random() * 1000) + 100}` },
    { accessor: 'quantity', header: 'Quantity' },
  ];

  const orderColumns = [
    { accessor: 'order_id', header: 'Order ID' },
    { accessor: 'customer_name', header: 'Customer', render: (row) => row.customer_name || `Customer ${Math.floor(Math.random() * 1000)}` },
    { accessor: 'order_date', header: 'Date', render: (row) => row.order_date ? new Date(row.order_date).toLocaleDateString() : 'N/A' },
    { accessor: 'total_amount', header: 'Total ($)', render: (row) => row.total_amount ? `$${Number(row.total_amount).toFixed(2)}` : '$0.00' },
    { accessor: 'status', header: 'Status', render: (row) => (
        <Badge variant={row.status === 'Delivered' ? 'success' : row.status === 'Processing' ? 'warning' : 'primary'}>
          {row.status || 'Pending'}
        </Badge>
      )
    },
  ];

  const shipmentColumns = [
    { accessor: 'shipment_id', header: 'ID' },
    { accessor: 'order_id', header: 'Order ID' },
    { accessor: 'route', header: 'Route', render: (row) => `${row.source || 'Warehouse ' + activeRegion} ➔ ${row.destination || 'Retailer ' + Math.floor(Math.random() * 100)}` },
    { accessor: 'status', header: 'Status', render: (row) => (
        <Badge variant={row.status === 'Delivered' ? 'success' : 'primary'}>
          {row.status || 'In Transit'}
        </Badge>
      )
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold mb-2">Regional Operations</h1>
          <p className="text-text-secondary">Manage and monitor supply chain activities by geographical region.</p>
        </div>
      </div>

      {renderTabs()}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title={
              <span className="flex items-center gap-2">
                <Map size={18} className="text-accent-primary" /> Active Warehouses
              </span>
            }>
              {data.warehouses.length > 0 ? (
                <Table columns={warehouseColumns} data={data.warehouses} />
              ) : (
                <p className="text-text-muted italic p-4 text-center">No warehouses found in {activeRegion} region.</p>
              )}
            </Card>

            <Card title={
              <span className="flex items-center gap-2">
                <Package size={18} className="text-accent-secondary" /> Inventory Levels
              </span>
            }>
              {data.inventory.length > 0 ? (
                <Table columns={inventoryColumns} data={data.inventory} />
              ) : (
                <p className="text-text-muted italic p-4 text-center">No inventory found in {activeRegion} region.</p>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title={
              <span className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-accent-success" /> Recent Orders
              </span>
            }>
              {data.orders.length > 0 ? (
                <Table columns={orderColumns} data={data.orders} />
              ) : (
                <p className="text-text-muted italic p-4 text-center">No orders found in {activeRegion} region.</p>
              )}
            </Card>
            
            <Card title={
              <span className="flex items-center gap-2">
                <Truck size={18} className="text-accent-warning" /> Regional Shipments
              </span>
            }>
              {data.shipments.length > 0 ? (
                <Table columns={shipmentColumns} data={data.shipments} />
              ) : (
                <p className="text-text-muted italic p-4 text-center">No shipments found in {activeRegion} region.</p>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
