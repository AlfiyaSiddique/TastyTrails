import axios from 'axios'


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

export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post('/message/', data);