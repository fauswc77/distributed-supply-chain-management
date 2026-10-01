import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, CheckCircle, Clock, Truck, FileText } from 'lucide-react';
import api from '../api/api';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [formData, setFormData] = useState({
    supplier_id: '',
    warehouse_id: '',
    order_date: new Date().toISOString().split('T')[0],
    status: 'Processing',
    total_amount: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.get('/distributed/orders');
      setOrders(data.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (order = null) => {
    if (order) {
      setCurrentOrder(order);
      setFormData({
        supplier_id: order.supplier_id,
        warehouse_id: order.warehouse_id,
        order_date: order.order_date,
        status: order.status,
        total_amount: order.total_amount
      });
    } else {
      setCurrentOrder(null);
      setFormData({
        supplier_id: '',
        warehouse_id: '',
        order_date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        total_amount: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (currentOrder) {
        await api.put(`/distributed/orders/${currentOrder.order_id}`, formData);
      } else {
        await api.post('/distributed/orders', formData);
      }
      fetchOrders();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving order', err);
      alert('Failed to save order. See console for details.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.delete(`/distributed/orders/${id}`);
        fetchOrders();
      } catch (err) {
        console.error('Error deleting order', err);
        alert('Failed to delete. The order might be referenced by shipments or items.');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle size={14} className="mr-1" />;
      case 'shipped': return <Truck size={14} className="mr-1" />;
      case 'cancelled': return <X size={14} className="mr-1" />;
      default: return <Clock size={14} className="mr-1" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'warning';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.order_id.toString().includes(searchTerm) ||
    o.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      accessor: 'order_id', 
      header: 'Order Details',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-accent-primary/10">
            <FileText size={18} className="text-accent-primary" />
          </div>
          <div>
            <div className="font-semibold text-text-primary">ORD-{row.order_id}</div>
            <div className="text-xs text-text-muted">{new Date(row.order_date).toLocaleDateString()}</div>
          </div>
        </div>
      )
    },
    { accessor: 'supplier_id', header: 'Supplier Node', render: (row) => `SUP-${row.supplier_id}` },
    { accessor: 'warehouse_id', header: 'Warehouse Node', render: (row) => `WH-${row.warehouse_id}` },
    { 
      accessor: 'total_amount', 
      header: 'Total Amount (₹)',
      render: (row) => (
        <span className="font-medium">
          ₹{Number(row.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    },
    { 
      accessor: 'status', 
      header: 'Status',
      render: (row) => (
        <Badge variant={getStatusVariant(row.status)} className="flex items-center w-fit">
          {getStatusIcon(row.status)} {row.status}
        </Badge>
      )
    },
    { 
      accessor: 'actions', 
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => handleOpenModal(row)} className="!p-2">
            <Edit2 size={16} />
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row.order_id)} className="!p-2">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-text-secondary">Track and manage procurement orders across regions.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} /> Create Order
        </Button>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-glass-border flex justify-between items-center bg-bg-elevated/30">
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md border border-glass-border w-[300px]">
            <Search size={18} className="text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by ID or status..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-text-primary outline-none w-full text-sm"
            />
          </div>
          <div className="text-text-muted text-sm font-medium">
            Total: {filteredOrders.length} orders
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Spinner className="mx-auto mb-4" />
            <p className="text-text-muted">Loading distributed orders...</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredOrders} keyField="order_id" />
        )}
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentOrder ? 'Edit Order' : 'Create New Order'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Supplier ID</label>
              <input type="number" name="supplier_id" className="form-input" required value={formData.supplier_id} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Warehouse ID</label>
              <input type="number" name="warehouse_id" className="form-input" required value={formData.warehouse_id} onChange={handleInputChange} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Order Date</label>
              <input type="date" name="order_date" className="form-input" required value={formData.order_date} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Total Amount (₹)</label>
              <input type="number" step="0.01" min="0" name="total_amount" className="form-input" required value={formData.total_amount} onChange={handleInputChange} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Status</label>
            <select name="status" className="form-input" required value={formData.status} onChange={handleInputChange}>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save Order'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
