#!/usr/bin/env python3
import sys
import json
import math
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API with your API key
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-2.0-flash')
except Exception as e:
    print(json.dumps({
        "error": f"Failed to initialize Gemini API: {str(e)}"
    }))
    sys.exit(1)

# Check if we have enough arguments
if len(sys.argv) != 5:
    print(json.dumps({
        "error": "Incorrect number of arguments. Expected: age, gender, height, weight"
    }))
    sys.exit(1)

# Get arguments
try:
    age_months = int(sys.argv[1])
    gender = sys.argv[2]
    height_cm = float(sys.argv[3])
    weight_kg = float(sys.argv[4])
except ValueError as e:
    print(json.dumps({
        "error": f"Invalid parameter format: {str(e)}"
    }))
    sys.exit(1)

# WHO Child Growth Standards reference data
# This is a simplified representation of WHO standards
def calculate_height_for_age_z(age_months, height_cm, gender):
    # Simplified WHO standards (median heights by age)
    if gender == 'Male':
        # Boys median height chart (simplified)
        expected_heights = {
            0: 49.9, 3: 61.4, 6: 67.6, 9: 72.3, 12: 76.0, 
            18: 82.3, 24: 87.1, 36: 94.9, 48: 102.3, 60: 109.9
        }
        # Standard deviations by age for boys
        sd_values = {
            0: 1.9, 3: 2.4, 6: 2.5, 9: 2.7, 12: 2.9,
            18: 3.1, 24: 3.4, 36: 3.8, 48: 4.2, 60: 4.6
        }
    else:  # Female
        # Girls median height chart (simplified)
        expected_heights = {
            0: 49.1, 3: 60.0, 6: 65.7, 9: 70.1, 12: 74.0, 
            18: 80.7, 24: 85.7, 36: 93.9, 48: 101.6, 60: 109.0
        }
        # Standard deviations by age for girls
        sd_values = {
            0: 1.8, 3: 2.3, 6: 2.4, 9: 2.6, 12: 2.8,
            18: 3.0, 24: 3.3, 36: 3.7, 48: 4.1, 60: 4.5
        }
    
    # Get closest age key
    closest_age = min(expected_heights.keys(), key=lambda k: abs(k - age_months))
    
    # Get expected height and SD for that age
    expected_height = expected_heights[closest_age]
    sd = sd_values[closest_age]
    
    # Calculate Z-score
    z_score = (height_cm - expected_height) / sd
    
    return z_score, expected_height

# Calculate BMI
bmi = weight_kg / ((height_cm / 100) ** 2)

# Calculate Z-score based on WHO standards
height_for_age_z, expected_height = calculate_height_for_age_z(age_months, height_cm, gender)

# Determine stunting classification based on Z-score
if height_for_age_z < -3:
    stunting_status = "Severely stunted"
    risk_level = "high"
    risk_percentage = 85
elif height_for_age_z < -2:
    stunting_status = "Stunted"
    risk_level = "medium"
    risk_percentage = 50
else:
    stunting_status = "Not stunted"
    risk_level = "low"
    risk_percentage = 15

# Use Gemini API for analysis
def gemini_analysis(age_months, gender, height_cm, weight_kg, height_for_age_z, bmi, stunting_status, expected_height):
    """
    Uses Google's Gemini API to generate analysis based on growth data.
    """
    try:
        prompt = f"""
        You are a pediatric nutrition expert analyzing child growth data. Provide a detailed analysis of this child's growth status:
        
        - Age: {age_months} months
        - Gender: {gender}
        - Height: {height_cm} cm
        - Weight: {weight_kg} kg
        - Height-for-age Z-score: {height_for_age_z:.2f}
        - BMI: {bmi:.2f}
        - Stunting Status: {stunting_status}
        - Expected height for age/gender: {expected_height:.1f} cm
        
        Please provide:
        1. A clear, concise analysis of the child's growth status in 3-4 sentences.
        2. Mention the significance of the Z-score.
        3. Compare their current height with expected height.
        4. If age > 24 months, include a brief BMI assessment.
        
        Write in a professional but accessible style that parents can understand. Keep the response focused and under 150 words.
        """
        
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        # Fallback to simulated response in case of API failure
        return simulate_llm_analysis(age_months, gender, height_cm, weight_kg, height_for_age_z, bmi, stunting_status, expected_height)

# Fallback function if Gemini API call fails
def simulate_llm_analysis(age_months, gender, height_cm, weight_kg, height_for_age_z, bmi, stunting_status, expected_height):
    """
    Simulates an LLM response based on growth data.
    Used as fallback if Gemini API call fails.
    """
    
    # Base analysis based on stunting status
    if stunting_status == "Severely stunted":
        analysis = (
            f"The child's height is significantly below the expected range for their age "
            f"with a z-score of {height_for_age_z:.2f}. This indicates severe stunting "
            f"which could impact physical development and cognitive function. "
            f"The expected height for a {gender.lower()} child at {age_months} months is "
            f"around {expected_height:.1f} cm, while this child measures {height_cm} cm. "
            f"This substantial difference requires immediate attention from healthcare providers."
        )
    elif stunting_status == "Stunted":
        analysis = (
            f"The child's height falls below the expected range for their age "
            f"with a z-score of {height_for_age_z:.2f}. This indicates moderate stunting "
            f"which may affect their growth trajectory. "
            f"At {age_months} months, a {gender.lower()} child typically measures around "
            f"{expected_height:.1f} cm, while this child is {height_cm} cm tall. "
            f"This difference should be discussed with a healthcare provider soon."
        )
    else:
        analysis = (
            f"The child's height is within the normal range for their age "
            f"with a z-score of {height_for_age_z:.2f}. "
            f"At {age_months} months, the expected height for a {gender.lower()} child is "
            f"around {expected_height:.1f} cm, and this child measures {height_cm} cm. "
            f"Their growth seems to be tracking well with WHO standards for their age group."
        )
    
    # Add BMI analysis
    if age_months > 24:  # BMI is more relevant after 2 years
        if bmi < 14:
            analysis += (
                f" Their BMI of {bmi:.1f} indicates they may be underweight. "
                f"Ensuring adequate caloric intake with nutrient-dense foods is important."
            )
        elif bmi > 18:
            analysis += (
                f" Their BMI of {bmi:.1f} is high for their age. "
                f"Focusing on balanced nutrition and physical activity is recommended."
            )
        else:
            analysis += (
                f" Their BMI of {bmi:.1f} is within the expected range for their age."
            )
            
    return analysis

