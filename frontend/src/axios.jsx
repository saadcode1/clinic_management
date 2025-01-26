import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/', // Replace with your backend URL
});

// Add token to headers if available
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default instance;
