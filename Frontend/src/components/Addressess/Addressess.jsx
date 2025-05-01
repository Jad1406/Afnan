import React, { useState, useEffect } from 'react';
import './Addresses.css';

const Addresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Home',
      street: '123 Main Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
      isDefault: true
    },
    {
      id: '2',
      name: 'Work',
      street: '456 Market Avenue',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98102',
      country: 'USA',
      isDefault: false
    }
  ]);
  
  const [editAddress, setEditAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Empty form state
  const emptyAddress = {
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    isDefault: false
  };
  
  // Form state
  const [formData, setFormData] = useState(emptyAddress);
  
  useEffect(() => {
    // Simulate loading addresses
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleEdit = (address) => {
    setEditAddress(address.id);
    setFormData(address);
    setShowAddForm(false);
  };
  
  const handleDelete = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(address => address.id !== addressId));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editAddress) {
      // Update existing address
      setAddresses(prev => 
        prev.map(address => {
          // If setting this address as default, unset others
          if (formData.isDefault && address.id !== editAddress) {
            return { ...address, isDefault: false };
          }
          
          // Update the edited address
          if (address.id === editAddress) {
            return { ...formData, id: address.id };
          }
          
          return address;
        })
      );
      setEditAddress(null);
    } else {
      // Add new address
      const newAddress = {
        ...formData,
        id: Date.now().toString()
      };
      
      setAddresses(prev => {
        // If setting this address as default, unset others
        if (formData.isDefault) {
          return [...prev.map(a => ({ ...a, isDefault: false })), newAddress];
        }
        return [...prev, newAddress];
      });
      setShowAddForm(false);
    }
    
    // Reset form
    setFormData(emptyAddress);
  };
  
  const handleCancel = () => {
    setEditAddress(null);
    setShowAddForm(false);
    setFormData(emptyAddress);
  };
  
  if (isLoading) {
    return (
      <div className="addresses">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your addresses...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="addresses">
      <div className="section-header">
        <h2>Your Addresses</h2>
        <p>Manage delivery locations for your orders</p>
      </div>
      
      {addresses.length === 0 && !showAddForm && (
        <div className="empty-addresses">
          <div className="empty-addresses-message">
            <h3>No Addresses Saved</h3>
            <p>Add an address to make checkout faster.</p>
            <button 
              className="btn primary"
              onClick={() => setShowAddForm(true)}
            >
              Add New Address
            </button>
          </div>
        </div>
      )}
      
      {addresses.length > 0 && !showAddForm && !editAddress && (
        <>
          <div className="address-list">
            {addresses.map(address => (
              <div key={address.id} className="address-card">
                {address.isDefault && (
                  <span className="default-badge">Default</span>
                )}
                
                <h3>{address.name}</h3>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                
                <div className="address-actions">
                  <button 
                    className="btn outline"
                    onClick={() => handleEdit(address)}
                  >
                    Edit
                  </button>
                  
                  {!address.isDefault && (
                    <button 
                      className="btn danger"
                      onClick={() => handleDelete(address.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="addresses-actions">
            <button 
              className="btn primary"
              onClick={() => setShowAddForm(true)}
            >
              Add New Address
            </button>
          </div>
        </>
      )}
      
      {(showAddForm || editAddress) && (
        <div className="address-form-container">
          <h3>{editAddress ? 'Edit Address' : 'Add New Address'}</h3>
          
          <form onSubmit={handleSubmit} className="address-form">
            <div className="form-group">
              <label htmlFor="name">Address Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Home, Work, etc."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Street and number"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="Zip Code"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="USA">United States</option>
                  <option value="CAN">Canada</option>
                  <option value="MEX">Mexico</option>
                </select>
              </div>
            </div>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
              />
              <label htmlFor="isDefault">Set as default address</label>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn outline"
                onClick={handleCancel}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="btn primary"
              >
                {editAddress ? 'Save Changes' : 'Add Address'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Addresses;