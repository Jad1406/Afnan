import axios from 'axios';
import { useAuth } from '../components/Auth/AuthContext';
import React, { useState, useEffect } from 'react';
import './Tracker.css';

const Tracker = () => {
  const [myPlants, setMyPlants] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    nickname: '',
    species: '',
    location: '',
    wateringFrequency: 7,
    fertilizingFrequency: 30,
    lastWatered: new Date().toISOString().split('T')[0],
    lastFertilized: new Date().toISOString().split('T')[0]
  });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/v1/tracker', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const validPlants = res.data.filter(p => p && typeof p === 'object');
        setMyPlants(validPlants);
      } catch (err) {
        console.error('Error fetching plants:', err);
      }
    };
    if (isAuthenticated) fetchPlants();
  }, [isAuthenticated]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDaysSince = (date) => {
    if (!date) return 0;
    const today = new Date();
    const past = new Date(date);
    return Math.ceil((today - past) / (1000 * 60 * 60 * 24));
  };

  const needsWatering = (plant) => {
    if (!plant || !plant.lastWatered) return false;
    return getDaysSince(plant.lastWatered) >= (plant.wateringFrequency || 7);
  };

  const needsFertilizing = (plant) => {
    if (!plant || !plant.lastFertilized) return false;
    return getDaysSince(plant.lastFertilized) >= (plant.fertilizingFrequency || 30);
  };

  const updatePlant = async (plantId, data) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`http://localhost:3000/api/v1/tracker/${plantId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyPlants(prevPlants => 
        prevPlants.map(p => p && p._id === plantId ? res.data : p)
      );
    } catch (err) {
      console.error("Error updating plant:", err);
      alert('Failed to update plant. Please try again.');
    }
  };

  const logWatering = async (id) => {
    const confirmed = window.confirm('Mark this plant as watered?');
    if (confirmed) {
      await updatePlant(id, { lastWatered: new Date().toISOString().split('T')[0] });
    }
  };

  const logFertilizing = async (id) => {
    const confirmed = window.confirm('Mark this plant as fertilized?');
    if (confirmed) {
      await updatePlant(id, { lastFertilized: new Date().toISOString().split('T')[0] });
    }
  };

  const handleEditClick = (plant) => {
    setEditingPlant({ ...plant });
    setShowEditModal(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editingPlant || !editingPlant._id) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Create update object with all fields
      const updateData = {
        name: editingPlant.name,
        nickname: editingPlant.nickname,
        species: editingPlant.species,
        location: editingPlant.location,
        wateringFrequency: parseInt(editingPlant.wateringFrequency) || 7,
        fertilizingFrequency: parseInt(editingPlant.fertilizingFrequency) || 30,
        lastWatered: editingPlant.lastWatered,
        lastFertilized: editingPlant.lastFertilized
      };

      const res = await axios.put(
        `http://localhost:3000/api/v1/tracker/${editingPlant._id}`, 
        updateData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the local state with the response from the server
      setMyPlants(prevPlants =>
        prevPlants.map(p => p._id === editingPlant._id ? res.data : p)
      );
      
      setShowEditModal(false);
      setEditingPlant(null);
      
      // Optional: Show success message
      alert('Plant updated successfully!');
    } catch (err) {
      console.error("Error updating plant:", err);
      alert('Failed to update plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlant = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/v1/tracker', newPlant, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMyPlants(prevPlants => [...prevPlants, res.data]);
      setShowAddModal(false);
      
      // Reset form
      setNewPlant({
        name: '',
        nickname: '',
        species: '',
        location: '',
        wateringFrequency: 7,
        fertilizingFrequency: 30,
        lastWatered: new Date().toISOString().split('T')[0],
        lastFertilized: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error("Error adding plant:", err);
      alert('Failed to add plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingPlant(null);
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewPlant({
      name: '',
      nickname: '',
      species: '',
      location: '',
      wateringFrequency: 7,
      fertilizingFrequency: 30,
      lastWatered: new Date().toISOString().split('T')[0],
      lastFertilized: new Date().toISOString().split('T')[0]
    });
  };

  // Stats
  const total = myPlants.length;
  const watering = myPlants.filter(plant => plant && needsWatering(plant)).length;
  const upcoming = 0;

  return (
    <div className="tracker-page">
      {/* STATS ROW */}
      <div className="tracker-stats">
        <div className="stat-card">
          <div className="stat-icon">🌿</div>
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Plants</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-icon">💧</div>
          <div className="stat-value">{watering}</div>
          <div className="stat-label">Need Watering</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-value">{upcoming}</div>
          <div className="stat-label">Upcoming</div>
        </div>
      </div>

      {/* LIST VIEW */}
      <div className="plants-table-wrapper">
        <table className="plants-table">
          <thead>
            <tr>
              <th>Plant</th>
              <th>Location</th>
              <th>Last Watered</th>
              <th>Last Fertilized</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myPlants.map((plant) => {
              if (!plant || !plant._id) return null;
              
              const wateredAgo = plant.lastWatered ? getDaysSince(plant.lastWatered) : null;
              const fertilizedAgo = plant.lastFertilized ? getDaysSince(plant.lastFertilized) : null;

              return (
                <tr key={plant._id} className={needsWatering(plant) ? 'highlight-row' : ''}>
                  <td>
                    <strong>{plant.name || 'Unnamed Plant'}</strong>
                    {plant.nickname && <div className="nickname">"{plant.nickname}"</div>}
                  </td>
                  <td>{plant.location || 'Unknown'}</td>
                  <td>
                    {formatDate(plant.lastWatered)}
                    {wateredAgo !== null && <div className="days-ago">({wateredAgo} days ago)</div>}
                    {needsWatering(plant) && <span className="badge water">💧</span>}
                  </td>
                  <td>
                    {formatDate(plant.lastFertilized)}
                    {fertilizedAgo !== null && <div className="days-ago">({fertilizedAgo} days ago)</div>}
                    {needsFertilizing(plant) && <span className="badge fertilizer">🌱</span>}
                  </td>
                  <td>
                    <button className="btn water" onClick={() => logWatering(plant._id)}>Water</button>
                    <button className="btn fertilize" onClick={() => logFertilizing(plant._id)}>Fertilize</button>
                    <button className="btn edit" onClick={() => handleEditClick(plant)}>Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Plant Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Plant</h2>
            <form onSubmit={handleAddPlant}>
              <div className="form-group">
                <label>Plant Name</label>
                <input
                  type="text"
                  value={newPlant.name}
                  onChange={(e) => setNewPlant({...newPlant, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nickname</label>
                <input
                  type="text"
                  value={newPlant.nickname}
                  onChange={(e) => setNewPlant({...newPlant, nickname: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Species</label>
                <input
                  type="text"
                  value={newPlant.species}
                  onChange={(e) => setNewPlant({...newPlant, species: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newPlant.location}
                  onChange={(e) => setNewPlant({...newPlant, location: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Watering Frequency (days)</label>
                <input
                  type="number"
                  value={newPlant.wateringFrequency}
                  onChange={(e) => setNewPlant({...newPlant, wateringFrequency: parseInt(e.target.value) || 7})}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Fertilizing Frequency (days)</label>
                <input
                  type="number"
                  value={newPlant.fertilizingFrequency}
                  onChange={(e) => setNewPlant({...newPlant, fertilizingFrequency: parseInt(e.target.value) || 30})}
                  required
                  min="1"
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn cancel" 
                  onClick={handleCancelAdd}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn save"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Plant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Plant Modal */}
       {/* Edit Plant Modal */}
      {showEditModal && editingPlant && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Plant</h2>
            <form onSubmit={handleEditSave}>
              <div className="form-group">
                <label>Plant Name</label>
                <input
                  type="text"
                  value={editingPlant.name || ''}
                  onChange={(e) => setEditingPlant({...editingPlant, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nickname</label>
                <input
                  type="text"
                  value={editingPlant.nickname || ''}
                  onChange={(e) => setEditingPlant({...editingPlant, nickname: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Species</label>
                <input
                  type="text"
                  value={editingPlant.species || ''}
                  onChange={(e) => setEditingPlant({...editingPlant, species: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={editingPlant.location || ''}
                  onChange={(e) => setEditingPlant({...editingPlant, location: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Watering Frequency (days)</label>
                <input
                  type="number"
                  value={editingPlant.wateringFrequency || 7}
                  onChange={(e) => setEditingPlant({...editingPlant, wateringFrequency: parseInt(e.target.value) || 7})}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Fertilizing Frequency (days)</label>
                <input
                  type="number"
                  value={editingPlant.fertilizingFrequency || 30}
                  onChange={(e) => setEditingPlant({...editingPlant, fertilizingFrequency: parseInt(e.target.value) || 30})}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Last Watered</label>
                <input
                  type="date"
                  value={editingPlant.lastWatered ? editingPlant.lastWatered.split('T')[0] : ''}
                  onChange={(e) => setEditingPlant({...editingPlant, lastWatered: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Last Fertilized</label>
                <input
                  type="date"
                  value={editingPlant.lastFertilized ? editingPlant.lastFertilized.split('T')[0] : ''}
                  onChange={(e) => setEditingPlant({...editingPlant, lastFertilized: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn cancel" 
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn save"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;