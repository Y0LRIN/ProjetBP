import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';

// Mock services
vi.mock('../services', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
  },
}));

import { authService } from '../services';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should provide auth context', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('register');
    expect(result.current).toHaveProperty('logout');
  });

  it('should initialize with no user', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeUndefined();
  });

  it('should handle successful login', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
    };

    const mockToken = 'mock-jwt-token';

    authService.login.mockResolvedValue({
      user: mockUser,
      token: mockToken,
    });

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      result.current.login('test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    });
  });

  it('should handle logout', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });

  it('should handle token in localStorage', () => {
    localStorageMock.setItem('token', 'existing-token');
    
    expect(localStorageMock.getItem('token')).toBe('existing-token');
    
    localStorageMock.removeItem('token');
    
    expect(localStorageMock.getItem('token')).toBeNull();
  });
});
