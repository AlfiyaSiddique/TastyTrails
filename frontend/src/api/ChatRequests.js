import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

// Add token to the request headers
API.interceptors.request.use((req) => {
  let token = localStorage.getItem("tastytoken");
  if (token) {
    token = JSON.parse(token);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Chat Requests
export const createChat = (data) => API.post('/chat/', data);

export const userChats = (id) => API.get(`/chat/${id}`);

export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);
