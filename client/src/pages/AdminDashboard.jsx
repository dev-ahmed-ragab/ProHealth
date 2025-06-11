import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Event,
  Schedule,
  Person,
  Group,
  BarChart,
  MedicalServices,
} from '@mui/icons-material';
import AppointmentsList from './AppointmentsList';
import DoctorAppointments from './DoctorAppointments';
import AvailableSlots from './AvailableSlots';
import AppointmentDetails from './AppointmentDetails';
import UsersList from './UsersList';
import DoctorsList from './DoctorsList';
import StatisticsDashboard from './StatisticsDashboard';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkAuth = async () => {
      if (!token || !user || !user.user || user.user.role !== 'admin') {
        navigate('/login');
      }
    };
    checkAuth();
  }, [token, user, navigate]);

  if (!user || !user.user || user.user.role !== 'admin') {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: { xs: 200, sm: 240 },
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: { xs: 200, sm: 240 },
            boxSizing: 'border-box',
            background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
        role="navigation"
        aria-label="Admin Dashboard Navigation"
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 700,
              color: '#1A3C5A',
            }}
          >
            Admin Dashboard
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
        <List>
          {[
            {
              text: 'Statistics',
              icon: <BarChart sx={{ color: '#00ACC1' }} />,
              path: '/admin-dashboard/statistics',
            },
            {
              text: 'All Appointments',
              icon: <Event sx={{ color: '#00ACC1' }} />,
              path: '/admin-dashboard/appointments',
            },
            {
              text: 'Doctor Appointments',
              icon: <Person sx={{ color: '#00ACC1' }} />,
              path: '/admin-dashboard/doctor-appointments',
            },
            {
              text: 'Available Slots',
              icon: <Schedule sx={{ color: '#00ACC1' }} />,
              path: '/admin-dashboard/available-slots',
            },
            {
              text: 'Manage Users',
              icon: <Group sx={{ color: '#00ACC1' }} />,
              path: '/admin-dashboard/users',
            },
            {
              text: 'All Doctors',
              icon: <MedicalServices sx={{ color: '#00ACC1' }} />,
              path: '/admin-dashboard/doctors',
            },
          ].map((item) => (
            <ListItem
              key={item.text}
              button
              component={Link}
              to={item.path}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 172, 193, 0.1)',
                  '& .MuiListItemIcon-root': { color: '#0097A7' },
                  '& .MuiListItemText-primary': { color: '#0097A7' },
                },
              }}
              aria-label={`Navigate to ${item.text}`}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 600,
                  color: '#1A3C5A',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          py: { xs: 6, md: 8 },
          backgroundColor: '#fff',
        }}
      >
        <Container maxWidth="lg" sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
              fontWeight: 700,
              color: '#005C97',
              mb: 4,
              lineHeight: 1.3,
              letterSpacing: '-0.5px',
            }}
          >
            Welcome, {user.user.name}!
          </Typography>
          <Box
            sx={{
              background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              p: { xs: 3, md: 4 },
            }}
            role="main"
            aria-label="Admin Dashboard Content"
          >
            <Routes>
              <Route path="/appointments" element={<AppointmentsList />} />

              <Route
                path="/doctor-appointments"
                element={<DoctorAppointments />}
              />
              <Route path="/available-slots" element={<AvailableSlots />} />
              <Route path="/appointment/:id" element={<AppointmentDetails />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/doctors" element={<DoctorsList />} />
              <Route path="/statistics" element={<StatisticsDashboard />} />
              <Route
                path="/"
                element={
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      fontWeight: 600,
                      color: '#1A3C5A',
                    }}
                  >
                    Welcome to the Admin Dashboard
                  </Typography>
                }
              />
            </Routes>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
