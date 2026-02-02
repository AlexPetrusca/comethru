const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for session tokens (in production, use Redis or database)
const sessions = new Map();

// Load environment variables
require('dotenv').config();

// Twilio configuration
const TWILIO_SERVICE_SID = process.env.TWILIO_SERVICE_SID;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to send OTP
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Validate environment variables
    if (!process.env.TWILIO_SERVICE_SID || !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return res.status(500).json({ error: 'Twilio configuration is missing' });
    }

    // Call Twilio API to send OTP
    const twilioResponse = await fetch(
      `https://verify.twilio.com/v2/Services/${process.env.TWILIO_SERVICE_SID}/Verifications`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `To=${encodeURIComponent(phoneNumber)}&Channel=sms`
      }
    );

    if (!twilioResponse.ok) {
      throw new Error(`Twilio API error: ${twilioResponse.statusText}`);
    }

    const twilioData = await twilioResponse.json();

    res.json({
      success: true,
      message: 'OTP sent successfully',
      verificationSid: twilioData.sid
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// API endpoint to verify OTP
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, verificationCode } = req.body;

    if (!phoneNumber || !verificationCode) {
      return res.status(400).json({ error: 'Phone number and verification code are required' });
    }

    // Validate environment variables
    if (!process.env.TWILIO_SERVICE_SID || !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return res.status(500).json({ error: 'Twilio configuration is missing' });
    }

    // Call Twilio API to verify the code
    const twilioResponse = await fetch(
      `https://verify.twilio.com/v2/Services/${process.env.TWILIO_SERVICE_SID}/VerificationCheck`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `To=${encodeURIComponent(phoneNumber)}&Code=${encodeURIComponent(verificationCode)}`
      }
    );

    if (!twilioResponse.ok) {
      throw new Error(`Twilio API error: ${twilioResponse.statusText}`);
    }

    const twilioData = await twilioResponse.json();

    if (twilioData.valid) {
      // Generate a session token
      const sessionToken = crypto.randomBytes(32).toString('hex');

      // Store session in memory (in production, use Redis or database)
      sessions.set(sessionToken, {
        phoneNumber,
        createdAt: Date.now(),
        verified: true
      });

      res.json({
        valid: true,
        sessionToken,
        message: 'Verification successful'
      });
    } else {
      res.status(400).json({
        valid: false,
        error: 'Invalid verification code'
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Proxy endpoint to backend service
app.get('/api/time', async (req, res) => {
  try {
    // In a real deployment, this would call the backend service
    // For now, we'll return a mock response since the backend may not be running
    // When deployed in Kubernetes, use the service name: http://comethru-backend.comethru.svc.cluster.local:80/api/time
    const BACKEND_HOST = process.env.BACKEND_HOST || 'comethru-backend.comethru.svc.cluster.local';
    const BACKEND_PORT = process.env.BACKEND_PORT || '80';
    const BACKEND_PATH = '/api/time';

    const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}${BACKEND_PATH}`;
    const response = await fetch(BACKEND_URL);

    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      // Return mock data if backend is not available
      res.json({
        currentTime: new Date().toISOString(),
        timestamp: Date.now()
      });
    }
  } catch (error) {
    console.error('Error calling backend:', error);
    // Return mock data if backend is not available
    res.json({
      currentTime: new Date().toISOString(),
      timestamp: Date.now()
    });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});