import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function BuyData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/get-buy-sheet-data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      {/* <h3>Sheet Data</h3> */}
      {data.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'green', color: 'white' }}>
                <TableCell  sx={{ color: 'white' }}>Date</TableCell>
                <TableCell sx={{ color: 'white' }}>CMP</TableCell>
                <TableCell sx={{ color: 'white' }}>Stock Code</TableCell>
                <TableCell sx={{ color: 'white' }}>Suggested QTY</TableCell>
                <TableCell sx={{ color: 'white' }}>BUY PRICE</TableCell>
                <TableCell sx={{ color: 'white' }}>Actual QTY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
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
        <p>Loading...</p>
      )}
    </div>
  );
}

export default BuyData;
