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

<<<<<<< HEAD
const SHEET_ID2 = '1vhGPEr8kC5TU3LubC1onE0dyy7eNnDKbnN63X9MhW_Y'; // Google Sheet ID
const RANGE = 'buy!A2:E';// Range to append data

// Google API OAuth setup
const auth = new google.auth.GoogleAuth({
  keyFile: 'PSA.json', // Path to your service account key JSON
=======
const SHEET_ID2 = '1S0gvUBlUNKkt-ho_IOXFOQaLev1x3JpWH5Toqj5-tgw'; // Google Sheet ID
const RANGE = 'buy!A3:F';// Range to append data

// Google API OAuth setup
const auth = new google.auth.GoogleAuth({
  keyFile: 'service.json', // Path to your service account key JSON
>>>>>>> origin/aditya
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
  ],
});

const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });

// Constants for Google Sheets API
const SHEET_ID = process.env.SHEET_ID;
const API_KEY = process.env.API_KEY;
const STRATEGY_RANGE = process.env.STRATEGY_RANGE || 'Equity ETF Shop!G3:I13';
const CMP_RANGE = process.env.CMP_RANGE || 'Equity ETF Shop!C3:C68';
const STOCK_CODE_RANGE = process.env.STOCK_CODE_RANGE || 'Equity ETF Shop!A3:A68';

// Function to copy the sheet to the user's account
const copySheetToUserAccount = async () => {
  try {
    const fileMetadata = {
      name: 'Copied Strategy Sheet',
    };

    const response = await drive.files.copy({
      fileId: SHEET_ID,
      resource: fileMetadata,
    });

    return response.data;
  } catch (error) {
    console.error('Error copying sheet:', error);
    throw error;
  }
};

// API to fetch strategy data and copy the sheet
app.get('/api/strategy-data', async (req, res) => {
  try {
    // Copy the sheet to the user's account
    const copiedSheet = await copySheetToUserAccount();
    console.log('Sheet copied successfully:', copiedSheet);

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

    // Return the combined data along with copied sheet info
    res.status(200).json({
      strategyData: strategyResult.values || [],
      cmpData: newCmpResults || [],
      stockCodeData: stockCodeResult.values || [],
      copiedSheet: copiedSheet,
    });
  } catch (error) {
    console.error('Error fetching data or copying sheet:', error);
    res.status(500).send('Failed to fetch strategy data or copy the sheet');
  }
});
 
app.get('/api/get-buy-sheet-data', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });
    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      res.status(404).json({ message: 'No data found in the sheet' });
    } else {
      res.status(200).json(rows);
    }
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    res.status(500).json({ error: 'Failed to fetch data from the sheet' });
  }
});

// API endpoint to handle buy operation
app.post('/api/buy', async (req, res) => {
<<<<<<< HEAD
  const { stockDetails, cmp, totalInvestment, date, rowIndex } = req.body;

  // Ensure required data is present in the request
  if (!stockDetails || !cmp || !totalInvestment || !date || rowIndex === undefined) {
=======
  const { stockDetails, cmp, shares, selectedShares, buyPrice, date } = req.body;

  // Ensure required data is present
  if (!stockDetails || !cmp || !date || selectedShares === undefined || !buyPrice) {
>>>>>>> origin/aditya
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
<<<<<<< HEAD
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
=======
    const stockCode = stockDetails[2]; // Assuming stock code is in the 3rd column (index 2)

    // Prepare data in the correct order for Google Sheets
    const buyData = [[date, cmp, stockCode, shares, buyPrice, selectedShares]];

    console.log('Received Data:', req.body);
    console.log('Formatted Data for Sheets:', buyData);

    // Append data to Google Sheets
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'buy!A3:F', // Ensure this matches the correct sheet name
      valueInputOption: 'USER_ENTERED',
>>>>>>> origin/aditya
      resource: {
        values: buyData,
      },
    });

    console.log('Data successfully appended to Google Sheets:', response.data);
    res.status(200).json({
<<<<<<< HEAD
      message: `Successfully bought ${shares} shares of ${stockCode} at CMP ${cmp}`,
=======
      message: `Successfully bought ${selectedShares} shares of ${stockCode} at CMP ${cmp} with Buy Price ${buyPrice}.`,
>>>>>>> origin/aditya
    });
  } catch (error) {
    console.error('Error appending data to Google Sheets:', error);
    res.status(500).json({ error: 'Failed to execute the buy operation.' });
  }
});

