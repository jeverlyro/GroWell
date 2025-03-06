const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to analyze stunting risk using Python LLM
app.post('/api/analyze-stunting', async (req, res) => {
  try {
    const { childName, age, gender, height, weight } = req.body;
    
    // Validate input
    if (!age || !gender || !height || !weight) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    console.log('Received data:', { childName, age, gender, height, weight });
    
    // Call Python script for LLM-based analysis
    const pythonProcess = spawn('python', [
      './python/stunting_analysis.py',
      age,
      gender,
      height,
      weight
    ]);
    
    let analysisData = '';
    let errorData = '';
    
    // Collect data from script
    pythonProcess.stdout.on('data', (data) => {
      analysisData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error(`Python Error: ${data}`);
    });
    
    // When script finishes
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ 
          error: 'Analysis failed',
          details: errorData 
        });
      }
      
      try {
        // Parse the output from Python script
        const analysisResult = JSON.parse(analysisData);
        
        // Send response back to client
        res.json({
          result: analysisResult,
          childName,
          age,
          gender,
          height,
          weight
        });
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError);
        res.status(500).json({ 
          error: 'Failed to parse analysis result',
          raw: analysisData
        });
      }
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});