import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Navigation, Package } from 'lucide-react';
import api from '../api/api';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [formData, setFormData] = useState({
    order_id: '',
    source: '',
    destination: '',
    shipment_date: new Date().toISOString().split('T')[0],
    expected_delivery: '',
    actual_delivery: '',
    status: 'In Transit'
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const data = await api.get('/distributed/shipments');
      setShipments(data.data);
    } catch (err) {
      console.error('Failed to fetch shipments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (shipment = null) => {
    if (shipment) {
      setCurrentShipment(shipment);
      setFormData({
        order_id: shipment.order_id,
        source: shipment.source,
        destination: shipment.destination,
        shipment_date: shipment.shipment_date || '',
        expected_delivery: shipment.expected_delivery || '',
        actual_delivery: shipment.actual_delivery || '',
        status: shipment.status
      });
    } else {
      setCurrentShipment(null);
      setFormData({
        order_id: '',
        source: '',
        destination: '',
        shipment_date: new Date().toISOString().split('T')[0],
        expected_delivery: '',
        actual_delivery: '',
        status: 'Processing'
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
      if (currentShipment) {
        await api.put(`/distributed/shipments/${currentShipment.shipment_id}`, formData);
      } else {
        await api.post('/distributed/shipments', formData);
      }
      fetchShipments();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving shipment', err);
      alert('Failed to save shipment. See console for details.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipment record?')) {
      try {
        await api.delete(`/distributed/shipments/${id}`);
        fetchShipments();
      } catch (err) {
        console.error('Error deleting shipment', err);
        alert('Failed to delete shipment.');
      }
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': 
      case 'in transit': return 'primary';
      case 'delayed': return 'danger';
      default: return 'warning';
    }
  };

  const filteredShipments = shipments.filter(s => 
    s.shipment_id.toString().includes(searchTerm) ||
    s.order_id.toString().includes(searchTerm) ||
    s.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      accessor: 'shipment_id', 
      header: 'Tracking Details',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-accent-primary/10">
            <Package size={18} className="text-accent-primary" />
          </div>
          <div>
            <div className="font-semibold text-accent-primary">SHP-{row.shipment_id}</div>
            <div className="text-xs text-text-muted">ORD-{row.order_id}</div>
          </div>
        </div>
      )
    },
    { 
      accessor: 'route', 
      header: 'Route (Source ➔ Destination)',
      render: (row) => (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-secondary">{row.source}</span>
          <Navigation size={12} className="text-accent-primary transform rotate-90" />
          <span className="text-text-primary font-medium">{row.destination}</span>
        </div>
      )
    },
    { 
      accessor: 'dates', 
      header: 'Timeline',
      render: (row) => (
        <div className="text-xs space-y-1">
          <div><span className="text-text-muted">Sent:</span> {row.shipment_date ? new Date(row.shipment_date).toLocaleDateString() : '--'}</div>
          <div><span className="text-text-muted">ETA:</span> {row.expected_delivery ? new Date(row.expected_delivery).toLocaleDateString() : '--'}</div>
        </div>
      )
    },
    { 
      accessor: 'status', 
      header: 'Status',
      render: (row) => (
        <Badge variant={getStatusVariant(row.status)}>
          {row.status}
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
          <Button variant="danger" onClick={() => handleDelete(row.shipment_id)} className="!p-2">
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
          <h1 className="text-3xl font-bold mb-2">Shipment Tracking</h1>
          <p className="text-text-secondary">Monitor end-to-end logistics and delivery status.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} /> Create Shipment
        </Button>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-glass-border flex justify-between items-center bg-bg-elevated/30">
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md border border-glass-border w-[350px]">
            <Search size={18} className="text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by ID, route, or status..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-text-primary outline-none w-full text-sm"
            />
          </div>
          <div className="text-text-muted text-sm font-medium">
            Total: {filteredShipments.length} shipments
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Spinner className="mx-auto mb-4" />
            <p className="text-text-muted">Syncing shipment data across regions...</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredShipments} keyField="shipment_id" />
        )}
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentShipment ? 'Edit Shipment' : 'Create New Shipment'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Order Reference ID</label>
            <input type="number" name="order_id" className="form-input" required value={formData.order_id} onChange={handleInputChange} disabled={!!currentShipment} />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Source Facility</label>
              <input type="text" name="source" className="form-input" required value={formData.source} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Destination Node</label>
              <input type="text" name="destination" className="form-input" required value={formData.destination} onChange={handleInputChange} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Shipment Date</label>
              <input type="date" name="shipment_date" className="form-input" value={formData.shipment_date} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Expected Delivery Date</label>
              <input type="date" name="expected_delivery" className="form-input" value={formData.expected_delivery} onChange={handleInputChange} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Status</label>
              <select name="status" className="form-input" required value={formData.status} onChange={handleInputChange}>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Actual Delivery Date</label>
              <input type="date" name="actual_delivery" className="form-input" value={formData.actual_delivery} onChange={handleInputChange} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save Shipment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
