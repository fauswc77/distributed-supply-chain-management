import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Layers } from 'lucide-react';
import api from '../api/api';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formData, setFormData] = useState({
    warehouse_id: '',
    product_id: '',
    quantity: '',
    region: 'North'
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await api.get('/distributed/inventory');
      setInventory(data.data);
    } catch (err) {
      console.error('Failed to fetch inventory', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (record = null) => {
    if (record) {
      setCurrentRecord(record);
      setFormData({
        warehouse_id: record.warehouse_id,
        product_id: record.product_id,
        quantity: record.quantity,
        region: record.region
      });
    } else {
      setCurrentRecord(null);
      setFormData({
        warehouse_id: '',
        product_id: '',
        quantity: '',
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
      if (currentRecord) {
        await api.put(`/distributed/inventory/${currentRecord.inventory_id}`, formData);
      } else {
        await api.post('/distributed/inventory', formData);
      }
      fetchInventory();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving inventory record', err);
      alert('Failed to save inventory record. See console for details.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory record?')) {
      try {
        await api.delete(`/distributed/inventory/${id}`);
        fetchInventory();
      } catch (err) {
        console.error('Error deleting inventory record', err);
        alert('Failed to delete.');
      }
    }
  };

  const filteredInventory = inventory.filter(i => 
    String(i.warehouse_id).includes(searchTerm) ||
    String(i.product_id).includes(searchTerm) ||
    i.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { accessor: 'inventory_id', header: 'Inventory ID', render: (row) => `#${row.inventory_id}` },
    { 
      accessor: 'product', 
      header: 'Product Reference',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-accent-success/10">
            <Layers size={18} className="text-accent-success" />
          </div>
          <div>
            <div className="font-semibold text-text-primary">Product #{row.product_id}</div>
          </div>
        </div>
      )
    },
    { 
      accessor: 'warehouse_id', 
      header: 'Warehouse Node',
      render: (row) => `Node #${row.warehouse_id}`
    },
    { 
      accessor: 'quantity', 
      header: 'Stock Quantity',
      render: (row) => (
        <span className={row.quantity < 50 ? 'text-accent-danger font-semibold' : 'text-text-primary'}>
          {Number(row.quantity).toLocaleString()} units
        </span>
      )
    },
    { 
      accessor: 'region', 
      header: 'Data Node',
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
          <Button variant="danger" onClick={() => handleDelete(row.inventory_id)} className="!p-2">
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
          <h1 className="text-3xl font-bold mb-2">Inventory Control</h1>
          <p className="text-text-secondary">Manage stock levels distributed across regional data nodes.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} /> Add Stock Record
        </Button>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-glass-border flex justify-between items-center bg-bg-elevated/30">
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md border border-glass-border w-[300px]">
            <Search size={18} className="text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by product or warehouse ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-text-primary outline-none w-full text-sm"
            />
          </div>
          <div className="text-text-muted text-sm font-medium">
            Total: {filteredInventory.length} records
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Spinner className="mx-auto mb-4" />
            <p className="text-text-muted">Loading distributed inventory...</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredInventory} keyField="inventory_id" />
        )}
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentRecord ? 'Edit Stock Record' : 'Add Stock Record'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Warehouse ID</label>
              <input type="number" name="warehouse_id" className="form-input" required value={formData.warehouse_id} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Product ID</label>
              <input type="number" name="product_id" className="form-input" required value={formData.product_id} onChange={handleInputChange} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Quantity</label>
              <input type="number" name="quantity" className="form-input" required value={formData.quantity} onChange={handleInputChange} />
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
              {formLoading ? 'Saving...' : 'Save Record'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
