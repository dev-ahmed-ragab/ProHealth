import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Event, Schedule, Menu as MenuIcon } from '@mui/icons-material';
import DoctorViewAppointments from './DoctorViewAppointments';
import DoctorAvailableSlots from './DoctorAvailableSlots';
import DoctorAppointmentDetails from './DoctorAppointmentDetails';
import DoctorAppointments from './DoctorAppointments';

function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (
        !token ||
        !user ||
        !user.user ||
        user.user.role?.trim().toLowerCase() !== 'doctor'
      ) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [token, user, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (
    !user ||
    !user.user ||
    user.user.role?.trim().toLowerCase() !== 'doctor'
  ) {
    return null;
  }

  const drawerWidth = 240;

  const drawer = (
    <Box>
      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            fontWeight: 600,
            color: '#1A3C5A',
          }}
          aria-label="Doctor Dashboard"
        >
          Doctor Dashboard
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
      <List>
        <ListItem
          button
          component={Link}
          to="/doctor-dashboard/appointments"
          sx={{
            '&:hover': {
              backgroundColor: '#f0f4f8',
              '& .MuiListItemIcon-root': { color: '#0097A7' },
              '& .MuiListItemText-primary': { color: '#0097A7' },
            },
          }}
          aria-label="View Appointments"
        >
          <ListItemIcon sx={{ color: '#00ACC1', minWidth: '40px' }}>
            <Event fontSize="medium" />
          </ListItemIcon>
          <ListItemText
            primary="My Appointments"
            primaryTypographyProps={{
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 600,
              color: '#1A3C5A',
            }}
          />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/doctor-dashboard/available-slots"
          sx={{
            '&:hover': {
              backgroundColor: '#f0f4f8',
              '& .MuiListItemIcon-root': { color: '#0097A7' },
              '& .MuiListItemText-primary': { color: '#0097A7' },
            },
          }}
          aria-label="Manage Available Slots"
        >
          <ListItemIcon sx={{ color: '#00ACC1', minWidth: '40px' }}>
            <Schedule fontSize="medium" />
          </ListItemIcon>
          <ListItemText
            primary="Available Slots"
            primaryTypographyProps={{
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 600,
              color: '#1A3C5A',
            }}
          />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/doctor-dashboard/doctor-appointment"
          sx={{
            '&:hover': {
              backgroundColor: '#f0f4f8',
              '& .MuiListItemIcon-root': { color: '#0097A7' },
              '& .MuiListItemText-primary': { color: '#0097A7' },
            },
          }}
          aria-label="Doctor Appointments"
        >
          <ListItemIcon sx={{ color: '#00ACC1', minWidth: '40px' }}>
            <Schedule fontSize="medium" />
          </ListItemIcon>
          <ListItemText
            primary="Doctor Appointments"
            primaryTypographyProps={{
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 600,
              color: '#1A3C5A',
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{ display: 'flex', width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: { sm: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#1A3C5A' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: 600, color: '#1A3C5A' }}
          >
            Doctor Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#fff',
          mt: { xs: 7, sm: 0 },
        }}
      >
        <Box
          sx={{
            maxWidth: '1400px',
            mx: 'auto',
            width: '100%',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#005C97',
              lineHeight: 1.3,
              letterSpacing: '-0.5px',
              mb: 3,
            }}
            aria-label={`Welcome, Dr. ${user.user.name}`}
          >
            Welcome, Dr. {user.user.name}!
          </Typography>
          <Routes>
            <Route path="/appointments" element={<DoctorViewAppointments />} />
            <Route path="/available-slots" element={<DoctorAvailableSlots />} />
            <Route
              path="/doctor-appointment"
              element={<DoctorAppointments />}
            />
            <Route
              path="/appointment/:id"
              element={<DoctorAppointmentDetails />}
            />
            <Route
              path="/"
              element={
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    fontWeight: 600,
                    color: '#1A3C5A',
                  }}
                >
                  Welcome to Your Doctor Dashboard
                </Typography>
              }
            />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default DoctorDashboard;
