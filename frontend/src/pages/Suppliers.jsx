import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Truck } from 'lucide-react';
import api from '../api/api';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [formData, setFormData] = useState({
    supplier_name: '',
    location: '',
    contact: '',
    email: '',
    rating: '',
    region: 'North'
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/distributed/suppliers');
      setSuppliers(data.data);
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setCurrentSupplier(supplier);
      setFormData({
        supplier_name: supplier.supplier_name,
        location: supplier.location,
        contact: supplier.contact,
        email: supplier.email,
        rating: supplier.rating,
        region: supplier.region
      });
    } else {
      setCurrentSupplier(null);
      setFormData({
        supplier_name: '',
        location: '',
        contact: '',
        email: '',
        rating: '',
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
      if (currentSupplier) {
        await api.put(`/distributed/suppliers/${currentSupplier.supplier_id}`, formData);
      } else {
        await api.post('/distributed/suppliers', formData);
      }
      fetchSuppliers();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving supplier', err);
      alert('Failed to save supplier. See console for details.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.delete(`/distributed/suppliers/${id}`);
        fetchSuppliers();
      } catch (err) {
        console.error('Error deleting supplier', err);
        alert('Failed to delete. The supplier might be referenced by other records.');
      }
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { accessor: 'supplier_id', header: 'ID', render: (row) => `#${row.supplier_id}` },
    { 
      accessor: 'supplier_name', 
      header: 'Supplier',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-accent-primary/10">
            <Truck size={18} className="text-accent-primary" />
          </div>
          <div>
            <div className="font-semibold text-text-primary">{row.supplier_name}</div>
            <div className="text-xs text-text-muted">{row.location}</div>
          </div>
        </div>
      )
    },
    { accessor: 'contact', header: 'Contact' },
    { accessor: 'email', header: 'Email' },
    { 
      accessor: 'rating', 
      header: 'Rating',
      render: (row) => (
        <span style={{ 
          color: row.rating >= 4.5 ? 'var(--accent-success)' : (row.rating >= 4.0 ? 'var(--accent-warning)' : 'var(--accent-danger)') 
        }}>
          ★ {row.rating}
        </span>
      )
    },
    { 
      accessor: 'region', 
      header: 'Region Node',
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
          <Button variant="danger" onClick={() => handleDelete(row.supplier_id)} className="!p-2">
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
          <h1 className="text-3xl font-bold mb-2">Supplier Management</h1>
          <p className="text-text-secondary">Manage supplier details across all distributed regions.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} /> Add Supplier
        </Button>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-glass-border flex justify-between items-center bg-bg-elevated/30">
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md border border-glass-border w-[300px]">
            <Search size={18} className="text-text-muted" />
            <input 
              type="text" 
              placeholder="Search suppliers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-text-primary outline-none w-full text-sm"
            />
          </div>
          <div className="text-text-muted text-sm font-medium">
            Total: {filteredSuppliers.length} suppliers
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Spinner className="mx-auto mb-4" />
            <p className="text-text-muted">Loading suppliers from all nodes...</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredSuppliers} keyField="supplier_id" />
        )}
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentSupplier ? 'Edit Supplier' : 'Add New Supplier'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Supplier Name</label>
            <input type="text" name="supplier_name" className="form-input" required value={formData.supplier_name} onChange={handleInputChange} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Location</label>
            <input type="text" name="location" className="form-input" required value={formData.location} onChange={handleInputChange} />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Contact</label>
              <input type="text" name="contact" className="form-input" required value={formData.contact} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Email</label>
              <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleInputChange} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Rating (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" name="rating" className="form-input" required value={formData.rating} onChange={handleInputChange} />
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
              <p className="text-xs text-accent-warning mt-1">* Dictates horizontal fragmentation placement.</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save Supplier'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
