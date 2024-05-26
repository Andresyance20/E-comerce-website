// BuysApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/posts'; // Adjust this as per your actual API URL

// Function to set up headers with the token
function getAuthHeaders(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

// Get all posts that the user is interested in buying
export const getBuys = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/interests`, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error fetching buys:', error.response.data);
        throw error;
    }
};
