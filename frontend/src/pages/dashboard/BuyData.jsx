import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, useTheme } from '@mui/material';

function BuyData() {
  const [data, setData] = useState([]);
  const [rowsToShow, setRowsToShow] = useState(5); // Show only 5 rows initially
  const theme = useTheme(); // Theme for dark/light mode

  useEffect(() => {
    axios.get('http://localhost:5000/api/get-buy-sheet-data')
      .then(response => {
        console.log('Raw API Response:', response.data); // Debugging

        // Filter out empty arrays
        let cleanedData = response.data.filter(row => row.length > 0);

        // Remove the first row if it contains headers
        if (cleanedData.length > 0 && cleanedData[0][0] === "DATE") {
          cleanedData = cleanedData.slice(1);
        }

        setData(cleanedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleMoreRows = () => {
    setRowsToShow(data.length); // Show all rows
  };

  const handleLessRows = () => {
    setRowsToShow(5); // Reset to show only 5 rows
  };

  return (
    <Box>
      {data.length > 0 ? (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#0a2351' : '#0a2351', // Dark = Navy Blue, Light = Green
              }}
            >
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>CMP</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stock Code</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Suggested QTY</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>BUY PRICE</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actual QTY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(0, rowsToShow).map((row, index) => (
                <TableRow 
                  key={index}
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
                    '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? '#616161' : '#f5f5f5' },
                  }}
                >
                  <TableCell>{row[0]}</TableCell>
                  <TableCell>{row[1]}</TableCell>
                  <TableCell>{row[2]}</TableCell>
                  <TableCell>{row[3]}</TableCell>
                  <TableCell>{row[4]}</TableCell>
                  <TableCell>{row[5]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Loading...</p>
      )}

      {/* "More" and "Less" buttons */}
      <Box mt={2} display="flex" justifyContent="center">
        {rowsToShow < data.length && (
          <Button variant="contained" color="primary" onClick={handleMoreRows} sx={{ marginRight: 1 }}>
            Show More
          </Button>
        )}
        {rowsToShow > 5 && (
          <Button variant="contained" color="secondary" onClick={handleLessRows}>
            Show Less
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default BuyData;
