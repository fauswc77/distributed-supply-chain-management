import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Package, Truck, Warehouse as WarehouseIcon, TrendingUp, AlertTriangle } from 'lucide-react';
import api from '../api/api';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const Dashboard = () => {
  const [inventoryStats, setInventoryStats] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, ordRes, whRes, shipRes] = await Promise.all([
          api.get('/distributed/inventory/aggregate'),
          api.get('/distributed/orders/aggregate'),
          api.get('/distributed/warehouses'),
          api.get('/distributed/shipments')
        ]);
        setInventoryStats(invRes.data);
        setOrderStats(ordRes.data);
        setWarehouses(whRes.data);
        setShipments(shipRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalInventory = inventoryStats.reduce((sum, item) => sum + (Number(item.total_inventory) || 0), 0);
  const totalOrders = orderStats.reduce((sum, item) => sum + (Number(item.total_orders) || 0), 0);
  const inTransitShipments = shipments.filter(s => s.status !== 'Delivered').length;

  const getRegionColor = (region) => {
    switch(region?.toLowerCase()) {
      case 'north': return 'var(--accent-primary)';
      case 'south': return 'var(--accent-secondary)';
      case 'west': return 'var(--accent-warning)';
      case 'east': return 'var(--accent-success)';
      case 'central': return '#4ade80';
      default: return 'var(--accent-primary)';
    }
  };

  const pieData = orderStats.map(s => ({
    name: s.region,
    value: Number(s.total_orders) || 0,
    color: getRegionColor(s.region)
  }));

  if (loading) return <Spinner />;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold mb-2">Control Tower</h1>
          <p className="text-text-secondary">Real-time overview of the distributed supply chain network.</p>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid-stats">
        <Card className="flex items-center gap-6 p-6">
          <div className="p-4 rounded-lg bg-accent-primary/15">
            <Package size={28} color="var(--accent-primary)" />
          </div>
          <div>
            <p className="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-1">Total Inventory</p>
            <h2 className="text-3xl font-bold m-0">{totalInventory.toLocaleString()}</h2>
          </div>
        </Card>

        <Card className="flex items-center gap-6 p-6">
          <div className="p-4 rounded-lg bg-accent-success/15">
            <TrendingUp size={28} color="var(--accent-success)" />
          </div>
          <div>
            <p className="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-1">Total Orders</p>
            <h2 className="text-3xl font-bold m-0">{totalOrders.toLocaleString()}</h2>
          </div>
        </Card>

        <Card className="flex items-center gap-6 p-6">
          <div className="p-4 rounded-lg bg-accent-warning/15">
            <WarehouseIcon size={28} color="var(--accent-warning)" />
          </div>
          <div>
            <p className="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-1">Active Nodes</p>
            <h2 className="text-3xl font-bold m-0">{warehouses.length}</h2>
          </div>
        </Card>

        <Card className="flex items-center gap-6 p-6">
          <div className="p-4 rounded-lg bg-accent-secondary/15">
            <Truck size={28} color="var(--accent-secondary)" />
          </div>
          <div>
            <p className="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-1">In Transit</p>
            <h2 className="text-3xl font-bold m-0">{inTransitShipments}</h2>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid-cards">
        <Card title={
          <span className="flex items-center gap-3">
            <Package size={20} color="var(--accent-primary)" /> Regional Inventory Volume
          </span>
        } className="h-[400px] flex flex-col">
          <div className="flex-1 min-h-0 pt-4">
            {inventoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="region" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="total_inventory" radius={[4, 4, 0, 0]}>
                    {inventoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRegionColor(entry.region)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-center">
                <div>
                  <AlertTriangle size={32} color="var(--text-muted)" className="mx-auto mb-4" />
                  <p className="text-text-secondary">No inventory data found across regional nodes.</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title={
          <span className="flex items-center gap-3">
            <TrendingUp size={20} color="var(--accent-success)" /> Order Distribution
          </span>
        } className="h-[400px] flex flex-col">
          <div className="flex-1 min-h-0 pt-4">
            {orderStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'var(--text-muted)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-center">
                <div>
                  <AlertTriangle size={32} color="var(--text-muted)" className="mx-auto mb-4" />
                  <p className="text-text-secondary">No order data found across regional nodes.</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
