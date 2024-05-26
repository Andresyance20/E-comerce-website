// SellsApi.js
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

// Get all sell posts by the user
export const getSells = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/posts`, getAuthHeaders(token));
        //console.log("here", response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching sells:', error.response.data);
        throw error;
    }
};
