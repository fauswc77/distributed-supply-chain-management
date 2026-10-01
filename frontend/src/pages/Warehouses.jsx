import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin, Warehouse as WarehouseIcon } from 'lucide-react';
import api from '../api/api';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState(null);
  const [formData, setFormData] = useState({
    warehouse_name: '',
    location: '',
    capacity: '',
    region: 'North'
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await api.get('/distributed/warehouses');
      setWarehouses(data.data);
    } catch (err) {
      console.error('Failed to fetch warehouses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (warehouse = null) => {
    if (warehouse) {
      setCurrentWarehouse(warehouse);
      setFormData({
        warehouse_name: warehouse.warehouse_name,
        location: warehouse.location,
        capacity: warehouse.capacity,
        region: warehouse.region
      });
    } else {
      setCurrentWarehouse(null);
      setFormData({
        warehouse_name: '',
        location: '',
        capacity: '',
        region: 'North'
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
      if (currentWarehouse) {
        await api.put(`/distributed/warehouses/${currentWarehouse.warehouse_id}`, formData);
      } else {
        await api.post('/distributed/warehouses', formData);
      }
      fetchWarehouses();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving warehouse', err);
      alert('Failed to save warehouse. See console for details.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await api.delete(`/distributed/warehouses/${id}`);
        fetchWarehouses();
      } catch (err) {
        console.error('Error deleting warehouse', err);
        alert('Failed to delete. The warehouse might be referenced by inventory or orders.');
      }
    }
  };

  const filteredWarehouses = warehouses.filter(w => 
    w.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { accessor: 'warehouse_id', header: 'Node ID', render: (row) => `#${row.warehouse_id}` },
    { 
      accessor: 'warehouse_name', 
      header: 'Facility Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-accent-warning/10">
            <WarehouseIcon size={18} className="text-accent-warning" />
          </div>
          <div className="font-semibold text-text-primary">{row.warehouse_name}</div>
        </div>
      )
    },
    { 
      accessor: 'location', 
      header: 'Geographic Location',
      render: (row) => (
        <div className="flex items-center gap-2 text-text-secondary">
          <MapPin size={16} className="text-accent-warning" /> {row.location}
        </div>
      )
    },
    { 
      accessor: 'capacity', 
      header: 'Max Capacity',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-primary" 
              style={{ width: `${Math.min(100, (row.capacity / 20000) * 100)}%` }}
            ></div>
          </div>
          <span className="text-sm">{Number(row.capacity).toLocaleString()} units</span>
        </div>
      )
    },
    { 
      accessor: 'region', 
      header: 'Operating Region',
      render: (row) => (
        <Badge variant="primary">{row.region} DB</Badge>
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
          <Button variant="danger" onClick={() => handleDelete(row.warehouse_id)} className="!p-2">
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
          <h1 className="text-3xl font-bold mb-2">Warehouse Directory</h1>
          <p className="text-text-secondary">Manage storage nodes and facility locations.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} /> Add Node
        </Button>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-glass-border flex justify-between items-center bg-bg-elevated/30">
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md border border-glass-border w-[300px]">
            <Search size={18} className="text-text-muted" />
            <input 
              type="text" 
              placeholder="Search warehouses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-text-primary outline-none w-full text-sm"
            />
          </div>
          <div className="text-text-muted text-sm font-medium">
            Total: {filteredWarehouses.length} locations
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Spinner className="mx-auto mb-4" />
            <p className="text-text-muted">Loading network facilities...</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredWarehouses} keyField="warehouse_id" />
        )}
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Facility Name</label>
            <input type="text" name="warehouse_name" className="form-input" required value={formData.warehouse_name} onChange={handleInputChange} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Location (City)</label>
            <input type="text" name="location" className="form-input" required value={formData.location} onChange={handleInputChange} />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Maximum Capacity</label>
              <input type="number" min="0" name="capacity" className="form-input" required value={formData.capacity} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Data Region Node</label>
              <select name="region" className="form-input" value={formData.region} onChange={handleInputChange}>
                <option value="North">North DB</option>
                <option value="South">South DB</option>
                <option value="West">West DB</option>
                <option value="East">East DB</option>
                <option value="Central">Central DB</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save Facility'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
