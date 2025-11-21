import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const renderNavbar = (authValue) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Navbar Component', () => {
  it('should render app title', () => {
    const mockAuth = {
      user: null,
      loading: false,
      logout: vi.fn(),
      isAuthenticated: () => false,
      isAdmin: () => false,
    };

    renderNavbar(mockAuth);
    
    expect(screen.getByText('Gestion de Services')).toBeInTheDocument();
  });

  it('should show login and register links when not authenticated', () => {
    const mockAuth = {
      user: null,
      loading: false,
      logout: vi.fn(),
      isAuthenticated: () => false,
      isAdmin: () => false,
    };

    renderNavbar(mockAuth);
    
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Inscription')).toBeInTheDocument();
  });

  it('should show user menu when authenticated', () => {
    const mockAuth = {
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
      },
      loading: false,
      logout: vi.fn(),
      isAuthenticated: () => true,
      isAdmin: () => false,
    };

    renderNavbar(mockAuth);
    
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Mes Réservations')).toBeInTheDocument();
    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
  });

  it('should show admin link for admin users', () => {
    const mockAuth = {
      user: {
        id: 1,
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      },
      loading: false,
      logout: vi.fn(),
      isAuthenticated: () => true,
      isAdmin: () => true,
    };

    renderNavbar(mockAuth);
    
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should not show admin link for regular users', () => {
    const mockAuth = {
      user: {
        id: 1,
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
      },
      loading: false,
      logout: vi.fn(),
      isAuthenticated: () => true,
      isAdmin: () => false,
    };

    renderNavbar(mockAuth);
    
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