<<<<<<< HEAD
=======
app.get('/api/sell-recommendations', async (req, res) => {
  try {
    // 1️⃣ Fetch Buy Sheet Data
    const buySheetResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'buy!A3:F', // Ensure this contains Date, CMP, Stock Code, Shares, Buy Price, Selected Shares
    });

    const buySheetData = buySheetResponse.data.values || [];
    console.log('📊 Buy Sheet Data:', buySheetData);

    if (!buySheetData.length) {
      return res.status(200).json({ sellRecommendations: [] });
    }

    // 2️⃣ Fetch ETF Equity Shop Data
    const etfResponse = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${STOCK_CODE_RANGE}?key=${API_KEY}`
    );

    const etfStockCodes = etfResponse.data.values || [];
    console.log('📈 ETF Stock Codes:', JSON.stringify(etfResponse.data, null, 2));

    // 3️⃣ Fetch Current CMP Data
    const cmpResponse = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${CMP_RANGE}?key=${API_KEY}`
    );

    const cmpData = cmpResponse.data.values || [];
    console.log('💰 CMP Data:', JSON.stringify(cmpResponse.data, null, 2));

    if (!etfStockCodes.length || !cmpData.length) {
      return res.status(200).json({ sellRecommendations: [] });
    }

    // 4️⃣ Calculate Sell Recommendations
    const sellRecommendations = [];

    buySheetData.forEach((row) => {
      const [date, buyCMP, stockCode, shares, buyPrice] = row;

      // Ensure data is valid
      if (!date || !buyCMP || !stockCode || !shares || !buyPrice) {
        console.warn('⚠️ Skipping row due to missing data:', row);
        return;
      }

      const cleanBuyCMP = parseFloat(buyPrice);
      if (isNaN(cleanBuyCMP)) {
        console.warn('⚠️ Invalid Buy CMP for:', stockCode);
        return;
      }

      etfStockCodes.forEach((etfRow, index) => {
        if (etfRow[0] === stockCode) {
          const cmpRow = cmpData[index] || [];
          const currentCMP = parseFloat(cmpRow[0]);

          if (!cmpRow.length || isNaN(currentCMP)) {
            console.warn(`⚠️ Missing CMP data for stock: ${stockCode}, skipping...`);
            return;
          }

          if (currentCMP >= cleanBuyCMP * 1.02) {
            console.log(`📌 ${stockCode} triggered sell: BuyCMP = ${cleanBuyCMP}, CurrentCMP = ${currentCMP}`);

            sellRecommendations.push({
              date,
              stockCode,
              buyPrice: cleanBuyCMP,
              currentCMP,
              shares,
              recommendation: `Sell ${shares} shares of ${stockCode}`,
            });
          }
        }
      });
    });

    console.log('✅ Sell Recommendations:', sellRecommendations);

    res.status(200).json({ sellRecommendations });
  } catch (error) {
    console.error('❌ Error fetching sell recommendations:', error);
    res.status(500).json({ error: 'Failed to generate sell recommendations' });
  }
});


//sell sheet data 
app.post('/api/sell', async (req, res) => {
  try {
    console.log('Received sell request:', req.body); // ✅ Check incoming request data

    const { etfCode, sellPrice, sellDate } = req.body;
    if (!etfCode || !sellPrice || !sellDate) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // 🛑 Fetch buy sheet data
    const buySheetResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'buy!A3:F'
    });

    const buySheetData = buySheetResponse.data.values || [];
    console.log('Fetched buy sheet data:', buySheetData); // ✅ Debugging buy sheet

    let buyRowIndex = -1;
    let buyEntry = null;

    // Find matching row in buy sheet
    buySheetData.forEach((row, index) => {
      if (row[2] === etfCode) { // Adjust index based on actual buy sheet columns
        buyRowIndex = index + 3; 
        buyEntry = {
          buyDate: row[0] || 'N/A',
          underlyingAsset: row[1] || 'N/A',
          buyPrice: parseFloat(row[3]) || 0,
          actualBuyQty: parseInt(row[4]) || 0,
          suggestedQty: parseInt(row[5]) || 0,
          investedAmount: parseFloat(row[3]) * parseInt(row[4]) || 0,
          investedAmountOnSellDate: parseFloat(sellPrice) * parseInt(row[4]) || 0
        };
      }
    });

    if (!buyEntry) {
      console.log('❌ No matching buy entry found for:', etfCode);
      return res.status(404).json({ error: 'Matching buy entry not found' });
    }

    console.log('✅ Matched buy entry:', buyEntry);

    // Insert into "sell" sheet
    const sellData = [[
      buyEntry.buyDate,
      etfCode,
      buyEntry.underlyingAsset,
      buyEntry.buyPrice,
      buyEntry.actualBuyQty,
      buyEntry.suggestedQty,
      buyEntry.investedAmount,
      sellPrice,
      sellDate,
      buyEntry.investedAmountOnSellDate
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'sell!A3:J',
      valueInputOption: 'USER_ENTERED',
      resource: { values: sellData }
    });

    console.log(`✅ Sell data for ${etfCode} recorded successfully.`);

    // 🛑 Delete from "buy" sheet
    if (buyRowIndex !== -1) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: SHEET_ID,
                dimension: 'ROWS',
                startIndex: buyRowIndex - 1,
                endIndex: buyRowIndex
              }
            }
          }]
        }
      });

      console.log(`✅ Deleted ${etfCode} from buy sheet.`);
    }

    res.status(200).json({
      message: `Successfully sold ${buyEntry.actualBuyQty} shares of ${etfCode} at ${sellPrice}.`
    });

  } catch (error) {
    console.error('❌ Error handling sell transaction:', error);
    res.status(500).json({ error: 'Failed to process the sell transaction.' });
  }
});


>>>>>>> origin/aditya
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
<<<<<<< HEAD
});
=======
});
>>>>>>> origin/aditya
