import xAxios from 'axios';

export const baseURL = "http://localhost:3000"

const axios = xAxios.create({
  baseURL: baseURL,
  withCredentials: true
});

export default axios;