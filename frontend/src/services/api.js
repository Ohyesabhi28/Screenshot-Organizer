import axios from 'axios';

const API_BASE = '/api';

// Auth API
export async function signup(name, email, password) {
  const response = await axios.post(`${API_BASE}/auth/signup`, {
    name,
    email,
    password
  });
  return response.data;
}

export async function login(email, password) {
  const response = await axios.post(`${API_BASE}/auth/login`, {
    email,
    password
  });
  return response.data;
}

export async function verifyToken(token) {
  const response = await axios.get(`${API_BASE}/auth/verify`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

// Screenshot API

// Add token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function uploadScreenshot(file) {
  const formData = new FormData();
  formData.append('screenshot', file);
  
  const response = await axios.post(`${API_BASE}/screenshots`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
}

export async function getScreenshots(limit = 100, offset = 0) {
  const response = await axios.get(`${API_BASE}/screenshots`, {
    params: { limit, offset }
  });
  return response.data;
}

export async function getScreenshot(id) {
  const response = await axios.get(`${API_BASE}/screenshots/${id}`);
  return response.data;
}

export async function searchScreenshots(query) {
  const response = await axios.get(`${API_BASE}/screenshots/search`, {
    params: { q: query }
  });
  return response.data;
}

export async function deleteScreenshot(id) {
  const response = await axios.delete(`${API_BASE}/screenshots/${id}`);
  return response.data;
}
