require('dotenv').config();
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON request bodies

const SHEET_ID2 = '1S0gvUBlUNKkt-ho_IOXFOQaLev1x3JpWH5Toqj5-tgw'; // Google Sheet ID
const RANGE = 'BUY!A2:E2'; // Range to append data

// Google API OAuth setup
const auth = new google.auth.GoogleAuth({
  keyFile: 'service.json', // Path to your service account key JSON
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Constants for Google Sheets API
const SHEET_ID = process.env.SHEET_ID;
const API_KEY = process.env.API_KEY;
const STRATEGY_RANGE = process.env.STRATEGY_RANGE || 'Equity ETF Shop!G3:I13'; // Replace with your strategy range
const CMP_RANGE = process.env.CMP_RANGE || 'Equity ETF Shop!C3:C68';          // Replace with your CMP range
const STOCK_CODE_RANGE = process.env.STOCK_CODE_RANGE || 'Equity ETF Shop!A3:A68'; // Replace with your stock code range

// API to fetch strategy data
app.get('/api/strategy-data', async (req, res) => {
  try {
    // Fetch strategy data using axios
    const strategyResponse = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${STRATEGY_RANGE}?key=${API_KEY}`
    );
    const strategyResult = strategyResponse.data;

    // Fetch CMP data using axios
    const cmpResponse = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${CMP_RANGE}?key=${API_KEY}`
    );
    const cmpResult = cmpResponse.data;

    // Fetch Stock Code data using axios
    const stockCodeResponse = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${STOCK_CODE_RANGE}?key=${API_KEY}`
    );
    const stockCodeResult = stockCodeResponse.data;

    // Combine the data as per the logic
    const newCmpResults = [];
    strategyResult.values.forEach((strategyArray) => {
      const stockCodeFromStrategy = strategyArray[2]; // Assuming the stock code is at index 2

      stockCodeResult.values.forEach((stockCodeArray, stockIndex) => {
        const stockCodeFromData = stockCodeArray[0];

        if (stockCodeFromStrategy === stockCodeFromData) {
          newCmpResults.push(cmpResult.values[stockIndex][0]);
        }
      });
    });

    // Return the combined data
    res.status(200).json({
      strategyData: strategyResult.values || [],
      cmpData: newCmpResults || [],
      stockCodeData: stockCodeResult.values || [],
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Failed to fetch strategy data');
  }
});

// API endpoint to handle buy operation
app.post('/api/buy', async (req, res) => {
  const { stockDetails, cmp, totalInvestment, date, rowIndex } = req.body;

  // Ensure required data is present in the request
  if (!stockDetails || !cmp || !totalInvestment || !date || rowIndex === undefined) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
    const shares = Math.floor((totalInvestment / 40) / cmp);
    const stockCode = stockDetails[2]; // Assuming stock code is in the 3rd column (index 2)
    
    // Prepare data for appending
    const buyData = [
      [date, cmp, totalInvestment, stockCode, shares, rowIndex], // Append rowIndex to the sheet
    ];

    console.log(req.body);
    console.log(buyData);

    // Append data to the Google Sheet using axios
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      resource: {
        values: buyData,
      },
    });

    console.log('Data successfully appended to Google Sheets:', response.data);
    res.status(200).json({
      message: `Successfully bought ${shares} shares of ${stockCode} at CMP ${cmp}`,
    });
  } catch (error) {
    console.error('Error appending data to Google Sheets:', error);
    res.status(500).json({ error: 'Failed to execute the buy operation.' });
  }
});

// API endpoint to handle delete operation (specific to columns A to E)
app.delete('/api/delete/:stockCode', async (req, res) => {
    const { stockCode } = req.params; // Correctly retrieve stockCode from URL parameters
    console.log(`Stock code to delete: ${stockCode}`);
    
    if (!stockCode) {
      return res.status(400).json({ error: 'Missing stockCode in the request' });
    }
  
    try {
      // Fetch the sheet metadata to get the sheetId (by fetching all sheet info)
      const sheetMetadataResponse = await sheets.spreadsheets.get({
        spreadsheetId: SHEET_ID,
      });
  
      // Ensure the sheet exists and retrieve the sheetId
      const sheet = sheetMetadataResponse.data.sheets.find(sheet => sheet.properties.title === 'buy'); // Corrected sheet name to lowercase 'buy'
      if (!sheet) {
        return res.status(404).json({ error: 'Sheet named buy not found' });
      }
  
      const sheetId = sheet.properties.sheetId; // Sheet ID for the 'buy' sheet
      console.log('Sheet ID:', sheetId); // Debugging to verify sheetId
  
      // Fetch the entire sheet data from columns A to E using axios
      const sheetResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'buy!A:E', // Adjust the range to cover columns A to E
      });
  
      const rows = sheetResponse.data.values || [];
      console.log('Fetched rows from sheet:', rows); // Debugging fetched rows
  
      let rowIndexToDelete = -1;
  
      // Find the row index where the stockCode matches (assuming stockCode is in column D)
      rows.forEach((row, index) => {
        if (row[3] && row[3] === stockCode) { // Column D is the 4th column (index 3)
          rowIndexToDelete = index + 1; // Adjust index to match row number in the sheet (considering headers)
        }
      });
  
      if (rowIndexToDelete === -1) {
        return res.status(404).json({ error: `Row with stockCode ${stockCode} not found`});
      }
  
      // Use batchUpdate to delete the row
      const request = {
        spreadsheetId: SHEET_ID,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sheetId, // Correct sheetId here
                  dimension: 'ROWS',
                  startIndex: rowIndexToDelete - 1, // Zero-based index
                  endIndex: rowIndexToDelete, // End index is exclusive
                },
              },
            },
          ],
        },
      };
  
      const response = await sheets.spreadsheets.batchUpdate(request);
      console.log('Row deleted successfully:', response.data);
  
      res.status(200).json({
        message: `Successfully deleted the row with stockCode ${stockCode}.`,
      });
    } catch (error) {
      console.error('Error deleting row from Google Sheets:', error);
      res.status(500).json({ error: 'Failed to delete the row.' });
    }
  });
  
  // Helper function to find the row index for a given stock code
// const getRowIndexByStockCode = async (stockCode) => {
//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: SHEET_ID2,
//       range: 'buy!A2:A7', // Stock codes range
//     });

//     const stockCodes = response.data.values;

//     if (stockCodes) {
//       // Loop through stock codes and find the index of the given stockCode
//       for (let i = 0; i < stockCodes.length; i++) {
//         if (stockCodes[i][0] === stockCode) {
//           return i;  // Return the index of the row
//         }
//       }
//     }

//     return -1;  // Return -1 if stock code is not found
//   } catch (error) {
//     console.error('Error fetching stock codes:', error);
//     return -1;
//   }
// };

// API to update strategy data
// API to update strategy data
// API to update strategy data
app.put('/api/update', async (req, res) => {
  const { stockCode, shares, previousStockCode } = req.body;

  // Check if required data is provided
  if (!stockCode || shares === undefined || !previousStockCode) {
    return res.status(400).json({ error: 'Missing required data in the request body.' });
  }

  try {
    // Fetch the entire range of stock codes and corresponding shares
    const stockDataResponse = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/buy!D2:E`,
      {
        params: {
          key: API_KEY, // Use the API_KEY in the query
        },
      }
    );

    // Ensure data exists in the response
    const stockData = stockDataResponse.data.values || [];
    if (stockData.length === 0) {
      return res.status(404).json({ message: 'No stock data found in the sheet.' });
    }

    // Find the row containing the previousStockCode
    let rowIndex = -1;
    stockData.forEach((row, index) => {
      if (row[0] === previousStockCode) {
        rowIndex = index + 1; // Adjust index for the row number in the sheet
      }
    });

    if (rowIndex === -1) {
      return res.status(404).json({ error: `Stock code ${previousStockCode} not found. `});
    }

    // Prepare the data for update
    const updateData = [
      [stockCode, shares], // Update stockCode and shares
    ];

    // Update the sheet at the specific row
    const range = `buy!D${rowIndex + 1}:E${rowIndex + 1}`; // Construct range for the specific row
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: updateData,
      },
    });

    console.log('Row updated successfully:', updateResponse.data);
    res.status(200).json({ message: 'Stock data updated successfully.' });
  } catch (error) {
    console.error('Error updating stock data:', error);
    res.status(500).json({ error: 'Failed to update the stock data.' });
  }
});





// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
