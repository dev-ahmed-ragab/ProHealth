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
  Typography,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage, toList } from '../api';
import AppointmentsList from './AppointmentsList';
import DoctorAppointments from './DoctorAppointments';
import AvailableSlots from './AvailableSlots';
import AppointmentDetails from './AppointmentDetails';
import UsersList from './UsersList';
import DoctorsList from './DoctorsList';
import StatisticsDashboard from './StatisticsDashboard';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Overview', to: '', icon: DashboardIcon },
  { label: 'All appointments', to: 'appointments', icon: CalendarMonthIcon },
  { label: 'Doctor appointments', to: 'doctor-appointments', icon: EventIcon },
  { label: 'Availability', to: 'available-slots', icon: ScheduleIcon },
  { label: 'Users', to: 'users', icon: GroupIcon },
  { label: 'Doctors', to: 'doctors', icon: MedicalServicesIcon },
  { label: 'Statistics', to: 'statistics', icon: BarChartIcon },
];

const dateKey = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return 'No date';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const StatCard = ({ label, value, hint, color }) => (
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
      {hint && (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      )}
    </CardContent>
  </Card>
);

function AdminOverview() {
  const [appointments, setAppointments] = useState([]);
  const [userTotal, setUserTotal] = useState(null);
  const [doctorTotal, setDoctorTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [appointmentsResult, usersResult, doctorsResult] =
        await Promise.allSettled([
          api.get('/api/appointments', { params: { limit: 100 } }),
          api.get('/api/users', { params: { limit: 1 } }),
          api.get('/api/users/protected/doctors'),
        ]);

      if (cancelled) return;

      if (appointmentsResult.status === 'fulfilled') {
        setAppointments(toList(appointmentsResult.value.data));
      } else {
        setError(
          getErrorMessage(
            appointmentsResult.reason,
            'Could not load the latest appointments.'
          )
        );
      }

      if (usersResult.status === 'fulfilled') {
        setUserTotal(
          usersResult.value.data?.pagination?.total ??
            toList(usersResult.value.data).length
        );
      }

      if (doctorsResult.status === 'fulfilled') {
        setDoctorTotal(toList(doctorsResult.value.data).length);
      }

      setLoading(false);
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
      pending: appointments.filter((a) => a.status === 'pending').length,
      today: appointments.filter(
        (a) => dateKey(a.date) === today && a.status !== 'cancelled'
      ).length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    };
  }, [appointments]);

  const pending = useMemo(
    () =>
      appointments
        .filter((appointment) => appointment.status === 'pending')
        .sort((a, b) =>
          `${a.date || ''} ${a.startTime || ''}`.localeCompare(
            `${b.date || ''} ${b.startTime || ''}`
          )
        )
        .slice(0, 5),
    [appointments]
  );

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
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Pending requests"
            value={stats.pending}
            hint="Need confirmation"
            color="#B26A00"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Today" value={stats.today} hint="Active visits" color="#00707E" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Registered users"
            value={userTotal ?? '—'}
            hint={doctorTotal != null ? `${doctorTotal} doctors` : undefined}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Cancelled"
            value={stats.cancelled}
            hint={`${stats.total} loaded`}
            color="#B23B3B"
          />
        </Grid>
      </Grid>

      <Card
        elevation={0}
        sx={{ borderRadius: '16px', border: '1px solid #E6EEF5', mb: 3 }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              mb: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
              Appointments waiting for confirmation
            </Typography>
            <Button
              component={Link}
              to="/admin-dashboard/appointments"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Open appointments
            </Button>
          </Box>

          {pending.length === 0 ? (
            <Typography color="text.secondary">
              Nothing is waiting right now. New requests will appear here.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {pending.map((appointment, index) => (
                <Box key={appointment._id}>
                  {index > 0 && <Divider sx={{ my: 1.5 }} />}
                  <Box
                    component={Link}
                    to={`/admin-dashboard/appointment/${appointment._id}`}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 2,
                      flexWrap: 'wrap',
                      color: 'inherit',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      p: 0.5,
                      '&:hover': { backgroundColor: '#F4FAFB' },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#1A3C5A' }}>
                        {appointment.patientInfo?.name || 'Patient'} ·{' '}
                        {appointment.doctorInfo?.name || 'Doctor'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(appointment.date)} · {appointment.startTime}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#00ACC1', fontWeight: 700 }}>
                      Review
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Button
          component={Link}
          to="/admin-dashboard/users"
          variant="outlined"
          startIcon={<GroupIcon />}
          sx={{ textTransform: 'none' }}
        >
          Manage users
        </Button>
        <Button
          component={Link}
          to="/admin-dashboard/doctors"
          variant="outlined"
          startIcon={<MedicalServicesIcon />}
          sx={{ textTransform: 'none' }}
        >
          View doctors
        </Button>
        <Button
          component={Link}
          to="/admin-dashboard/statistics"
          variant="outlined"
          startIcon={<BarChartIcon />}
          sx={{ textTransform: 'none' }}
        >
          Statistics
        </Button>
      </Box>
    </Box>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
    setMobileOpen(false);
  }, [location.pathname]);

  const basePath = '/admin-dashboard';
  const profileId = user?.id || user?._id;

  const relativePath = currentPath.startsWith(basePath)
    ? currentPath.slice(basePath.length).replace(/^\//, '')
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
          Administration
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
          <Avatar
            src={user?.profilePicture || undefined}
            alt={user?.name || 'Admin'}
            sx={{ width: 44, height: 44, bgcolor: '#1A3C5A', fontWeight: 700 }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, color: '#1A3C5A' }} noWrap>
              {user?.name || 'Administrator'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Clinic administrator
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
        aria-label="Admin dashboard navigation"
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
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
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
                Welcome, {user?.name || 'Administrator'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor appointments, manage accounts, and keep the clinic running.
              </Typography>
            </Box>
          </Box>

          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="appointments" element={<AppointmentsList />} />
            <Route path="doctor-appointments" element={<DoctorAppointments />} />
            <Route path="available-slots" element={<AvailableSlots />} />
            <Route path="appointment/:id" element={<AppointmentDetails />} />
            <Route path="users" element={<UsersList />} />
            <Route path="doctors" element={<DoctorsList />} />
            <Route path="statistics" element={<StatisticsDashboard />} />
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

export default AdminDashboard;
