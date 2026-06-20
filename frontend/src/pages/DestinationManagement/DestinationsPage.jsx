import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MapPin, Edit2, Trash2, X, Upload, Heart, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchDestinations, addDestination, updateDestination, deleteDestination, toggleBookmark, fetchSavedDestinations } from '../../features/destination-management/destinationSlice';
import { useShuffledList } from '../../hooks/useShuffledList';

// Fix for Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const SHUFFLE_INTERVAL_MS = 60000;

// --- Sub-components ---

const DestinationCard = ({ destination, onView, onEdit, onDelete, onBookmark, onPlanTrip, canManage, showPlanTrip }) => {
  return (
    <motion.div 
      className="destination-card"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
    >
      <div className="card-image-wrapper" onClick={() => onView(destination)}>
        <img 
          src={destination.images[0] ? (destination.images[0].startsWith('http') ? destination.images[0] : `http://localhost:5000${destination.images[0]}`) : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'} 
          alt={destination.name} 
          className="card-image"
        />
        <div className="card-category-badge">{destination.category}</div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{destination.name}</h3>
        <div className="card-location">
          <MapPin size={14} />
          <span>{destination.location}</span>
        </div>
        <p className="card-description">{destination.description}</p>
        <div className="card-footer">
          <div className="card-footer-actions">
            <button className="btn-view" onClick={() => onView(destination)}>Explore</button>
            {showPlanTrip && (
              <button className="btn-plan-trip" onClick={() => onPlanTrip(destination)}>
                <Route size={16} /> Plan Trip
              </button>
            )}
          </div>
          
          <div className="card-actions">
            <button 
              className={`icon-btn bookmark-btn ${destination.isBookmarked ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); onBookmark(destination._id); }}
              title={destination.isBookmarked ? 'Unsave' : 'Save'}
            >
              <Heart size={18} fill={destination.isBookmarked ? "#ef4444" : "none"} color={destination.isBookmarked ? "#ef4444" : "currentColor"} />
            </button>

            {canManage && (
              <>
                <button className="icon-btn edit" onClick={(e) => { e.stopPropagation(); onEdit(destination); }}>
                  <Edit2 size={16} />
                </button>
                <button className="icon-btn delete" onClick={(e) => { e.stopPropagation(); onDelete(destination._id); }}>
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DestinationDetail = ({ destination, onClose, onEdit, onDelete, onPlanTrip, canManage, showPlanTrip }) => {
  const [currentImg, setCurrentImg] = useState(0);

  if (!destination) return null;

  return (
    <motion.div 
      className="modal-overlay" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content detail-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="detail-header">
          <div className="carousel">
            {destination.images && destination.images.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImg}
                    src={destination.images[currentImg]?.startsWith('http') ? destination.images[currentImg] : `http://localhost:5000${destination.images[currentImg]}`} 
                    alt={destination.name} 
                    className="carousel-img"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>
                {destination.images.length > 1 && (
                  <div className="carousel-nav">
                    {destination.images.map((_, i) => (
                      <div 
                        key={i} 
                        className={`dot ${currentImg === i ? 'active' : ''}`}
                        onClick={() => setCurrentImg(i)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" 
                alt="Default" 
                className="carousel-img" 
              />
            )}
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-meta">
            <span className="badge">{destination.category}</span>
            <div className="card-location">
              <MapPin size={18} />
              <span>{destination.location}</span>
            </div>
          </div>
          
          <h1 className="detail-title">{destination.name}</h1>
          <p className="detail-description">{destination.description}</p>

          <div className="map-preview-container">
            {destination.coordinates?.lat && destination.coordinates?.lng ? (
              <MapContainer 
                center={[destination.coordinates.lat, destination.coordinates.lng]} 
                zoom={13} 
                style={{ height: '300px', width: '100%', borderRadius: '1.5rem' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[destination.coordinates.lat, destination.coordinates.lng]}>
                  <Popup>{destination.name}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="map-preview-empty">
                <MapPin size={32} />
                <p>Location coordinates not available for {destination.name}</p>
              </div>
            )}
          </div>

          {showPlanTrip && (
            <button className="btn-plan-trip btn-plan-trip-large" onClick={() => onPlanTrip(destination)}>
              <Route size={20} /> Plan Trip to {destination.name}
            </button>
          )}

          {canManage && (
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => onEdit(destination)}>Edit Destination</button>
              <button className="btn-danger" onClick={() => onDelete(destination._id)}>Delete Permanently</button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const DestinationForm = ({ destination, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(destination ? {
    ...destination,
    images: destination.images || []
  } : {
    name: '',
    description: '',
    location: '',
    category: 'beach',
    images: [] // existing server images or URLs
  });
  
  const [imageUrl, setImageUrl] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const handleAddUrl = () => {
    if (imageUrl && imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()]
      });
      setImageUrl('');
    }
  };

  const removeNewImage = (index) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);

    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
  };

  const removeExistingImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('category', formData.category);
    
    // Add existing images and external URLs
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach(img => data.append('existingImages', img));
    }

    // Add new file uploads
    newImages.forEach(file => data.append('images', file));

    onSubmit(data);
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content form-modal"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-container">
          <div className="form-header">
            <h2>{destination ? 'Refine Destination' : 'Add New Paradise'}</h2>
            <button className="close-btn-simple" onClick={onClose}><X size={24} /></button>
          </div>
          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sigiriya Rock Fortress"
                />
              </div>
              <div className="form-group flex-1">
                <label>Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="beach">Beach</option>
                  <option value="mountain">Mountain</option>
                  <option value="city">City</option>
                  <option value="forest">Forest</option>
                  <option value="historic">Historic</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Location</label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <input 
                  type="text" 
                  required 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                rows="4" 
                required 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Share the magic of this destination..."
              />
            </div>

            <div className="form-group">
              <label>External Image URLs</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL here"
                />
                <button 
                  type="button" 
                  className="btn-view" 
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={handleAddUrl}
                >
                  Add URL
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Local Image Uploads</label>
              <div className="image-upload-zone" onClick={() => document.getElementById('fileInput').click()}>
                <Upload size={24} style={{ marginBottom: '0.5rem' }} />
                <p>Drop images here or click to browse</p>
                <input 
                  type="file" 
                  id="fileInput" 
                  multiple 
                  hidden 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="preview-grid">
                {formData.images && formData.images.map((img, index) => (
                  <div key={`existing-${index}`} className="preview-item">
                    <img 
                      src={img.startsWith('http') ? img : `http://localhost:5000${img}`} 
                      alt="Preview" 
                    />
                    <button type="button" className="remove-img" onClick={() => removeExistingImage(index)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {previews.map((url, index) => (
                  <div key={`new-${index}`} className="preview-item">
                    <img src={url} alt="Preview" />
                    <button type="button" className="remove-img" onClick={() => removeNewImage(index)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary">
                {destination ? 'Save Changes' : 'Publish Destination'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Component ---

const DestinationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: destinations, loading } = useSelector((state) => state.destinations);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'saved'

  const canManage = user && ['admin', 'super_admin', 'tour_guide'].includes(user.role);
  const showPlanTrip = user?.role === 'user';

  const handlePlanTrip = (dest) => {
    navigate(`/plan-tour?destination=${dest._id}`);
  };

  useEffect(() => {
    if (viewMode === 'all') {
      dispatch(fetchDestinations());
    } else {
      dispatch(fetchSavedDestinations());
    }
  }, [dispatch, viewMode]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = destinations.filter(dest =>
      dest.name.toLowerCase().includes(term) ||
      dest.location.toLowerCase().includes(term)
    );
    setSearchResults(filtered);
  }, [searchTerm, destinations]);

  const shuffledDestinations = useShuffledList(searchResults, SHUFFLE_INTERVAL_MS);
  const filteredDestinations = searchTerm.trim() ? searchResults : shuffledDestinations;

  const handleBookmark = (id) => {
    dispatch(toggleBookmark(id));
  };

  const handleOpenDetail = (dest) => {
    setSelectedDestination(dest);
  };

  const handleOpenAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleOpenEdit = (dest) => {
    setEditData(dest);
    setShowForm(true);
    setSelectedDestination(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this destination?')) {
      dispatch(deleteDestination(id));
      setSelectedDestination(null);
    }
  };

  const handleFormSubmit = (data) => {
    if (editData) {
      dispatch(updateDestination({ id: editData._id, formData: data }));
    } else {
      dispatch(addDestination(data));
    }
    setShowForm(false);
    setEditData(null);
  };

  return (
    <div className="destinations-container">
      <header className="destinations-header">
        <div className="header-text">
          <h1>Discover Your Next Adventure</h1>
          <p>Explore breathtaking places and plan your perfect getaway.</p>
        </div>
        <div className="search-actions">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search by destination name or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="view-tabs">
            <button 
              className={`tab-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => setViewMode('all')}
            >
              All
            </button>
            <button 
              className={`tab-btn ${viewMode === 'saved' ? 'active' : ''}`}
              onClick={() => setViewMode('saved')}
            >
              Saved
            </button>
          </div>

          {canManage && (
            <button className="add-btn" onClick={handleOpenAdd}>
              <Plus size={20} />
              <span>Add New</span>
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Curating the best destinations for you...</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="destinations-grid">
            {filteredDestinations.length > 0 ? (
              filteredDestinations.map(dest => (
                <DestinationCard 
                  key={dest._id}
                  destination={dest}
                  onView={handleOpenDetail}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onBookmark={handleBookmark}
                  onPlanTrip={handlePlanTrip}
                  canManage={canManage}
                  showPlanTrip={showPlanTrip}
                />
              ))
            ) : (
              <div className="no-results">
                <h3>No destinations found matching "{searchTerm}"</h3>
                <p>Try searching for a different city or place name.</p>
              </div>
            )}
          </div>
        </AnimatePresence>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedDestination && (
          <DestinationDetail 
            destination={selectedDestination}
            onClose={() => setSelectedDestination(null)}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onPlanTrip={handlePlanTrip}
            canManage={canManage}
            showPlanTrip={showPlanTrip}
          />
        )}

        {showForm && (
          <DestinationForm 
            destination={editData}
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DestinationsPage;
