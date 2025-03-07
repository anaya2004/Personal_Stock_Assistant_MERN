import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, useTheme } from '@mui/material';

function SellData() {
  const [data, setData] = useState([]);
  const [rowsToShow, setRowsToShow] = useState(5); // Show only 5 rows initially
  const theme = useTheme(); // Access theme for dark/light mode

  useEffect(() => {
    axios.get('http://localhost:5000/api/get-sell-sheet-data')
      .then(response => {
        setData(response.data);
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#0a2351' : '#0a2351',
            }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Buy Date</TableCell>
                <TableCell sx={{ color: 'white' }}>ETF Code</TableCell>
                <TableCell sx={{ color: 'white' }}>Underlying Asset</TableCell>
                <TableCell sx={{ color: 'white' }}>Actual Shares</TableCell>
                <TableCell sx={{ color: 'white' }}>Buy Price</TableCell>
                <TableCell sx={{ color: 'white' }}>Suggested Shares</TableCell>
                <TableCell sx={{ color: 'white' }}>Invested Amount</TableCell>
                <TableCell sx={{ color: 'white' }}>Sell Price</TableCell>
                <TableCell sx={{ color: 'white' }}>Sell Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Invested Amt Till Date</TableCell>
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
                  <TableCell>{row.buyDate}</TableCell>
                  <TableCell>{row.etfCode}</TableCell>
                  <TableCell>{row.underlyingAsset}</TableCell>
                  <TableCell>{row.actualShare}</TableCell>
                  <TableCell>{row.buyPrice}</TableCell>
                  <TableCell>{row.suggestedShare}</TableCell>
                  <TableCell>{row.investedAmt}</TableCell>
                  <TableCell>{row.sellPrice}</TableCell>
                  <TableCell>{row.sellDate}</TableCell>
                  <TableCell>{row.investedAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>Loading...</p>
      )}

      {/* "More" and "Less" buttons */}
      <Box mt={2} display="flex" justifyContent="center">
        {rowsToShow < data.length && (
          <Button variant="outlined" color="primary" onClick={handleMoreRows} sx={{ marginRight: 1 }}>
            More
          </Button>
        )}
        {rowsToShow > 5 && (
          <Button variant="outlined" color="secondary" onClick={handleLessRows}>
            Less
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default SellData;
