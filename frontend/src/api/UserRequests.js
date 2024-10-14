import axios from "axios";

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


export const getUser = (userId) => API.get(`/user/${userId}`);
export const getAllUser = ()=> API.get('/usernames')