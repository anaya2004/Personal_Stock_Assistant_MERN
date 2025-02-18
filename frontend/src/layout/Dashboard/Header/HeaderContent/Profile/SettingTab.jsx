import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { CommentOutlined, LockOutlined, QuestionCircleOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';

export default function SettingTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [investment, setInvestment] = useState(localStorage.getItem('totalInvestment') || 100000);
  const [profit, setprofit] = useState(localStorage.getItem('profitpercent') || 1.02);

  useEffect(() => {
     setInvestment(localStorage.getItem('totalInvestment') || 100000);
    setprofit(localStorage.getItem('profitpercent') || 1.02);
  }, []);

  console.log(profit);

  const handleSave = () => {
    localStorage.setItem('totalInvestment', investment);
    alert('Investment amount saved!');
  };

  const handleprofit = () => {
    localStorage.setItem('profitpercent', profit);
    alert('Your profit percent and sell recommendation will depend on this!!!');
  };

  return (
    <Box>
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <ListItemButton selected={selectedIndex === 0} onClick={() => setSelectedIndex(0)}>
          <ListItemIcon><QuestionCircleOutlined /></ListItemIcon>
          <ListItemText primary="Support" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 1} onClick={() => setSelectedIndex(1)}>
          <ListItemIcon><UserOutlined /></ListItemIcon>
          <ListItemText primary="Account Settings" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 2} onClick={() => setSelectedIndex(2)}>
          <ListItemIcon><LockOutlined /></ListItemIcon>
          <ListItemText primary="Privacy Center" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 3} onClick={() => setSelectedIndex(3)}>
          <ListItemIcon><CommentOutlined /></ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 4} onClick={() => setSelectedIndex(4)}>
          <ListItemIcon><UnorderedListOutlined /></ListItemIcon>
          <ListItemText primary="History" />
        </ListItemButton>
      </List>

      {selectedIndex === 1 && (
          <Box>
        <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6">Investment Settings</Typography>
          <TextField
            label="Total Investment"
            type="number"
            fullWidth
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
            Save Investment
          </Button>
          </Box>
          <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
        <Typography variant="h6">Profit Percentage</Typography>
        <TextField
        label="set percentage profit"
        type="number"
        fullWidth
        value={profit}
        onChange={(e) => setprofit(e.target.value)}
        sx={{ my : 2 } }
        />
       <Button variant="contained" color="primary" fullWidth onClick={handleprofit}>
        Save
       </Button>
       </Box>
    </Box>
    
  )}
  </Box>
  );
}
