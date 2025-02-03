import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Box, Modal, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { NumericFormat } from 'react-number-format';

export default function OrderTable() {
  const [rows, setRows] = useState([]);
  const [cmpData, setCmpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalInvestment] = useState(100000);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [shareCount, setShareCount] = useState(0);

  useEffect(() => {
    const fetchStrategyData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/strategy-data');
        setRows(response.data.strategyData.slice(1)); // Skip the header row
        setCmpData(response.data.cmpData); // Set CMP data
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(true);
        setLoading(false);
      }
    };
    fetchStrategyData();
  }, []);

  const handleBuy = (rowIndex) => {
    setSelectedRow({
      stockDetails: rows[rowIndex],
      cmp: cmpData[rowIndex],
      shares: Math.floor((totalInvestment / 40) / cmpData[rowIndex]),
    });
    setShareCount(Math.floor((totalInvestment / 40) / cmpData[rowIndex]));
    setOpen(true);
  };

  const handleConfirmBuy = async () => {
    const currentDate = new Date().toISOString().split('T')[0];

    const buyData = {
      stockDetails: selectedRow.stockDetails,
      cmp: selectedRow.cmp,
      shares: shareCount,
      selectedShares: shareCount, // Include selected shares
      totalInvestment,
      date: currentDate,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/buy', buyData);
      alert(response.data.message);
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error during the buy operation:', error);
      alert('An error occurred while processing your request. Please try again.');
    }
  };

  const handleDelete = async (stockCode) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/delete/${stockCode}`);
      alert(response.data.message);
    } catch (error) {
      console.error('Error deleting strategy:', error);
      alert('An error occurred while deleting. Please try again.');
    }
  };
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching data</Typography>;

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'green', color: 'white' }}>
              <TableCell sx={{ color: 'white' }}>Rank</TableCell>
              <TableCell sx={{ color: 'white' }}>% from 52 Week Low</TableCell>
              <TableCell sx={{ color: 'white' }}>ETF Code</TableCell>
              <TableCell sx={{ color: 'white' }}>CMP</TableCell>
              <TableCell sx={{ color: 'white' }}>Shares</TableCell>
              <TableCell sx={{ color: 'white' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row[0]}</TableCell> {/* Rank */}
                <TableCell>{row[1]}</TableCell> {/* % from 52 Week Low */}
                <TableCell>{row[2]}</TableCell> {/* ETF Code */}
                <TableCell>
                  <NumericFormat value={cmpData[index]} displayType="text" thousandSeparator prefix="$" />
                </TableCell> {/* CMP */}
                <TableCell>{Math.floor((totalInvestment / 40) / cmpData[index])}</TableCell> {/* Shares */}
                <TableCell>
                  <Button variant="contained" color="success" size="small" onClick={() => handleBuy(index)}>Buy</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Buy Summary */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          {selectedRow && (
              <>
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Order Summary
                </Typography>
                <Typography>Stock: {selectedRow.stockDetails[2]}</Typography>
                <Typography>CMP: ${selectedRow.cmp}</Typography>
                <Typography>Total Investment: ${totalInvestment}</Typography>
                <Typography>Actual Shares: {selectedRow.shares}</Typography>

                {/* Input Box to Increase/Decrease Shares by 1 */}
                <Box display="flex" alignItems="center" marginY={2}>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => setShareCount(prev => Math.max(0, prev - 1))} 
                    sx={{ marginRight: 1 }}
                  >
                    -1
                  </Button>
                  <Typography>{shareCount}</Typography>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => setShareCount(prev => prev + 1)} 
                    sx={{ marginLeft: 1 }}
                  >
                    +1
                  </Button>
                </Box>

                <Button variant="contained" color="success" fullWidth onClick={handleConfirmBuy}>
                  Confirm Buy
                </Button>
              </>
            )}


        </Box>
      </Modal>
    </Box>
  );
}
