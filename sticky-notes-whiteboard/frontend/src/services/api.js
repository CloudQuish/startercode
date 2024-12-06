import axios from "axios"

const BASE_URL = 'http://localhost:4000/api';

// Define API routes as an object
const API_ROUTES = {
  // Authentication Routes
  USERS: {
    LOGIN: `${BASE_URL}/user/login`,
    REGISTER: `${BASE_URL}/user/signup`,
  },

  // User Routes
  FLOWS: {
    FLOW: `${BASE_URL}/flows`,
  },
};

export default API_ROUTES;