import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    // Sauvegarder le token et l'utilisateur
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },
};

export const serviceService = {
  async getAllServices() {
    const response = await api.get('/services');
    return response.data;
  },

  async getServiceById(id) {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  async getAvailableSlots(serviceId) {
    const response = await api.get(`/services/${serviceId}/slots/available`);
    return response.data;
  },

  async createService(serviceData) {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  async updateService(id, updates) {
    const response = await api.patch(`/services/${id}`, updates);
    return response.data;
  },

  async deleteService(id) {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  async addSlot(serviceId, slot) {
    const response = await api.post(`/services/${serviceId}/slots`, { slot });
    return response.data;
  },

  async removeSlot(serviceId, slot) {
    const response = await api.delete(`/services/${serviceId}/slots`, { data: { slot } });
    return response.data;
  },
};

export const bookingService = {
  async getMyBookings() {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  async getAllBookings() {
    const response = await api.get('/bookings');
    return response.data;
  },

  async getBookingsByService(serviceId) {
    const response = await api.get(`/bookings?serviceId=${serviceId}`);
    return response.data;
  },

  async getBookingById(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async cancelBooking(id) {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  async updateBookingStatus(id, status) {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },
};

export const userService = {
  async getAllUsers() {
    const response = await api.get('/users');
    return response.data;
  },

  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateUserRole(id, role) {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
