import axios from 'axios';

const API_BASE_URL = "http://localhost:2026/api";

class AuthService {
    register(customer) {
        return axios.post(`${API_BASE_URL}/register`, customer);
    }

    login(credentials) {
        return axios.post(`${API_BASE_URL}/login`, credentials);
    }
}

export default new AuthService();