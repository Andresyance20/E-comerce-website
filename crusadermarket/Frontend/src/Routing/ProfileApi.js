import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth'; 

// Function to set up headers with the token
function getAuthHeaders(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

// Get user name
export const getUserName = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/name`, getAuthHeaders(token));
        return response.data; 
    } catch (error) {
        console.error('Error fetching user name:', error.response.data);
        throw error;
    }
};

// Get user email
export const getUserEmail = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/email`, getAuthHeaders(token));
        return response.data; 
    } catch (error) {
        console.error('Error fetching user email:', error.response.data);
        throw error;
    }
};

// Get user phone
export const getUserPhone = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/phone`, getAuthHeaders(token));
        return response.data; 
    } catch (error) {
        console.error('Error fetching user phone:', error.response.data);
        throw error;
    }
};


// Update user name
export const updateUserName = async (newName, token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/user/name`, { newName }, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error updating user name:', error.response.data);
        throw error;
    }
};

// Update email
export const updateUserEmail = async (newEmail, token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/user/email`, { newEmail }, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error updating user email:', error.response.data);
        throw error;
    }
};



// update phone 
export const updateUserPhone = async (newPhone, token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/user/phone`, { newPhone }, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error updating user phone:', error.response.data);
        throw error;
    }
};


