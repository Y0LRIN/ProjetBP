import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bookingService } from '../services';
import './Services.css';

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    loadBookings();
  }, [location.state?.refresh]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch {
      setError('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  if (loading) {
    return <div className="loading-container">Chargement...</div>;
  }

  return (
    <div className="services-container">
      <div className="services-header">
        <h1>Mes Réservations</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>Vous n'avez aucune réservation</p>
          <a href="/services" className="btn btn-primary">
            Voir les services disponibles
          </a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.service?.name || `Service #${booking.serviceId}`}</h3>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status === 'confirmed' ? 'Confirmée' : 
                   booking.status === 'cancelled' ? 'Annulée' : 
                   'Terminée'}
                </span>
              </div>
              <div className="booking-details">
                <div className="booking-info">
                  <span className="label">Type:</span>
                  <span>{booking.service?.type === 'room' ? 'Salle' : 
                         booking.service?.type === 'equipment' ? 'Équipement' : 
                         'Autre'}</span>
                </div>
                <div className="booking-info">
                  <span className="label">Créneau:</span>
                  <span className="slot-time">{booking.slot}</span>
                </div>
                <div className="booking-info">
                  <span className="label">Réservé le:</span>
                  <span>{new Date(booking.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              {booking.status === 'confirmed' && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleCancel(booking.id)}
                >
                  Annuler la réservation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
