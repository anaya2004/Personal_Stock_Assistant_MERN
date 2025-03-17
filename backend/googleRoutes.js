const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

// Route to accept token and copy sheet
router.post('/copy-google-sheet', async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token }); // Use user's token

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fileMetadata = {
      name: 'Personal Copy - Equity ETF Shop'
    };

    // Copy the file (Replace YOUR_TEMPLATE_SHEET_ID with your main sheet id)
    const copyResponse = await drive.files.copy({
      fileId: '1vhGPEr8kC5TU3LubC1onE0dyy7eNnDKbnN63X9MhW_Y', 
      resource: fileMetadata
    });

    res.status(200).json({
      message: 'Sheet copied successfully',
      fileId: copyResponse.data.id,
      webViewLink: `https://docs.google.com/spreadsheets/d/${copyResponse.data.id}`
    });
  } catch (error) {
    console.error('Error copying sheet:', error);
    res.status(500).json({ message: 'Failed to copy sheet', error: error.message });
  }
});

module.exports = router;
