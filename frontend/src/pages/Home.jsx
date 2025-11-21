import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Home.css';

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <div className="hero">
        <h1>Bienvenue sur notre plateforme de réservation</h1>
        <p className="hero-subtitle">
          Réservez facilement des salles et des équipements en quelques clics
        </p>
        <div className="hero-actions">
          {!isAuthenticated() ? (
            <>
              <Link to="/register" className="btn btn-primary btn-large">
                Commencer
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Se connecter
              </Link>
            </>
          ) : (
            <Link to="/services" className="btn btn-primary btn-large">
              Voir les services
            </Link>
          )}
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Réservation simple</h3>
          <p>Réservez vos services en quelques clics avec une interface intuitive</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏢</div>
          <h3>Salles et équipements</h3>
          <p>Accédez à une large gamme de salles et d'équipements professionnels</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⏰</div>
          <h3>Disponibilité en temps réel</h3>
          <p>Consultez les créneaux disponibles instantanément</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✅</div>
          <h3>Gestion facile</h3>
          <p>Gérez toutes vos réservations depuis un seul endroit</p>
        </div>
      </div>
    </div>
  );
};
