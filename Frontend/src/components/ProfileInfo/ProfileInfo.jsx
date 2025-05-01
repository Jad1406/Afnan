import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import './ProfileInfo.css';

const ProfileInfo = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    // Password validation if changing password
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match.' });
        setLoading(false);
        return;
      }
      
      if (formData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
        setLoading(false);
        return;
      }
    }
    
    // Here you would typically call your API to update the user profile
    try {
      // Simulating API call with timeout
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditMode(false);
        setLoading(false);
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-info">
      <div className="section-header">
        <h2>Personal Information</h2>
        <p>Manage your personal details and account security</p>
      </div>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Account Details</h3>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </div>
        </div>
        
        {editMode && (
          <div className="form-section">
            <h3>Change Password</h3>
            <p className="form-hint">Leave blank to keep your current password</p>
            
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        )}
        
        <div className="form-actions">
          {!editMode ? (
            <button 
              type="button" 
              className="btn primary"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button 
                type="button" 
                className="btn outline"
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setMessage({ type: '', text: '' });
                }}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="btn primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </form>
      
      <div className="delete-account">
        <h3>Delete Account</h3>
        <p>This action is permanent and cannot be undone.</p>
        <button className="btn danger">Delete Account</button>
      </div>
    </div>
  );
};

export default ProfileInfo;