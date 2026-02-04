import axios from 'axios';

/* ================= TYPES ================= */

export interface AIResponse {
  data: any;
  reply: string;
}

/* ================= BASE CONFIG ================= */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================= AUTH ================= */

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  signup: (name: string, email: string, password: string) =>
    api.post('/auth/signup', { name, email, password }),
};

/* ================= AI CHAT ================= */

export const sendToAI = async (payload: {
  message: string;
  language: string;
  level: string;
}): Promise<AIResponse> => {
  return api
    .post<AIResponse>('/conversations/ai', payload)
    .then(res => res.data); // ici res.data sera typé AIResponse
};

/* ================= PROGRESS ================= */

export const progressAPI = {
  get: () => api.get('/progress'),
  update: (data: any) => api.post('/progress', data),
};

export default api;
