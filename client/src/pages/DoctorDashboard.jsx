import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage, toList } from '../api';
import DoctorViewAppointments from './DoctorViewAppointments';
import DoctorAvailableSlots from './DoctorAvailableSlots';
import DoctorAppointmentDetails from './DoctorAppointmentDetails';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Overview', to: '', icon: DashboardIcon },
  { label: 'My appointments', to: 'appointments', icon: CalendarMonthIcon },
  { label: 'Availability', to: 'available-slots', icon: ScheduleIcon },
];

const statusMeta = {
  pending: { label: 'Pending', color: '#B26A00', bg: '#FFF4E5' },
  confirmed: { label: 'Confirmed', color: '#1B7F5A', bg: '#E8F6EF' },
  completed: { label: 'Completed', color: '#1F5F99', bg: '#E8F1FA' },
  cancelled: { label: 'Cancelled', color: '#B23B3B', bg: '#FBEAEA' },
};

const dateKey = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return 'No date';
  return new Date(value).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const StatCard = ({ label, value, color }) => (
  <Card
    elevation={0}
    sx={{
      height: '100%',
      borderRadius: '14px',
      border: '1px solid #E6EEF5',
      boxShadow: '0 8px 20px rgba(26, 60, 90, 0.05)',
    }}
  >
    <CardContent>
      <Typography variant="body2" sx={{ color: '#6B869D', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ color: color || '#1A3C5A', fontWeight: 700 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

function DoctorOverview() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await api.get('/api/appointments', {
          params: { limit: 100 },
        });
        if (!cancelled) {
          setAppointments(toList(response.data));
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Could not load your appointments.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const today = dateKey(new Date());
    return {
      total: appointments.length,
      today: appointments.filter(
        (appointment) =>
          dateKey(appointment.date) === today &&
          ['pending', 'confirmed'].includes(appointment.status)
      ).length,
      upcoming: appointments.filter(
        (appointment) =>
          ['pending', 'confirmed'].includes(appointment.status) &&
          dateKey(appointment.date) >= today
      ).length,
      completed: appointments.filter(
        (appointment) => appointment.status === 'completed'
      ).length,
    };
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    const today = dateKey(new Date());
    return [...appointments]
      .filter(
        (appointment) =>
          ['pending', 'confirmed'].includes(appointment.status) &&
          dateKey(appointment.date) >= today
      )
      .sort((a, b) =>
        `${dateKey(a.date)} ${a.startTime}`.localeCompare(
          `${dateKey(b.date)} ${b.startTime}`
        )
      )[0];
  }, [appointments]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <StatCard label="Upcoming" value={stats.upcoming} color="#00707E" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Today" value={stats.today} color="#B26A00" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Completed" value={stats.completed} color="#1F5F99" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Total appointments" value={stats.total} />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: '16px',
          border: '1px solid #E6EEF5',
          boxShadow: '0 8px 24px rgba(26, 60, 90, 0.06)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A3C5A', mb: 2 }}>
          Next appointment
        </Typography>

        {nextAppointment ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                {nextAppointment.patientInfo?.name || 'Patient'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(nextAppointment.date)} · {nextAppointment.startTime}
                {nextAppointment.endTime ? ` – ${nextAppointment.endTime}` : ''}
              </Typography>
              {nextAppointment.reason && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Reason: {nextAppointment.reason}
                </Typography>
              )}
            </Box>
            <Button
              component={Link}
              to={`/doctor-dashboard/appointment/${nextAppointment._id}`}
              variant="contained"
              endIcon={<ChevronRightIcon />}
              sx={{
                backgroundColor: '#00ACC1',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#0097A7' },
              }}
            >
              View details
            </Button>
          </Box>
        ) : (
          <Typography color="text.secondary">
            You have no upcoming appointments. New bookings will appear here.
          </Typography>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 3 }}>
        <Button
          component={Link}
          to="/doctor-dashboard/appointments"
          variant="outlined"
          startIcon={<CalendarMonthIcon />}
          sx={{ textTransform: 'none' }}
        >
          All appointments
        </Button>
        <Button
          component={Link}
          to="/doctor-dashboard/available-slots"
          variant="outlined"
          startIcon={<ScheduleIcon />}
          sx={{ textTransform: 'none' }}
        >
          Check availability
        </Button>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {Object.entries(statusMeta).map(([key, meta]) => (
          <Box
            key={key}
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: '999px',
              backgroundColor: meta.bg,
              color: meta.color,
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            {meta.label}:{' '}
            {appointments.filter((appointment) => appointment.status === key).length}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function DoctorDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerPath, setDrawerPath] = useState(location.pathname);

  useEffect(() => {
    setDrawerPath(location.pathname);
    setMobileOpen(false);
  }, [location.pathname]);

  const profileId = user?.id || user?._id;
  const basePath = '/doctor-dashboard';

  const relativePath = drawerPath.startsWith(basePath)
    ? drawerPath.slice(basePath.length).replace(/^\//, '')
    : '';

  const isActive = (item) => {
    if (item.to === '') return relativePath === '';
    if (item.to === 'appointments') {
      return (
        relativePath.startsWith('appointments') ||
        relativePath.startsWith('appointment/')
      );
    }
    return relativePath.startsWith(item.to);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2.5, py: 2.5, borderBottom: '1px solid #E6EEF5' }}>
        <Typography
          variant="overline"
          sx={{ color: '#00ACC1', fontWeight: 700, letterSpacing: 1 }}
        >
          Doctor portal
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
          <Avatar
            src={user?.profilePicture || undefined}
            alt={user?.name || 'Doctor'}
            sx={{ width: 44, height: 44, bgcolor: '#00ACC1', fontWeight: 700 }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, color: '#1A3C5A' }} noWrap>
              Dr. {user?.name || 'Doctor'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.specialty || 'General practitioner'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const selected = isActive(item);
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.to ? `${basePath}/${item.to}` : basePath}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: '10px',
                mb: 0.5,
                '&.Mui-selected': { backgroundColor: '#E0F7FA' },
                '&.Mui-selected:hover': { backgroundColor: '#D2F1F5' },
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 38, color: selected ? '#00707E' : '#5B7A94' }}
              >
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.92rem',
                  fontWeight: selected ? 700 : 600,
                  color: selected ? '#00707E' : '#33546F',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 1.5 }}>
        <Button
          component={Link}
          to={profileId ? `/profile/${profileId}` : basePath}
          fullWidth
          startIcon={<PersonIcon />}
          sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
        >
          My profile
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F6FAFC',
        pt: { xs: '64px', md: '72px' },
      }}
    >
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        aria-label="Doctor dashboard navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              pt: { xs: '64px', md: 0 },
              boxSizing: 'border-box',
              backgroundColor: '#fff',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              backgroundColor: '#fff',
              borderRight: '1px solid #E6EEF5',
              mt: { md: '72px' },
              height: { md: 'calc(100% - 72px)' },
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 3,
            }}
          >
            <IconButton
              aria-label="Open dashboard menu"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#1A3C5A' }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: 700, color: '#1A3C5A' }}
              >
                Welcome, Dr. {user?.name || 'Doctor'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review your appointments and keep your availability accurate.
              </Typography>
            </Box>
          </Box>

          <Routes>
            <Route index element={<DoctorOverview />} />
            <Route path="appointments" element={<DoctorViewAppointments />} />
            <Route path="available-slots" element={<DoctorAvailableSlots />} />
            <Route path="appointment/:id" element={<DoctorAppointmentDetails />} />
            <Route
              path="*"
              element={
                <Alert severity="info">
                  This section does not exist. Use the dashboard menu to continue.
                </Alert>
              }
            />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default DoctorDashboard;
