import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Sends child growth data to the backend API for AI analysis
 * @param {Object} childData - Object containing child's growth information
 * @param {string} childData.childName - Child's name
 * @param {number} childData.age - Age in months
 * @param {string} childData.gender - 'Male' or 'Female'
 * @param {number} childData.height - Height in cm
 * @param {number} childData.weight - Weight in kg
 * @returns {Promise<Object>} Analysis result from the AI
 */
export const analyzeStunting = async (childData) => {
  try {
    // For development, you might need to use your machine's local IP instead of localhost
    // if testing with a physical device
    const response = await axios.post(`${API_URL}/analyze-stunting`, childData);
    return response.data;
  } catch (error) {
    console.error('Error analyzing stunting:', error);
    throw error;
  }
};