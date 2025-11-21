import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../pages/Login';
import { AuthContext } from '../context/AuthContext';

// Mock the services
vi.mock('../services', () => ({
  authService: {
    login: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

const renderLogin = (authValue) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Login Page', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    const mockAuth = {
      user: null,
      loading: false,
      login: mockLogin,
    };

    renderLogin(mockAuth);
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('should show validation error for empty email', async () => {
    const mockAuth = {
      user: null,
      loading: false,
      login: mockLogin,
    };

    renderLogin(mockAuth);
    
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toBeInvalid();
    });
  });

  it('should update input values on change', () => {
    const mockAuth = {
      user: null,
      loading: false,
      login: mockLogin,
    };

    renderLogin(mockAuth);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should have link to register page', () => {
    const mockAuth = {
      user: null,
      loading: false,
      login: mockLogin,
    };

    renderLogin(mockAuth);
    
    const registerLink = screen.getByText(/pas encore de compte/i);
    expect(registerLink).toBeInTheDocument();
  });
});
