import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceService, bookingService } from '../services';
import './ServiceAgenda.css';

export const ServiceAgenda = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [allSlots, setAllSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadServiceData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Charger le service
      const serviceData = await serviceService.getServiceById(id);
      setService(serviceData);
      setAllSlots(serviceData.slots || []);
      
      // Charger toutes les réservations pour ce service
      const serviceBookings = await bookingService.getBookingsByService(id);
      setBookedSlots(serviceBookings.map(b => b.slot));
      
      // Charger mes réservations
      const myBookingsData = await bookingService.getMyBookings();
      setMyBookings(myBookingsData.filter(b => b.serviceId === parseInt(id)));
      
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServiceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBookSlot = async (slot) => {
    if (bookedSlots.includes(slot)) {
      return; // Déjà réservé
    }

    if (!window.confirm(`Confirmer la réservation pour le ${slot} ?`)) {
      return;
    }

    try {
      await bookingService.createBooking({
        serviceId: parseInt(id),
        slot,
      });
      
      // Recharger les données
      await loadServiceData();
      alert('Réservation confirmée !');
      
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Annuler cette réservation ?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      await loadServiceData();
      alert('Réservation annulée');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  const getSlotStatus = (slot) => {
    const myBooking = myBookings.find(b => b.slot === slot);
    if (myBooking) {
      return { status: 'mine', booking: myBooking };
    }
    if (bookedSlots.includes(slot)) {
      return { status: 'booked', booking: null };
    }
    return { status: 'available', booking: null };
  };

  const groupSlotsByDate = () => {
    const grouped = {};
    
    allSlots.forEach(slot => {
      const [date, time] = slot.split(' ');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push({ slot, time, ...getSlotStatus(slot) });
    });
    
    // Trier par date
    return Object.keys(grouped).sort().map(date => ({
      date,
      slots: grouped[date].sort((a, b) => a.time.localeCompare(b.time)),
    }));
  };

  if (loading) {
    return <div className="loading-container">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/services')} className="btn btn-primary">
          Retour aux services
        </button>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  const groupedSlots = groupSlotsByDate();

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <button onClick={() => navigate('/services')} className="btn-back">
          ← Retour
        </button>
        <div className="service-info-header">
          <h1>{service.name}</h1>
          <span className="service-type-badge">
            {service.type === 'room' ? 'Salle' : service.type === 'equipment' ? 'Équipement' : 'Autre'}
          </span>
        </div>
        {service.description && <p className="service-description">{service.description}</p>}
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-dot available"></span>
          <span>Disponible</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot mine"></span>
          <span>Mes réservations</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot booked"></span>
          <span>Réservé par d'autres</span>
        </div>
      </div>

      {groupedSlots.length === 0 ? (
        <p className="no-slots">Aucun créneau disponible pour ce service</p>
      ) : (
        <div className="agenda-calendar">
          {groupedSlots.map(({ date, slots }) => (
            <div key={date} className="day-group">
              <h3 className="date-header">
                {new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <div className="slots-grid">
                {slots.map(({ slot, time, status, booking }) => (
                  <div
                    key={slot}
                    className={`slot-card ${status}`}
                    onClick={() => status === 'available' && handleBookSlot(slot)}
                  >
                    <div className="slot-time">{time}</div>
                    <div className="slot-status">
                      {status === 'available' && (
                        <>
                          <span className="status-text">Disponible</span>
                          <button className="btn-book-inline">Réserver</button>
                        </>
                      )}
                      {status === 'mine' && (
                        <>
                          <span className="status-text">Votre réservation</span>
                          <button
                            className="btn-cancel-inline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBooking(booking.id);
                            }}
                          >
                            Annuler
                          </button>
                        </>
                      )}
                      {status === 'booked' && <span className="status-text">Non disponible</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
