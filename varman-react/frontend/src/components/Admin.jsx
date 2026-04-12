import React, { useState, useEffect } from 'react';
import { VarmanSite } from '../VarmanSite';
import { Icon } from '../Icon';
function Admin() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [token, setToken] = React.useState(localStorage.getItem('adminToken') || '');
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [stats, setStats] = React.useState({});
  const [products, setProducts] = React.useState([]);
  const [faqs, setFaqs] = React.useState([]);
  const [contacts, setContacts] = React.useState([]);
  const [quotes, setQuotes] = React.useState([]);
  // New Analytics & Security State
  const [analytics, setAnalytics] = React.useState({ views: 0, clicks: {}, history: [] });
  const [securityLogs, setSecurityLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  
  // Login form state
  const [loginForm, setLoginForm] = React.useState({ username: '', password: '' });
  
  // Modal states
  const [showAddProduct, setShowAddProduct] = React.useState(false);
  const [showEditProduct, setShowEditProduct] = React.useState(false);
  const [showAddFaq, setShowAddFaq] = React.useState(false);
  const [showEditFaq, setShowEditFaq] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(null);
  const [showImageGallery, setShowImageGallery] = React.useState(false);
  
  // Form states
  const [productForm, setProductForm] = React.useState({
    id: '', name: '', description: '', unit: '', image: '', icon: 'box',
    specifications: '', uses: '', advantages: ''
  });
  const [faqForm, setFaqForm] = React.useState({ question: '', answer: '', category: 'general' });
  const [editingId, setEditingId] = React.useState(null);
  
  // Image upload states
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [galleryImages, setGalleryImages] = React.useState([]);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const API_BASE = '';

  // Show success message
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Check token on mount
  React.useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setIsLoggedIn(true);
        fetchDashboardData();
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        fetchDashboardData(data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setIsLoggedIn(false);
    localStorage.removeItem('adminToken');
  };

  const fetchDashboardData = async (overrideToken) => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${overrideToken || token}` };
      
      const [statsRes, productsRes, faqsRes, contactsRes, quotesRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/stats`, { headers }),
        fetch(`${API_BASE}/api/admin/products`, { headers }),
        fetch(`${API_BASE}/api/admin/faqs`, { headers }),
        fetch(`${API_BASE}/api/admin/contacts`, { headers }),
        fetch(`${API_BASE}/api/admin/quotes`, { headers })
      ]);
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
        if (statsData.analytics) setAnalytics(statsData.analytics);
        if (statsData.securityEvents) setSecurityLogs(statsData.securityEvents);
      }
      if (productsRes.ok) setProducts((await productsRes.json()).products || []);
      if (faqsRes.ok) setFaqs((await faqsRes.json()).faqs || []);
      if (contactsRes.ok) setContacts((await contactsRes.json()).contacts || []);
      if (quotesRes.ok) setQuotes((await quotesRes.json()).quotes || []);
      
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ============ PRODUCT CRUD ============
  
  const resetProductForm = () => {
    setProductForm({
      id: '', name: '', description: '', unit: '', image: '', icon: 'box',
      specifications: '', uses: '', advantages: ''
    });
    setEditingId(null);
  };

  const handleAddProduct = async () => {
    if (!productForm.id || !productForm.name) {
      setError('Product ID and Name are required');
      return;
    }
    
    try {
      const productData = {
        ...productForm,
        specifications: productForm.specifications.split('\n').filter(s => s.trim()),
        uses: productForm.uses.split('\n').filter(s => s.trim()),
        advantages: productForm.advantages.split('\n').filter(s => s.trim())
      };
      
      const response = await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        showSuccess('Product added successfully!');
        setShowAddProduct(false);
        resetProductForm();
        fetchDashboardData();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add product');
      }
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const openEditProduct = (product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      unit: product.unit || '',
      image: product.image || '',
      icon: product.icon || 'box',
      specifications: (product.specifications || []).join('\n'),
      uses: (product.uses || []).join('\n'),
      advantages: (product.advantages || []).join('\n')
    });
    setEditingId(product.id);
    setShowEditProduct(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        unit: productForm.unit,
        image: productForm.image,
        icon: productForm.icon,
        specifications: productForm.specifications.split('\n').filter(s => s.trim()),
        uses: productForm.uses.split('\n').filter(s => s.trim()),
        advantages: productForm.advantages.split('\n').filter(s => s.trim())
      };
      
      const response = await fetch(`${API_BASE}/api/admin/products/${editingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        showSuccess('Product updated successfully!');
        setShowEditProduct(false);
        resetProductForm();
        fetchDashboardData();
      } else {
        setError('Failed to update product');
      }
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const toggleProductActive = async (productId) => {
    const product = products.find(p => p.id === productId);
    try {
      await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ active: !product.active })
      });
      fetchDashboardData();
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        showSuccess('Product deleted successfully!');
        setConfirmDelete(null);
        fetchDashboardData();
      }
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  // ============ FAQ CRUD ============
  
  const resetFaqForm = () => {
    setFaqForm({ question: '', answer: '', category: 'general' });
    setEditingId(null);
  };

  const handleAddFaq = async () => {
    if (!faqForm.question || !faqForm.answer) {
      setError('Question and Answer are required');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/faqs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(faqForm)
      });
      
      if (response.ok) {
        showSuccess('FAQ added successfully!');
        setShowAddFaq(false);
        resetFaqForm();
        fetchDashboardData();
      }
    } catch (err) {
      setError('Failed to add FAQ');
    }
  };

  const openEditFaq = (faq) => {
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'general'
    });
    setEditingId(faq.id);
    setShowEditFaq(true);
  };

  const handleUpdateFaq = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/faqs/${editingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(faqForm)
      });
      
      if (response.ok) {
        showSuccess('FAQ updated successfully!');
        setShowEditFaq(false);
        resetFaqForm();
        fetchDashboardData();
      }
    } catch (err) {
      setError('Failed to update FAQ');
    }
  };

  const toggleFaqActive = async (faqId) => {
    const faq = faqs.find(f => f.id === faqId);
    try {
      await fetch(`${API_BASE}/api/admin/faqs/${faqId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ active: !faq.active })
      });
      fetchDashboardData();
    } catch (err) {
      setError('Failed to update FAQ');
    }
  };

  const handleDeleteFaq = async (faqId) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/faqs/${faqId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        showSuccess('FAQ deleted successfully!');
        setConfirmDelete(null);
        fetchDashboardData();
      }
    } catch (err) {
      setError('Failed to delete FAQ');
    }
  };

  // ============ CONTACTS ============
  
  const markContactRead = async (contactId) => {
    try {
      await fetch(`${API_BASE}/api/admin/contacts/${contactId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ read: true })
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to mark contact as read');
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await fetch(`${API_BASE}/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showSuccess('Contact deleted!');
      setConfirmDelete(null);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to delete contact');
    }
  };

  // ============ QUOTES ============
  
  const updateQuoteStatus = async (quoteId, status) => {
    try {
      await fetch(`${API_BASE}/api/admin/quotes/${quoteId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      fetchDashboardData();
    } catch (err) {
      setError('Failed to update quote');
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    try {
      await fetch(`${API_BASE}/api/admin/quotes/${quoteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showSuccess('Quote deleted!');
      setConfirmDelete(null);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to delete quote');
    }
  };

  // ============ IMAGE UPLOAD ============
  
  const fetchGalleryImages = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/images`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setGalleryImages(data.images || []);
      }
    } catch (err) {
      console.error('Failed to fetch images');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleImageFile = async (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Upload file
    setUploadingImage(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProductForm({...productForm, image: data.path});
        showSuccess('Image uploaded successfully!');
        fetchGalleryImages();
      } else {
        setError(data.error || 'Failed to upload image');
        setImagePreview(null);
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (filename) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/upload/${filename}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        showSuccess('Image deleted!');
        fetchGalleryImages();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete image');
      }
    } catch (err) {
      setError('Failed to delete image');
    }
  };

  const selectFromGallery = (imagePath) => {
    setProductForm({...productForm, image: imagePath});
    setImagePreview(null);
    setShowImageGallery(false);
    showSuccess('Image selected!');
  };

  const openImageGallery = () => {
    fetchGalleryImages();
    setShowImageGallery(true);
  };

  // ============ RENDER MODALS ============
  
  const renderModal = (title, onClose, children) => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--border-color)]">
        <div className="sticky top-0 bg-card border-b border-[var(--border-color)] p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-white text-2xl">&times;</button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );

  const renderProductForm = (isEdit = false) => (
    <div className="space-y-4">
      {!isEdit && (
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1">Product ID (unique, lowercase)</label>
          <input
            type="text"
            value={productForm.id}
            onChange={(e) => setProductForm({...productForm, id: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
            className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
            placeholder="e.g., river_sand"
          />
        </div>
      )}
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1">Product Name *</label>
        <input
          type="text"
          value={productForm.name}
          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
          className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
          placeholder="e.g., River Sand"
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1">Description</label>
        <textarea
          value={productForm.description}
          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
          className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
          rows="3"
          placeholder="Product description..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1">Unit</label>
          <input
            type="text"
            value={productForm.unit}
            onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
            className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
            placeholder="e.g., per cubic meter"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1">Icon</label>
          <select
            value={productForm.icon}
            onChange={(e) => setProductForm({...productForm, icon: e.target.value})}
            className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
          >
            <option value="box">Box</option>
            <option value="layers">Layers</option>
            <option value="droplets">Droplets</option>
            <option value="zap">Zap</option>
            <option value="home">Home</option>
            <option value="leaf">Leaf</option>
            <option value="square">Square</option>
            <option value="package">Package</option>
            <option value="mountain">Mountain</option>
          </select>
        </div>
      </div>
      
      {/* Image Upload Section */}
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-2">Product Image</label>
        
        {/* Current Image Preview */}
        {(productForm.image || imagePreview) && (
          <div className="mb-3 relative inline-block">
            <img 
              src={imagePreview || productForm.image} 
              alt="Product preview" 
              className="w-32 h-32 object-cover rounded-lg border-2 border-[var(--primary-color)]"
              onError={(e) => e.target.src = '/assets/logo.png'}
            />
            <button
              type="button"
              onClick={() => {
                setProductForm({...productForm, image: ''});
                setImagePreview(null);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Drag & Drop Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10' 
              : 'border-[var(--border-color)] hover:border-[var(--primary-color)] hover:bg-[var(--background-secondary)]'
          } ${uploadingImage ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          {uploadingImage ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-[var(--text-secondary)]">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2">📷</div>
              <p className="text-[var(--text-primary)] font-medium">
                {dragActive ? 'Drop image here' : 'Click or drag image to upload'}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                JPEG, PNG, WebP, GIF • Max 5MB
              </p>
            </>
          )}
        </div>
        
        {/* Gallery Button */}
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={openImageGallery}
            className="flex-1 py-2 px-4 bg-[var(--background-secondary)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--primary-color)] hover:text-white transition-colors text-sm"
          >
            📁 Browse Gallery
          </button>
          <input
            type="text"
            value={productForm.image}
            onChange={(e) => setProductForm({...productForm, image: e.target.value})}
            className="flex-1 px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm"
            placeholder="Or enter path: ./assets/image.webp"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1">Specifications (one per line)</label>
        <textarea
          value={productForm.specifications}
          onChange={(e) => setProductForm({...productForm, specifications: e.target.value})}
          className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
          rows="3"
          placeholder="Size: 9x4x3 inches&#10;Weight: 2.5 kg&#10;Strength: >7.5 N/mm²"
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1">Uses (one per line)</label>
        <textarea
          value={productForm.uses}
          onChange={(e) => setProductForm({...productForm, uses: e.target.value})}
          className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
          rows="3"
          placeholder="Wall construction&#10;Foundation work&#10;Flooring"
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1">Advantages (one per line)</label>
        <textarea
          value={productForm.advantages}
          onChange={(e) => setProductForm({...productForm, advantages: e.target.value})}
          className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
          rows="3"
          placeholder="High durability&#10;Cost effective&#10;Eco-friendly"
        />
      </div>
      <div className="flex gap-2 pt-4">
        <button
          onClick={isEdit ? handleUpdateProduct : handleAddProduct}
          className="flex-1 py-2 bg-[var(--primary-color)] text-white rounded-lg font-medium hover:bg-[var(--secondary-color)]"
        >
          {isEdit ? 'Update Product' : 'Add Product'}
        </button>
        <button
          onClick={() => { isEdit ? setShowEditProduct(false) : setShowAddProduct(false); resetProductForm(); }}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderFaqForm = (isEdit = false) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1">Question *</label>
        <input
          type="text"
          value={faqForm.question}
          onChange={(e) => setFaqForm({...faqForm, question: e.target.value})}
          className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
          placeholder="What is your question?"
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1">Answer *</label>
        <textarea
          value={faqForm.answer}
          onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})}
          className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
          rows="4"
          placeholder="Provide a detailed answer..."
        />
      </div>
      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1">Category</label>
        <select
          value={faqForm.category}
          onChange={(e) => setFaqForm({...faqForm, category: e.target.value})}
          className="w-full px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
        >
          <option value="general">General</option>
          <option value="delivery">Delivery</option>
          <option value="payment">Payment</option>
          <option value="orders">Orders</option>
          <option value="quality">Quality</option>
          <option value="pricing">Pricing</option>
        </select>
      </div>
      <div className="flex gap-2 pt-4">
        <button
          onClick={isEdit ? handleUpdateFaq : handleAddFaq}
          className="flex-1 py-2 bg-[var(--primary-color)] text-white rounded-lg font-medium hover:bg-[var(--secondary-color)]"
        >
          {isEdit ? 'Update FAQ' : 'Add FAQ'}
        </button>
        <button
          onClick={() => { isEdit ? setShowEditFaq(false) : setShowAddFaq(false); resetFaqForm(); }}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderConfirmDelete = () => confirmDelete && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 max-w-md w-full border border-red-500">
        <h3 className="text-lg font-bold text-red-500 mb-4">⚠️ Confirm Delete</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          Are you sure you want to delete this {confirmDelete.type}? This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirmDelete.type === 'product') handleDeleteProduct(confirmDelete.id);
              else if (confirmDelete.type === 'faq') handleDeleteFaq(confirmDelete.id);
              else if (confirmDelete.type === 'contact') handleDeleteContact(confirmDelete.id);
              else if (confirmDelete.type === 'quote') handleDeleteQuote(confirmDelete.id);
            }}
            className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => setConfirmDelete(null)}
            className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderImageGallery = () => showImageGallery && (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden border border-[var(--border-color)]">
        <div className="sticky top-0 bg-card border-b border-[var(--border-color)] p-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">📁 Image Gallery</h3>
            <p className="text-sm text-[var(--text-muted)]">{galleryImages.length} images in assets folder</p>
          </div>
          <button 
            onClick={() => setShowImageGallery(false)} 
            className="text-[var(--text-secondary)] hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
          {galleryImages.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              <div className="text-5xl mb-4">🖼️</div>
              <p>No images found in the assets folder</p>
              <p className="text-sm text-[var(--text-muted)] mt-2">Upload images using the product form</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {galleryImages.map((img, index) => (
                <div 
                  key={index} 
                  className="group relative bg-[var(--background-secondary)] rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-[var(--primary-color)] transition-all"
                >
                  <img
                    src={img.path}
                    alt={img.filename}
                    className="w-full h-32 object-cover cursor-pointer"
                    onClick={() => selectFromGallery(img.path)}
                    onError={(e) => e.target.src = '/assets/logo.png'}
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => selectFromGallery(img.path)}
                      className="px-3 py-1 bg-[var(--primary-color)] text-white rounded text-sm hover:bg-[var(--secondary-color)]"
                    >
                      Select
                    </button>
                    {/* Only show delete for user-uploaded images (containing underscore + hex) */}
                    {img.filename.match(/_[a-f0-9]{16}\./i) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(img.filename);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  
                  {/* Filename */}
                  <div className="p-2">
                    <p className="text-xs text-[var(--text-secondary)] truncate" title={img.filename}>
                      {img.filename}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {(img.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ============ LOGIN FORM ============
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-xl shadow-2xl w-full max-w-md border border-[var(--border-color)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Login</h1>
            <p className="text-[var(--text-secondary)] mt-2">Varman Constructions Dashboard</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-4 py-3 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-3 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--primary-color)] text-white font-semibold rounded-lg hover:bg-[var(--secondary-color)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-[var(--background-secondary)] rounded-lg">
            <p className="text-sm text-[var(--text-muted)] text-center">
              <strong>Default credentials:</strong><br />
              Username: admin | Password: varman@2024
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============ ADMIN DASHBOARD ============
  
  return (
    <div className="min-h-screen bg-[var(--background-primary)]">
      {/* Modals */}
      {showAddProduct && renderModal('Add New Product', () => { setShowAddProduct(false); resetProductForm(); setImagePreview(null); }, renderProductForm(false))}
      {showEditProduct && renderModal('Edit Product', () => { setShowEditProduct(false); resetProductForm(); setImagePreview(null); }, renderProductForm(true))}
      {showAddFaq && renderModal('Add New FAQ', () => { setShowAddFaq(false); resetFaqForm(); }, renderFaqForm(false))}
      {showEditFaq && renderModal('Edit FAQ', () => { setShowEditFaq(false); resetFaqForm(); }, renderFaqForm(true))}
      {renderConfirmDelete()}
      {renderImageGallery()}
      
      {/* Success/Error Messages */}
      {successMsg && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          ✓ {successMsg}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          ✕ {error}
          <button onClick={() => setError('')} className="ml-4 font-bold">×</button>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-card border-b border-[var(--border-color)] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <img src="/assets/logo.png" alt="Logo" className="h-10" />
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
              <p className="text-xs text-[var(--text-muted)]">Data persisted to JSON file (localStorage style)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]">← Back to Site</a>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['dashboard', 'products', 'faqs', 'contacts', 'quotes'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab 
                  ? 'bg-[var(--primary-color)] text-white' 
                  : 'bg-card text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] border border-[var(--border-color)]'
              }`}
            >
              {tab}
              {tab === 'contacts' && stats.unreadContacts > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.unreadContacts}</span>
              )}
              {tab === 'quotes' && stats.pendingQuotes > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.pendingQuotes}</span>
              )}
            </button>
          ))}
          
           {/* Security Tab (Manual Add) */}
           <button
             onClick={() => setActiveTab('security')}
             className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors flex items-center ${
               activeTab === 'security' 
                 ? 'bg-red-700 text-white border border-red-500' 
                 : 'bg-card text-gray-300 hover:bg-red-900/40 border border-gray-700'
             }`}
           >
             <span className="mr-2">🛡️</span> Security
           </button>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-[var(--primary-color)] hover:text-white border border-[var(--border-color)] ml-auto"
          >
            {loading ? '⟳ Loading...' : '⟳ Refresh'}
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-xl border border-[var(--border-color)]">
              <div className="text-3xl font-bold text-[var(--primary-color)]">{stats.products || 0}</div>
              <div className="text-[var(--text-secondary)]">Active Products</div>
              <div className="text-xs text-[var(--text-muted)]">{stats.totalProducts || 0} total</div>
            </div>
            <div className="bg-card p-6 rounded-xl border border-[var(--border-color)]">
              <div className="text-3xl font-bold text-[var(--primary-color)]">{stats.faqs || 0}</div>
              <div className="text-[var(--text-secondary)]">Active FAQs</div>
              <div className="text-xs text-[var(--text-muted)]">{stats.totalFaqs || 0} total</div>
            </div>
            <div className="bg-card p-6 rounded-xl border border-[var(--border-color)]">
              <div className="text-3xl font-bold text-orange-500">{stats.pendingQuotes || 0}</div>
              <div className="text-[var(--text-secondary)]">Pending Quotes</div>
              <div className="text-xs text-[var(--text-muted)]">{stats.totalQuotes || 0} total</div>
            </div>
            <div className="bg-card p-6 rounded-xl border border-[var(--border-color)]">
              <div className="text-3xl font-bold text-green-500">{stats.unreadContacts || 0}</div>
              <div className="text-[var(--text-secondary)]">Unread Contacts</div>
              <div className="text-xs text-[var(--text-muted)]">{stats.totalContacts || 0} total</div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-card rounded-xl border border-[var(--border-color)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Manage Products ({products.length})
              </h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg text-sm hover:bg-[var(--secondary-color)]"
              >
                + Add Product
              </button>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {products.map(product => (
                <div key={product.id} className={`p-4 flex items-center justify-between ${!product.active ? 'opacity-50 bg-gray-900/30' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-gray-800" onError={(e) => e.target.src = '/assets/logo.png'} />
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{product.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">ID: {product.id} | Unit: {product.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditProduct(product)}
                      className="px-3 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleProductActive(product.id)}
                      className={`px-3 py-1 rounded text-sm ${product.active ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
                    >
                      {product.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ type: 'product', id: product.id })}
                      className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div className="bg-card rounded-xl border border-[var(--border-color)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Manage FAQs ({faqs.length})
              </h2>
              <button
                onClick={() => setShowAddFaq(true)}
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg text-sm hover:bg-[var(--secondary-color)]"
              >
                + Add FAQ
              </button>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {faqs.map(faq => (
                <div key={faq.id} className={`p-4 ${!faq.active ? 'opacity-50 bg-gray-900/30' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 bg-[var(--primary-color)]/20 text-[var(--primary-color)] rounded">{faq.category}</span>
                      </div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{faq.question}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => openEditFaq(faq)}
                        className="px-3 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleFaqActive(faq.id)}
                        className={`px-3 py-1 rounded text-sm ${faq.active ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
                      >
                        {faq.active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete({ type: 'faq', id: faq.id })}
                        className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-card rounded-xl border border-[var(--border-color)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Contact Submissions ({contacts.length})
              </h2>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {contacts.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)]">No contact submissions yet</div>
              ) : (
                contacts.map(contact => (
                  <div key={contact.id} className={`p-4 ${!contact.read ? 'bg-green-500/5 border-l-4 border-l-green-500' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--text-primary)]">{contact.name}</h3>
                          {!contact.read && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">NEW</span>}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">{contact.email} • {contact.phone}</p>
                        <p className="text-sm text-[var(--primary-color)] mt-1">Material: {contact.material}</p>
                        <p className="text-[var(--text-primary)] mt-2 bg-[var(--background-secondary)] p-3 rounded-lg">{contact.message}</p>
                        {contact.project_location && (
                          <p className="text-sm text-[var(--text-muted)] mt-1">📍 {contact.project_location}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="text-xs text-[var(--text-muted)]">
                          {new Date(contact.created_at).toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          {!contact.read && (
                            <button
                              onClick={() => markContactRead(contact.id)}
                              className="px-3 py-1 rounded text-sm bg-green-500 text-white hover:bg-green-600"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmDelete({ type: 'contact', id: contact.id })}
                            className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div className="bg-card rounded-xl border border-[var(--border-color)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Quote Requests ({quotes.length})
              </h2>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {quotes.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)]">No quote requests yet</div>
              ) : (
                quotes.map(quote => (
                  <div key={quote.id} className={`p-4 ${quote.status === 'pending' ? 'bg-orange-500/5 border-l-4 border-l-orange-500' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--text-primary)]">{quote.name}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{quote.email} • {quote.phone}</p>
                        <p className="text-[var(--primary-color)] font-medium mt-2">
                          Materials: {quote.materials.join(', ')}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)]">Quantity: {quote.quantity}</p>
                        <p className="text-sm text-[var(--text-secondary)]">Timeline: {quote.timeline}</p>
                        {quote.project_details && (
                          <p className="text-[var(--text-primary)] mt-2 bg-[var(--background-secondary)] p-3 rounded-lg">{quote.project_details}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <select
                          value={quote.status}
                          onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                          className={`px-3 py-1 rounded text-sm text-white ${
                            quote.status === 'pending' ? 'bg-orange-500' :
                            quote.status === 'contacted' ? 'bg-blue-500' :
                            quote.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="text-xs text-[var(--text-muted)]">
                          {new Date(quote.created_at).toLocaleString()}
                        </div>
                        <button
                          onClick={() => setConfirmDelete({ type: 'quote', id: quote.id })}
                          className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========= SECURITY & ANALYTICS TAB ========= */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="mr-2">🛡️</span> Level 5 Ethical Security Firewall & SEO Analytics
            </h2>
            
            {/* Analytics Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card p-6 rounded-lg border border-gray-700">
                <h3 className="text-gray-400 mb-2">Total Page Views</h3>
                <p className="text-3xl font-bold text-green-400">{analytics.views}</p>
                <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border border-gray-700">
                <h3 className="text-gray-400 mb-2">Unauthorized Attempts Blocked</h3>
                <p className="text-3xl font-bold text-red-500">{securityLogs.length}</p>
                 <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                   <div className="h-full bg-red-600 fire-anim" style={{ width: '100%' }}></div>
                </div>
              </div>
               <div className="bg-card p-6 rounded-lg border border-gray-700">
                <h3 className="text-gray-400 mb-2">Active Firewall Status</h3>
                <p className="text-3xl font-bold text-blue-400">ACTIVE</p>
                <p className="text-sm text-gray-500 mt-2">Monitoring IPs & Geo-Location</p>
              </div>
            </div>

            {/* Click Visualization */}
             <div className="bg-card p-6 rounded-lg border border-gray-700 mb-8">
              <h3 className="text-xl font-bold mb-4">User Engagement Heatmap (Clicks)</h3>
              <div className="space-y-4">
                {Object.entries(analytics.clicks || {}).map(([element, count]) => (
                  <div key={element} className="flex items-center">
                    <span className="w-48 text-gray-300 truncate" title={element}>{element}</span>
                    <div className="flex-1 mx-4 h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500" 
                        style={{ width: `${Math.min((count / analytics.views) * 100 * 5, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 w-12 text-right">{count}</span>
                  </div>
                ))}
                {(!analytics.clicks || Object.keys(analytics.clicks).length === 0) && (
                   <p className="text-gray-500">No interaction data yet.</p>
                )}
              </div>
            </div>

            {/* Security Logs Table */}
            <div className="bg-card p-6 rounded-lg border border-red-900/30">
              <h3 className="text-xl font-bold mb-4 text-red-400">🚨 Intrusion Detection Logs (Honeypot)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400">
                      <th className="p-3">Time</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Threat Type</th>
                      <th className="p-3">User Agent</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityLogs.length > 0 ? (
                      securityLogs.slice().reverse().map((log) => (
                        <tr key={log.id} className="border-b border-gray-800 hover:bg-red-900/10">
                          <td className="p-3 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="p-3 font-mono text-red-300">{log.ip}</td>
                          <td className="p-3 badge"><span className="bg-red-900 text-red-200 px-2 py-1 rounded text-xs">{log.type}</span></td>
                          <td className="p-3 text-xs text-gray-500 max-w-xs truncate" title={log.userAgent}>{log.userAgent}</td>
                          <td className="p-3 text-green-400 font-bold text-xs">BLOCKED</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-gray-500">System Secure. No threats detected.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
