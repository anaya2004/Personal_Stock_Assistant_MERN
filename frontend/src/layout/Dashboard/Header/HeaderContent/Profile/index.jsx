import PropTypes from 'prop-types';
<<<<<<< HEAD
import { useRef, useState, useEffect } from 'react';
=======
import { useRef, useState } from 'react';
>>>>>>> origin/aditya

// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

<<<<<<< HEAD
// project imports
=======
// project import
>>>>>>> origin/aditya
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
<<<<<<< HEAD
import defaultAvatar from 'assets/images/users/avatar-1.png';
=======
import avatar1 from 'assets/images/users/avatar-1.png';
>>>>>>> origin/aditya

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}
<<<<<<< HEAD
export default function Profile() {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('googleUser'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
=======

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const theme = useTheme();

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

>>>>>>> origin/aditya
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
<<<<<<< HEAD
  const handleLogout = () => {
    localStorage.removeItem('googleAuthToken');
    localStorage.removeItem('googleUser');
    setUser(null);
    setOpen(false);
    window.location.reload(); // Refresh to reflect logout state
  };
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const iconBackColorOpen = 'grey.100';
=======

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const iconBackColorOpen = 'grey.100';

>>>>>>> origin/aditya
  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
          '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 0.5 }}>
<<<<<<< HEAD
          <Avatar alt="profile user" src={user?.picture || defaultAvatar} size="sm" />
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            {user?.name || 'Guest'}
=======
          <Avatar alt="profile user" src={avatar1} size="sm" />
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            John Doe
>>>>>>> origin/aditya
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: 290, minWidth: 240, maxWidth: { xs: 250, md: 290 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Stack direction="row" spacing={1.25} alignItems="center">
<<<<<<< HEAD
                          <Avatar alt="profile user" src={user?.picture || defaultAvatar} sx={{ width: 32, height: 32 }} />
                          <Stack>
                            <Typography variant="h6">{user?.name || 'Guest'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user ? 'Logged in' : 'Not logged in'}
=======
                          <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} />
                          <Stack>
                            <Typography variant="h6">John Doe</Typography>
                            <Typography variant="body2" color="text.secondary">
                              UI/UX Designer
>>>>>>> origin/aditya
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
<<<<<<< HEAD
                      {user && (
                        <Grid item>
                          <Tooltip title="Logout">
                            <IconButton size="large" sx={{ color: 'text.primary' }} onClick={handleLogout}>
                              <LogoutOutlined />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
=======
                      <Grid item>
                        <Tooltip title="Logout">
                          <IconButton size="large" sx={{ color: 'text.primary' }}>
                            <LogoutOutlined />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>

>>>>>>> origin/aditya
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                      <Tab
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textTransform: 'capitalize'
                        }}
                        icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                        label="Profile"
                        {...a11yProps(0)}
                      />
                      <Tab
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textTransform: 'capitalize'
                        }}
                        icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                        label="Setting"
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <ProfileTab />
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <SettingTab />
                  </TabPanel>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
<<<<<<< HEAD
=======

>>>>>>> origin/aditya
TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.number, index: PropTypes.number, other: PropTypes.any };
