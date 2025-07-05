import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://book-store-pk35.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

export const booksAPI = {
  getAll: (params?: any) => api.get('/books', { params }),
  getById: (id: string) => api.get(`/books/${id}`),
  getFeatured: () => api.get('/books/featured/list'),
  getCategories: () => api.get('/books/meta/categories'),
  getStats: () => api.get('/books/meta/stats'),
};

export const paymentsAPI = {
  initiate: (data: any) => api.post('/payments/initiate', data),
  getStatus: (transactionId: string) => api.get(`/payments/status/${transactionId}`),
  retryDelivery: (transactionId: string) => api.post(`/payments/retry-delivery/${transactionId}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getBooks: (params?: any) => api.get('/admin/books', { params }),
  createBook: (formData: FormData) => api.post('/admin/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateBook: (id: string, data: any) => api.put(`/admin/books/${id}`, data),
  deleteBook: (id: string) => api.delete(`/admin/books/${id}`),
  getPurchases: (params?: any) => api.get('/admin/purchases', { params }),
  resendEbook: (id: string) => api.post(`/admin/purchases/${id}/resend`),
};

export const downloadAPI = {
  getInfo: (token: string) => api.get(`/downloads/${token}/info`),
  download: (token: string) => {
    window.open(`${API_BASE_URL}/downloads/${token}`, '_blank');
  },
};

export default api;