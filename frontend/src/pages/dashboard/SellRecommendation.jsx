import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Box, Button, useTheme
} from '@mui/material';
import { NumericFormat } from 'react-number-format';

export default function SellRecommendation() {
  const [sellRecommendations, setSellRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const theme = useTheme();  // Access current theme (light/dark)

  useEffect(() => {
    const fetchSellRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sell-recommendations');
        setSellRecommendations(response.data.sellRecommendations);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch sell recommendations:', err);
        setError(true);
        setLoading(false);
      }
    };
    fetchSellRecommendations();
  }, []);

  const handleSell = async (etfCode, sellPrice) => {
    try {
      const sellDate = new Date().toISOString().split('T')[0]; // Get current date
      const response = await axios.post('http://localhost:5000/api/sell', {
        etfCode,
        sellPrice,
        sellDate
      });

      alert(response.data.message);
      window.location.reload(); // Refresh after selling
    } catch (error) {
      console.error('Sell request failed:', error);
      alert('Sell request failed. Please try again.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching data</Typography>;

  return (
    <Box   sx={{
      flex: 1,
     
      height: '350px',
      overflowY: 'auto',
      borderRadius: '10px' }}>
      <TableContainer>
        <Table>
          <TableHead sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#0a2351' : '#0a2351', // Dark background in dark mode
            color: theme.palette.mode === 'dark' ? '#fff' : '#fff'  // White text in both modes
          }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Stock Code</TableCell>
              <TableCell sx={{ color: 'white' }}>Buy PRICE</TableCell>
              <TableCell sx={{ color: 'white' }}>Current CMP</TableCell>
              <TableCell sx={{ color: 'white' }}>Shares</TableCell>
              <TableCell sx={{ color: 'white' }}>Recommendation</TableCell>
              <TableCell sx={{ color: 'white' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellRecommendations.length > 0 ? (
              sellRecommendations.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff', // Row background color change
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? '#616161' : '#f5f5f5', // Hover effect color change
                    },
                  }}
                >
                  <TableCell>{row.stockCode}</TableCell>
                  <TableCell>
                    <NumericFormat value={row.buyPrice} displayType="text" thousandSeparator prefix="₹" />
                  </TableCell>
                  <TableCell>
                    <NumericFormat value={row.currentCMP} displayType="text" thousandSeparator prefix="₹" />
                  </TableCell>
                  <TableCell>{row.selectedShares}</TableCell>
                  <TableCell>{row.recommendation}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleSell(row.stockCode, row.currentCMP)}
                      sx={{
                        backgroundColor: theme.palette.mode === 'dark' ? '#64b5f6' : '#1976d2', // Button background color change
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#42a5f5' : '#1565c0', // Hover effect for button
                        }
                      }}
                    >
                      SELL
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No Sell Recommendations</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
