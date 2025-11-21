import { useState, useEffect } from 'react';
import { serviceService, bookingService } from '../services';
import './Admin.css';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [newService, setNewService] = useState({
    name: '',
    type: 'room',
    description: '',
  });
  const [newSlot, setNewSlot] = useState({
    serviceId: '',
    slot: '',
  });

  useEffect(() => {
    if (activeTab === 'services') {
      loadServices();
    } else if (activeTab === 'bookings') {
      loadBookings();
    }
  }, [activeTab]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAllServices();
      setServices(data);
    } catch {
      setError('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch {
      setError('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await serviceService.createService(newService);
      setNewService({ name: '', type: 'room', description: '' });
      loadServices();
      alert('Service créé avec succès');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await serviceService.addSlot(newSlot.serviceId, newSlot.slot);
      setNewSlot({ serviceId: '', slot: '' });
      loadServices();
      alert('Créneau ajouté avec succès');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'ajout du créneau');
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
    
    try {
      await serviceService.deleteService(id);
      loadServices();
      alert('Service supprimé avec succès');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleRemoveSlot = async (serviceId, slot) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) return;
    
    try {
      await serviceService.removeSlot(serviceId, slot);
      loadServices();
      alert('Créneau supprimé avec succès');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="admin-container">
      <h1>Administration</h1>
      
      <div className="admin-tabs">
        <button
          className={activeTab === 'services' ? 'active' : ''}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Réservations
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeTab === 'services' && (
        <div className="admin-section">
          <div className="admin-form-section">
            <h2>Créer un service</h2>
            <form onSubmit={handleCreateService} className="admin-form">
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newService.type}
                  onChange={(e) => setNewService({ ...newService, type: e.target.value })}
                >
                  <option value="room">Salle</option>
                  <option value="equipment">Équipement</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  rows="3"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Créer le service
              </button>
            </form>
          </div>

          <div className="admin-form-section">
            <h2>Ajouter un créneau</h2>
            <form onSubmit={handleAddSlot} className="admin-form">
              <div className="form-group">
                <label>Service</label>
                <select
                  value={newSlot.serviceId}
                  onChange={(e) => setNewSlot({ ...newSlot, serviceId: e.target.value })}
                  required
                >
                  <option value="">-- Sélectionner un service --</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Créneau (YYYY-MM-DD HH:MM)</label>
                <input
                  type="text"
                  value={newSlot.slot}
                  onChange={(e) => setNewSlot({ ...newSlot, slot: e.target.value })}
                  placeholder="2025-11-20 09:00"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Ajouter le créneau
              </button>
            </form>
          </div>

          <div className="admin-list-section">
            <h2>Liste des services</h2>
            {loading ? (
              <p>Chargement...</p>
            ) : (
              <div className="services-admin-list">
                {services.map((service) => (
                  <div key={service.id} className="service-admin-card">
                    <div className="service-admin-header">
                      <h3>{service.name}</h3>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                    <p><strong>Type:</strong> {service.type}</p>
                    <p><strong>Description:</strong> {service.description || 'Aucune'}</p>
                    <div className="slots-section">
                      <strong>Créneaux:</strong>
                      {service.slots && service.slots.length > 0 ? (
                        <ul className="slots-list">
                          {service.slots.map((slot) => (
                            <li key={slot}>
                              {slot}
                              <button
                                className="btn-remove-slot"
                                onClick={() => handleRemoveSlot(service.id, slot)}
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Aucun créneau</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="admin-section">
          <h2>Toutes les réservations</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : bookings.length === 0 ? (
            <p>Aucune réservation</p>
          ) : (
            <div className="bookings-admin-list">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Utilisateur</th>
                    <th>Service</th>
                    <th>Créneau</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>
                        {booking.user ? 
                          `${booking.user.firstName} ${booking.user.lastName}` : 
                          `User #${booking.userId}`}
                      </td>
                      <td>{booking.service?.name || `Service #${booking.serviceId}`}</td>
                      <td>{booking.slot}</td>
                      <td>
                        <span className={`status-badge status-${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>{new Date(booking.createdAt).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
