import axios from 'axios';

const API_URL = 'http://192.168.137.1:5000/api';
const USE_MOCK = true; // Set to false when your backend is working

export const analyzeStunting = async (childData) => {
  try {
    if (USE_MOCK) {
      // Return mock data for testing
      console.log('Using mock API response');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      const expectedHeight = childData.gender === 'Male' 
        ? 45 + (childData.age * 0.5) 
        : 44 + (childData.age * 0.5);
      
      const heightForAgeZ = (childData.height - expectedHeight) / 5;
      
      let riskLevel, riskPercentage, stunting_status;
      if (heightForAgeZ < -3) {
        riskLevel = 'high';
        riskPercentage = 85;
        stunting_status = "Severely stunted";
      } else if (heightForAgeZ < -2) {
        riskLevel = 'medium';
        riskPercentage = 50;
        stunting_status = "Stunted";
      } else {
        riskLevel = 'low';
        riskPercentage = 15;
        stunting_status = "Not stunted";
      }
      
      return {
        result: {
          stunting_status,
          risk_level: riskLevel,
          risk_percentage: riskPercentage,
          height_for_age_z: parseFloat(heightForAgeZ.toFixed(2)),
          bmi: parseFloat((childData.weight / ((childData.height / 100) ** 2)).toFixed(2)),
          analysis: `Based on WHO growth standards, this ${childData.gender.toLowerCase()} child at ${childData.age} months has a height-for-age Z-score of ${heightForAgeZ.toFixed(2)}. ${stunting_status === "Not stunted" ? "The child appears to be growing at a normal rate." : stunting_status === "Stunted" ? "The child shows signs of stunting that should be addressed." : "The child shows significant stunting that requires medical attention."}`,
          recommendations: [
            "Ensure regular height and weight monitoring",
            "Maintain a balanced diet with adequate proteins, vitamins, and minerals",
            "Consult with a pediatrician for personalized guidance",
            "Ensure adequate sleep and physical activity",
            "Monitor growth regularly to track progress"
          ],
          growth_metrics: {
            expected_height: parseFloat(expectedHeight.toFixed(1)),
            expected_height_range: {
              min: parseFloat((expectedHeight - 10).toFixed(1)),
              max: parseFloat((expectedHeight + 10).toFixed(1))
            }
          }
        },
        childName: childData.childName,
        age: childData.age,
        gender: childData.gender,
        height: childData.height,
        weight: childData.weight
      };
    }
    
    // Real API call
    const response = await axios.post(`${API_URL}/analyze-stunting`, childData);
    return response.data;
  } catch (error) {
    console.error('Error analyzing stunting:', error);
    throw error;
  }
};