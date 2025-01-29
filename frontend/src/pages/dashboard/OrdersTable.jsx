import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';
import { NumericFormat } from 'react-number-format';

export default function OrderTable() {
  const [rows, setRows] = useState([]);
  const [cmpData, setCmpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalInvestment] = useState(100000);

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

  const handleBuy = async (rowIndex) => {
    const stockDetails = rows[rowIndex];
    const cmp = cmpData[rowIndex];
    const shares = Math.floor((totalInvestment / 40) / cmp);
    const currentDate = new Date().toISOString().split('T')[0];

    const buyData = {
      stockDetails,
      cmp,
      totalInvestment,
      date: currentDate,
      rowIndex,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/buy', buyData);
      alert(response.data.message);
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
                  <Button variant="contained" color="success" size="small" sx={{ marginRight: 1 }} onClick={() => handleBuy(index)}>Buy</Button>
                  {/* <Button variant="contained" color="error" size="small" onClick={() => handleDelete(row[2])}>Delete</Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
