import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://api.kontenbase.com/query/api/v1/4649100a-1da3-43ec-a620-6c64e8f7bc96/',
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};