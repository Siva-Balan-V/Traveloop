const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (token && !options.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

const api = new ApiService();

export const authService = {
  register: (userData) => api.post('/auth/register', userData, { skipAuth: true }),
  login: (email, password) => api.post('/auth/login', { email, password }, { skipAuth: true }),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`, { skipAuth: true }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }, { skipAuth: true }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }, { skipAuth: true }),
  verifyToken: async (token) => {
    const user = await api.get('/users/profile');
    return user;
  },
};

export const tripService = {
  getTrips: (page = 1, limit = 20) => api.get(`/trips?page=${page}&limit=${limit}`),
  getTripById: (id) => api.get(`/trips/${id}`),
  createTrip: (tripData) => api.post('/trips', tripData),
  updateTrip: (id, tripData) => api.put(`/trips/${id}`, tripData),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  getBudget: (id) => api.get(`/trips/${id}/budget`),
  generateShareLink: (id) => api.post(`/trips/${id}/share`),
  getSharedTrip: (token) => api.get(`/trips/shared/${token}`, { skipAuth: true }),
};

export const stopService = {
  getStops: (tripId) => api.get(`/trips/${tripId}/stops`),
  createStop: (tripId, stopData) => api.post(`/trips/${tripId}/stops`, stopData),
  updateStop: (stopId, stopData) => api.put(`/trips/stops/${stopId}`, stopData),
  deleteStop: (stopId) => api.delete(`/trips/stops/${stopId}`),
  addActivity: (stopId, activityData) => api.post(`/activities/stops/${stopId}`, activityData),
  removeActivity: (activityId) => api.delete(`/activities/stop-activities/${activityId}`),
};

export const cityService = {
  searchCities: (query) => api.get(`/cities?q=${encodeURIComponent(query)}`),
  getCityById: (id) => api.get(`/cities/${id}`),
};

export const activityService = {
  searchActivities: (cityId, category, q) => {
    let url = '/activities?';
    if (cityId) url += `city=${cityId}&`;
    if (category) url += `category=${category}&`;
    if (q) url += `q=${encodeURIComponent(q)}&`;
    return api.get(url);
  },
  getActivityById: (id) => api.get(`/activities/${id}`),
};

export const noteService = {
  getNotes: (tripId) => api.get(`/trips/${tripId}/notes`),
  createNote: (tripId, noteData) => api.post(`/trips/${tripId}/notes`, noteData),
  updateNote: (noteId, noteData) => api.put(`/trips/notes/${noteId}`, noteData),
  deleteNote: (noteId) => api.delete(`/trips/notes/${noteId}`),
};

export const packingService = {
  getPackingList: (tripId) => api.get(`/trips/${tripId}/packing`),
  addItem: (tripId, itemData) => api.post(`/trips/${tripId}/packing`, itemData),
  updateItem: (itemId, itemData) => api.put(`/trips/packing/${itemId}`, itemData),
  deleteItem: (itemId) => api.delete(`/trips/packing/${itemId}`),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getSettings: () => api.get('/users/profile'),
  updateSettings: (settings) => api.put('/users/preferences', settings),
  deleteAccount: () => api.delete('/users/account'),
};

export default api;
