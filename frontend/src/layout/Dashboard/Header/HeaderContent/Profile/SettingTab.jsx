import { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { CommentOutlined, LockOutlined, QuestionCircleOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { ThemeModeContext } from "../../../../../themes"; // ✅ Correct import
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function SettingTab() {
  const { themeMode, toggleTheme } = useContext(ThemeModeContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [investment, setInvestment] = useState(localStorage.getItem('totalInvestment') || 100000);
  const [profit, setProfit] = useState(localStorage.getItem('profitpercent') || 1.02);

  useEffect(() => {
    setInvestment(localStorage.getItem('totalInvestment') || 100000);
    setProfit(localStorage.getItem('profitpercent') || 1.02);
  }, []);

  const handleSave = () => {
    localStorage.setItem('totalInvestment', investment);
    alert('Investment amount saved!');
  };

  const handleProfit = () => {
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
        {/* Dark Mode Toggle Button */}
        <ListItemButton onClick={toggleTheme}>
          <ListItemIcon>
            {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>
          <ListItemText primary={themeMode === 'light' ? 'Dark Mode' : 'Light Mode'} />
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
              label="Set Percentage Profit"
              type="number"
              fullWidth
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              sx={{ my: 2 }}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleProfit}>
              Save
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
