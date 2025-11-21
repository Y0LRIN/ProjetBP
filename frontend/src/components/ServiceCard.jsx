import { useNavigate } from 'react-router-dom';
import './ServiceCard.css';

export const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const getTypeLabel = (type) => {
    const labels = {
      room: 'Salle',
      equipment: 'Équipement',
      other: 'Autre',
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type) => {
    const icons = {
      room: '🏢',
      equipment: '🔧',
      other: '📦',
    };
    return icons[type] || '📦';
  };

  return (
    <div className="service-card">
        <div className="service-icon">{getTypeIcon(service.type)}</div>
        <div className="service-type-badge">{getTypeLabel(service.type)}</div>
        <h3>{service.name}</h3>
        <p className="service-description">{service.description || 'Aucune description'}</p>
        <div className="service-info">
          <span className="slot-count">
            {service.slots?.length || 0} créneaux disponibles
          </span>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate(`/services/${service.id}/agenda`)}
        >
          Voir l'agenda
        </button>
      </div>
  );
};
