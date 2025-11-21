import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Gestion de Services
        </Link>
        
        <div className="navbar-menu">
          {isAuthenticated() ? (
            <>
              <Link to="/services" className="navbar-link">
                Services
              </Link>
              <Link to="/bookings" className="navbar-link">
                Mes Réservations
              </Link>
              {isAdmin() && (
                <Link to="/admin" className="navbar-link">
                  Administration
                </Link>
              )}
              <div className="navbar-user">
                <span className="navbar-username">
                  {user?.firstName} {user?.lastName}
                  {user?.role === 'admin' && <span className="badge-admin">Admin</span>}
                </span>
                <button onClick={handleLogout} className="btn-logout">
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Connexion
              </Link>
              <Link to="/register" className="navbar-link btn-primary">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
