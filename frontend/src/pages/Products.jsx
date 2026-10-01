import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import api from '../api/api';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Electronics',
    price: '',
    description: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.get('/distributed/products');
      setProducts(data.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        product_name: product.product_name,
        category: product.category,
        price: product.price,
        description: product.description
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        product_name: '',
        category: 'Electronics',
        price: '',
        description: ''
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
      if (currentProduct) {
        await api.put(`/distributed/products/${currentProduct.product_id}`, formData);
      } else {
        await api.post('/distributed/products', formData);
      }
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving product', err);
      alert('Failed to save product. See console for details.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/distributed/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product', err);
        alert('Failed to delete. The product might be referenced by inventory or orders.');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { accessor: 'product_id', header: 'ID', render: (row) => `#${row.product_id}` },
    { 
      accessor: 'product_name', 
      header: 'Product Details',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-accent-primary/10">
            <Package size={18} className="text-accent-primary" />
          </div>
          <div>
            <div className="font-semibold text-text-primary">{row.product_name}</div>
            <div className="text-xs text-text-muted">{row.description}</div>
          </div>
        </div>
      )
    },
    { 
      accessor: 'category', 
      header: 'Category',
      render: (row) => (
        <Badge variant="secondary">{row.category}</Badge>
      )
    },
    { 
      accessor: 'price', 
      header: 'Price (₹)',
      render: (row) => (
        <span className="font-medium">
          ₹{Number(row.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
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
          <Button variant="danger" onClick={() => handleDelete(row.product_id)} className="!p-2">
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
          <h1 className="text-3xl font-bold mb-2">Product Catalog</h1>
          <p className="text-text-secondary">Centralized product master data replicated across all nodes.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} /> Add Product
        </Button>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-glass-border flex justify-between items-center bg-bg-elevated/30">
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md border border-glass-border w-[300px]">
            <Search size={18} className="text-text-muted" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-text-primary outline-none w-full text-sm"
            />
          </div>
          <div className="text-text-muted text-sm font-medium">
            Total: {filteredProducts.length} items
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Spinner className="mx-auto mb-4" />
            <p className="text-text-muted">Loading global product catalog...</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredProducts} keyField="product_id" />
        )}
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentProduct ? 'Edit Product' : 'Add New Product'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Product Name</label>
            <input type="text" name="product_name" className="form-input" required value={formData.product_name} onChange={handleInputChange} />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Category</label>
              <select name="category" className="form-input" required value={formData.category} onChange={handleInputChange}>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Furniture">Furniture</option>
                <option value="Audio">Audio</option>
                <option value="Storage">Storage</option>
                <option value="Networking">Networking</option>
                <option value="Software">Software</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Price (₹)</label>
              <input type="number" step="0.01" min="0" name="price" className="form-input" required value={formData.price} onChange={handleInputChange} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Description</label>
            <textarea name="description" className="form-input" rows="3" required value={formData.description} onChange={handleInputChange}></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
