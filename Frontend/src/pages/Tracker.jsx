// Tracker.jsx
import React, { useState } from 'react';
import './Tracker.css';

const Tracker = () => {

  //Note for Tony from Jad
  //We will need to fetch these from the database so, we need a plants model that links to a user ID
  // State for tracked plants
  const [myPlants, setMyPlants] = useState([
    {
      id: 1,
      name: "Monstera Deliciosa",
      nickname: "Monty",
      image: "/images/monstera.jpg",
      acquiredDate: "2023-03-15",
      lastWatered: "2023-06-10",
      wateringFrequency: 7, // days
      lastFertilized: "2023-05-20",
      fertilizingFrequency: 30, // days
      location: "Living Room",
      notes: "Putting out a new leaf! Keep an eye on it.",
      healthStatus: "healthy"
    },
    {
      id: 2,
      name: "Fiddle Leaf Fig",
      nickname: "Figgy",
      image: "/images/fiddle-leaf.jpg",
      acquiredDate: "2023-01-10",
      lastWatered: "2023-06-08",
      wateringFrequency: 10, // days
      lastFertilized: "2023-05-15",
      fertilizingFrequency: 30, // days
      location: "Office",
      notes: "New growth looks a bit pale - might need more light.",
      healthStatus: "needsAttention"
    },
    {
      id: 3,
      name: "Snake Plant",
      nickname: "Medusa",
      image: "/images/snake-plant.jpg",
      acquiredDate: "2022-11-20",
      lastWatered: "2023-06-01",
      wateringFrequency: 14, // days
      lastFertilized: "2023-04-15",
      fertilizingFrequency: 60, // days
      location: "Bedroom",
      notes: "",
      healthStatus: "healthy"
    }
  ]);
  
  //Note from Jad to Tony
  //This is one of the attributes of the Plant insertion
  // State for form
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);

  //Note from Jad to Tony
  //Here, we will need ot create a new plant object and insert it into the database
  const [newPlant, setNewPlant] = useState({
    name: "",
    nickname: "",
    acquiredDate: "",
    lastWatered: "",
    wateringFrequency: 7,
    lastFertilized: "",
    fertilizingFrequency: 30,
    location: "",
    notes: "",
    healthStatus: "healthy"
  });
  
  // Current view
  const [activeView, setActiveView] = useState('grid');
  
  //Attribute
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days since last watered
  const getDaysSinceWatered = (lastWateredDate) => {
    const today = new Date();
    const lastWatered = new Date(lastWateredDate);
    const diffTime = today - lastWatered;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Calculate if watering is needed
  const needsWatering = (plant) => {
    const daysSinceWatered = getDaysSinceWatered(plant.lastWatered);
    //Watering frequency is within the attributes of the plant inserted
    return daysSinceWatered >= plant.wateringFrequency;
  };
  
  // Calculate days since last fertilized
  const getDaysSinceFertilized = (lastFertilizedDate) => {
    const today = new Date();
    const lastFertilized = new Date(lastFertilizedDate);
    const diffTime = today - lastFertilized;
    //Fertilization frequency is within the attributes of the plant inserted
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Calculate if fertilizing is needed
  const needsFertilizing = (plant) => {
    const daysSinceFertilized = getDaysSinceFertilized(plant.lastFertilized);
    return daysSinceFertilized >= plant.fertilizingFrequency;
  };
  
  // Handle new plant form input changes
  //Append it to the pre-existing state instead of performing a new fetch
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlant(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add new plant
  const handleAddPlant = (e) => {
    e.preventDefault();
    
    const plantToAdd = {
      id: myPlants.length + 1,
      ...newPlant,
      image: "/images/default-plant.jpg" // Default image
    };
    
    //Tony from Jad: These are all the required attributes of the plants
    setMyPlants([...myPlants, plantToAdd]);
    setIsAddPlantModalOpen(false);
    setNewPlant({
      name: "",
      nickname: "",
      acquiredDate: "",
      lastWatered: "",
      wateringFrequency: 7,
      lastFertilized: "",
      fertilizingFrequency: 30,
      location: "",
      notes: "",
      healthStatus: "healthy"
    });
  };
  
  // Log watering for a plant
  const logWatering = (plantId) => {
    const today = new Date().toISOString().split('T')[0];
    
    setMyPlants(myPlants.map(plant => 
      plant.id === plantId 
        ? { ...plant, lastWatered: today } 
        : plant
    ));
  };
  
  // Log fertilizing for a plant
  const logFertilizing = (plantId) => {
    const today = new Date().toISOString().split('T')[0];
    
    setMyPlants(myPlants.map(plant => 
      plant.id === plantId 
        ? { ...plant, lastFertilized: today } 
        : plant
    ));
  };
  
  // Calculate watering status for all plants
  const calculateWateringStatus = () => {
    let needsWateringCount = 0;
    let upcomingCount = 0;
    
    myPlants.forEach(plant => {
      const daysSinceWatered = getDaysSinceWatered(plant.lastWatered);
      if (daysSinceWatered >= plant.wateringFrequency) {
        needsWateringCount++;
      } else if (daysSinceWatered >= plant.wateringFrequency - 2) {
        upcomingCount++;
      }
    });
    
    return { needsWateringCount, upcomingCount };
  };
  
  const wateringStatus = calculateWateringStatus();
  
  return (
    <div className="tracker-page">
      <div className="tracker-header">
        <div className="container">
          <h1>Plant Tracker</h1>
          <p>Keep track of your plants' care schedule and growth progress.</p>
          
          <div className="tracker-stats">
            <div className="stat-card">
              <div className="stat-value">{myPlants.length}</div>
              <div className="stat-label">Total Plants</div>
            </div>
            <div className="stat-card highlight">
              <div className="stat-value">{wateringStatus.needsWateringCount}</div>
              <div className="stat-label">Need Watering</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{wateringStatus.upcomingCount}</div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="tracker-content container">
        <div className="tracker-controls">
          <div className="view-controls">
            <button 
              className={`view-btn ${activeView === 'grid' ? 'active' : ''}`}
              onClick={() => setActiveView('grid')}
            >
              Grid View
            </button>
            <button 
              className={`view-btn ${activeView === 'list' ? 'active' : ''}`}
              onClick={() => setActiveView('list')}
            >
              List View
            </button>
            <button 
              className={`view-btn ${activeView === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveView('calendar')}
            >
              Calendar
            </button>
          </div>
          
          <button 
            className="add-plant-btn"
            onClick={() => setIsAddPlantModalOpen(true)}
          >
            Add Plant
          </button>
        </div>
        
        {/* Grid View */}
        {activeView === 'grid' && (
          <div className="plants-grid">
            {myPlants.map(plant => (
              <div className={`plant-card ${needsWatering(plant) ? 'needs-water' : ''}`} key={plant.id}>
                <div className="plant-image-placeholder">
                  <div className="plant-icon">🪴</div>
                  {needsWatering(plant) && <div className="water-indicator">💧</div>}
                  {needsFertilizing(plant) && <div className="fertilize-indicator">🌱</div>}
                </div>
                <div className="plant-info">
                  <h3 className="plant-name">{plant.name}</h3>
                  {plant.nickname && <p className="plant-nickname">"{plant.nickname}"</p>}
                  
                  <div className="care-info">
                    <div className="care-item">
                      <span className="care-label">Last Watered:</span>
                      <span className="care-value">{formatDate(plant.lastWatered)}</span>
                      <span className="days-ago">
                        ({getDaysSinceWatered(plant.lastWatered)} days ago)
                      </span>
                    </div>
                    <div className="care-item">
                      <span className="care-label">Last Fertilized:</span>
                      <span className="care-value">{formatDate(plant.lastFertilized)}</span>
                      <span className="days-ago">
                        ({getDaysSinceFertilized(plant.lastFertilized)} days ago)
                      </span>
                    </div>
                    <div className="care-item">
                      <span className="care-label">Location:</span>
                      <span className="care-value">{plant.location}</span>
                    </div>
                  </div>
                  
                  {plant.notes && (
                    <div className="plant-notes">
                      <p>{plant.notes}</p>
                    </div>
                  )}
                  
                  <div className="care-actions">
                    <button 
                      className="water-btn"
                      onClick={() => logWatering(plant.id)}
                    >
                      Log Watering
                    </button>
                    <button 
                      className="fertilize-btn"
                      onClick={() => logFertilizing(plant.id)}
                    >
                      Log Fertilizing
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* List View */}
        {activeView === 'list' && (
          <div className="plants-list">
            <div className="list-header">
              <div className="col-plant">Plant</div>
              <div className="col-location">Location</div>
              <div className="col-watering">Last Watered</div>
              <div className="col-fertilizing">Last Fertilized</div>
              <div className="col-actions">Actions</div>
            </div>
            
            {myPlants.map(plant => (
              <div 
                className={`list-item ${needsWatering(plant) ? 'needs-water' : ''}`} 
                key={plant.id}
              >
                <div className="col-plant">
                  <div className="list-plant-info">
                    <div className="list-plant-image">
                      <div className="plant-icon-small">🪴</div>
                    </div>
                    <div>
                      <div className="list-plant-name">{plant.name}</div>
                      {plant.nickname && <div className="list-plant-nickname">"{plant.nickname}"</div>}
                    </div>
                  </div>
                </div>
                <div className="col-location">{plant.location}</div>
                <div className="col-watering">
                  <div>{formatDate(plant.lastWatered)}</div>
                  <div className="days-ago">({getDaysSinceWatered(plant.lastWatered)} days ago)</div>
                  {needsWatering(plant) && <div className="water-indicator-small">💧</div>}
                </div>
                <div className="col-fertilizing">
                  <div>{formatDate(plant.lastFertilized)}</div>
                  <div className="days-ago">({getDaysSinceFertilized(plant.lastFertilized)} days ago)</div>
                  {needsFertilizing(plant) && <div className="fertilize-indicator-small">🌱</div>}
                </div>
                <div className="col-actions">
                  <button 
                    className="list-water-btn"
                    onClick={() => logWatering(plant.id)}
                  >
                    Water
                  </button>
                  <button 
                    className="list-fertilize-btn"
                    onClick={() => logFertilizing(plant.id)}
                  >
                    Fertilize
                  </button>
                  <button className="list-edit-btn">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Calendar View - Simplified version */}
        {activeView === 'calendar' && (
          <div className="calendar-view">
            <div className="calendar-message">
              <h3>Calendar View</h3>
              <p>The calendar view would display a monthly calendar with icons indicating which days plants need to be watered or fertilized.</p>
              <p>This would be implemented with a calendar component library like react-calendar or react-big-calendar.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Plant Modal */}
      {isAddPlantModalOpen && (
        <div className="modal-overlay">
          <div className="add-plant-modal">
            <div className="modal-header">
              <h2>Add New Plant</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setIsAddPlantModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddPlant}>
              <div className="form-group">
                <label htmlFor="name">Plant Name*</label>
                <input 
                  type="text"
                  id="name"
                  name="name"
                  value={newPlant.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nickname">Nickname</label>
                <input 
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={newPlant.nickname}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="acquiredDate">Date Acquired</label>
                  <input 
                    type="date"
                    id="acquiredDate"
                    name="acquiredDate"
                    value={newPlant.acquiredDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input 
                    type="text"
                    id="location"
                    name="location"
                    value={newPlant.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lastWatered">Last Watered*</label>
                  <input 
                    type="date"
                    id="lastWatered"
                    name="lastWatered"
                    value={newPlant.lastWatered}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="wateringFrequency">Watering Frequency (days)*</label>
                  <input 
                    type="number"
                    id="wateringFrequency"
                    name="wateringFrequency"
                    min="1"
                    value={newPlant.wateringFrequency}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lastFertilized">Last Fertilized</label>
                  <input 
                    type="date"
                    id="lastFertilized"
                    name="lastFertilized"
                    value={newPlant.lastFertilized}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="fertilizingFrequency">Fertilizing Frequency (days)</label>
                  <input 
                    type="number"
                    id="fertilizingFrequency"
                    name="fertilizingFrequency"
                    min="1"
                    value={newPlant.fertilizingFrequency}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={newPlant.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="healthStatus">Health Status</label>
                <select
                  id="healthStatus"
                  name="healthStatus"
                  value={newPlant.healthStatus}
                  onChange={handleInputChange}
                >
                  <option value="healthy">Healthy</option>
                  <option value="needsAttention">Needs Attention</option>
                  <option value="declining">Declining</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsAddPlantModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">Add Plant</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;