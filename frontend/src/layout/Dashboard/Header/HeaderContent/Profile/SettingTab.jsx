import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Box, Typography, TextField, Button, Modal, Backdrop, Fade } from '@mui/material';
import { CommentOutlined, LockOutlined, QuestionCircleOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';

export default function SettingTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(() => {
    // Initialize from local storage or use default 100000
    return parseFloat(localStorage.getItem('totalInvestment')) || 100000;
  });

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Save totalInvestment to local storage whenever it changes
    localStorage.setItem('totalInvestment', totalInvestment);
  }, [totalInvestment]);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    if (index === 1) setOpenModal(true); // Open modal for Account Settings
  };

  const handleInvestmentChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0) {
      setTotalInvestment(value);
    }
  };

  const handleSaveInvestment = () => {
    alert(`Total Investment Set: $${totalInvestment}`);
    setOpenModal(false); // Close modal after saving
  };

  return (
    <Box>
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
          <ListItemIcon>
            <QuestionCircleOutlined />
          </ListItemIcon>
          <ListItemText primary="Support" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
          <ListItemIcon>
            <UserOutlined />
          </ListItemIcon>
          <ListItemText primary="Account Settings" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
          <ListItemIcon>
            <LockOutlined />
          </ListItemIcon>
          <ListItemText primary="Privacy Center" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
          <ListItemIcon>
            <CommentOutlined />
          </ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4)}>
          <ListItemIcon>
            <UnorderedListOutlined />
          </ListItemIcon>
          <ListItemText primary="History" />
        </ListItemButton>
      </List>

      {/* Modal for selecting total investment */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Set Total Investment
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={1}>
              Default Total Investment: $100,000
            </Typography>
            <TextField
              fullWidth
              type="number"
              label="Total Investment"
              value={totalInvestment}
              onChange={handleInvestmentChange}
              sx={{ marginBottom: 2 }}
              placeholder="Enter new investment value"
              inputProps={{ min: 0 }}
            />
            <Button variant="contained" color="primary" onClick={handleSaveInvestment}>
              Save Investment
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
