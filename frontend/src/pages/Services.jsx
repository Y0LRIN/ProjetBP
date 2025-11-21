import { useState, useEffect } from 'react';
import { serviceService } from '../services';
import { ServiceCard } from '../components/ServiceCard';
import './Services.css';

export const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadServices();
  }, []);

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

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(s => s.type === filter);

  if (loading) {
    return <div className="loading-container">Chargement...</div>;
  }

  return (
    <div className="services-container">
      <div className="services-header">
        <h1>Services disponibles</h1>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button 
            className={filter === 'room' ? 'active' : ''} 
            onClick={() => setFilter('room')}
          >
            Salles
          </button>
          <button 
            className={filter === 'equipment' ? 'active' : ''} 
            onClick={() => setFilter('equipment')}
          >
            Équipements
          </button>
          <button 
            className={filter === 'other' ? 'active' : ''} 
            onClick={() => setFilter('other')}
          >
            Autres
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="services-grid">
        {filteredServices.length === 0 ? (
          <p className="no-services">Aucun service disponible</p>
        ) : (
          filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))
        )}
      </div>
    </div>
  );
};