# Use Gemini API for recommendations
def gemini_recommendations(stunting_status, age_months, bmi, gender):
    """
    Uses Google's Gemini API to generate personalized recommendations.
    """
    try:
        prompt = f"""
        You are a pediatric nutritionist providing recommendations for a child with the following metrics:
        
        - Age: {age_months} months
        - Gender: {gender}
        - BMI: {bmi:.2f}
        - Stunting Status: {stunting_status}
        
        Provide 5 specific, actionable recommendations for the child's caregivers to address their growth status.
        
        If the child is under 24 months, include breastfeeding guidance if appropriate.
        If the child has a BMI < 14, include recommendations for safely increasing caloric intake.
        If the child has a BMI > 18, include balanced nutrition and physical activity recommendations.
        
        Format as a bulleted list of concise recommendations.
        """
        
        response = model.generate_content(prompt)
        
        # Parse the bulleted list into an array of recommendations
        recommendations_text = response.text.strip()
        recommendations = []
        
        for line in recommendations_text.split('\n'):
            # Remove bullet points and whitespace
            clean_line = line.strip().lstrip('-•*').strip()
            if clean_line:  # Skip empty lines
                recommendations.append(clean_line)
        
        # Ensure we have at least a few recommendations
        if len(recommendations) < 3:
            return generate_recommendations(stunting_status, age_months, bmi)
            
        return recommendations
    except Exception as e:
        # Fallback to simulated recommendations in case of API failure
        return generate_recommendations(stunting_status, age_months, bmi)

# Fallback function for recommendations if Gemini API fails
def generate_recommendations(stunting_status, age_months, bmi):
    """
    Generates recommendations based on growth data.
    Used as fallback if Gemini API call fails.
    """
    recommendations = []
    
    # Base recommendations by stunting status
    if stunting_status == "Severely stunted":
        recommendations = [
            "Consult with a pediatrician or nutritionist immediately",
            "Focus on high-protein, nutrient-dense foods appropriate for your child's age",
            "Consider nutritional supplements as advised by healthcare professionals",
            "Increase meal frequency with smaller, nutrient-rich portions",
            "Monitor growth weekly and keep healthcare provider updated"
        ]
    elif stunting_status == "Stunted":
        recommendations = [
            "Schedule a check-up with a pediatrician within the next month",
            "Incorporate more protein-rich foods in daily meals",
            "Ensure adequate intake of calcium, vitamin D, and zinc",
            "Establish consistent meal times with balanced nutrition",
            "Track growth monthly and maintain a growth journal"
        ]
    else:
        recommendations = [
            "Continue regular check-ups with healthcare provider",
            "Maintain a balanced diet with adequate proteins and nutrients",
            "Encourage physical activity appropriate for age",
            "Ensure adequate sleep and regular meal times",
            "Monitor growth quarterly to ensure consistent progress"
        ]
    
    # Add age-specific recommendations
    if age_months < 24:
        if "Continue breastfeeding" not in " ".join(recommendations):
            recommendations.append("Continue breastfeeding alongside complementary foods as recommended by WHO")
    
    # Add BMI-specific recommendations for older children
    if age_months > 24:
        if bmi < 14:
            recommendations.append("Focus on energy-dense foods while maintaining nutritional quality")
        elif bmi > 18:
            recommendations.append("Encourage more physical activity and limit highly processed foods")
    
    return recommendations

# Generate analysis using Gemini
try:
    analysis_text = gemini_analysis(
        age_months, gender, height_cm, weight_kg, height_for_age_z, bmi, stunting_status, expected_height
    )
except Exception as e:
    print(json.dumps({
        "error": f"Failed to generate analysis: {str(e)}"
    }))
    sys.exit(1)

# Generate recommendations using Gemini
try:
    recommendations = gemini_recommendations(stunting_status, age_months, bmi, gender)
except Exception as e:
    print(json.dumps({
        "error": f"Failed to generate recommendations: {str(e)}"
    }))
    sys.exit(1)

# Prepare response
response = {
    "stunting_status": stunting_status,
    "risk_level": risk_level,
    "risk_percentage": risk_percentage,
    "height_for_age_z": round(height_for_age_z, 2),
    "bmi": round(bmi, 2),
    "analysis": analysis_text,
    "recommendations": recommendations,
    # Additional data points that could be useful for the app
    "growth_metrics": {
        "expected_height": round(expected_height, 1),
        "expected_height_range": {
            "min": round(expected_height - 2 * (5 if gender == "Male" else 4.5), 1),
            "max": round(expected_height + 2 * (5 if gender == "Male" else 4.5), 1)
        }
    }
}

# Output as JSON
print(json.dumps(response))