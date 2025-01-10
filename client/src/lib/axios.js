import axios from 'axios';


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api"

const axiosInstance = axios.create({
  baseURL: BASE_URL, // replace with your API URL
  withCredentials: true, // set to true to use the credentials returned
  timeout: 10000,
});


export default axiosInstance;