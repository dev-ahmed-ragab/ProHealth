import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const navigation = [
  { label: 'Home', path: '/' },
  { label: 'Find a Doctor', path: '/find-doctor' },
  { label: 'Services', path: '/service' },
  { label: 'Contact Us', path: '/contact' },
];

const dashboardPath = (role) => {
  if (role === 'admin') return '/admin-dashboard';
  if (role === 'doctor') return '/doctor-dashboard';
  return null;
};

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setAnchorElNav(null);
    setAnchorElUser(null);
  }, [location.pathname]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = () => {
    setAnchorElUser(null);
    setAnchorElNav(null);
    logout();
  };

  const profileId = user?.id || user?._id;
  const dashboard = dashboardPath(user?.role);

  const userMenuItems = user
    ? [
        ...(dashboard
          ? [{ label: 'Dashboard', path: dashboard, icon: <DashboardIcon /> }]
          : []),
        ...(user.role === 'user'
          ? [
              {
                label: 'My Appointments',
                path: '/my-appointments',
                icon: <EventIcon />,
              },
            ]
          : []),
        ...(profileId
          ? [
              {
                label: 'My Profile',
                path: `/profile/${profileId}`,
                icon: <PersonIcon />,
              },
            ]
          : []),
      ]
    : [];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: isScrolled ? 'rgba(255,255,255,0.97)' : '#ffffff',
        boxShadow: isScrolled ? '0 4px 16px rgba(0, 0, 0, 0.08)' : 'none',
        color: '#1A3C5A',
        zIndex: 1100,
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: { xs: 64, md: 72 } }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          aria-label="ProHealth home"
        >
          <Box
            component="img"
            src="/images/logo.png"
            alt="ProHealth"
            sx={{ height: { xs: 44, md: 54 }, objectFit: 'contain' }}
          />
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 1,
            flexGrow: 1,
            justifyContent: 'center',
          }}
        >
          {navigation.map((item) => (
            <Button
              key={item.path}
              component={RouterLink}
              to={item.path}
              sx={{
                color: isActive(item.path) ? '#00ACC1' : '#1A3C5A',
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                borderBottom: isActive(item.path)
                  ? '2px solid #00ACC1'
                  : '2px solid transparent',
                borderRadius: 0,
                px: 1.5,
                py: 0.75,
                '&:hover': {
                  color: '#00ACC1',
                  backgroundColor: 'transparent',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1.5 },
            ml: 'auto',
          }}
        >
          {!user && (
            <>
              <Button
                component={RouterLink}
                to="/login"
                aria-label="Login"
                sx={{
                  color: '#1A3C5A',
                  fontWeight: 600,
                  textTransform: 'none',
                  display: { xs: 'none', md: 'inline-flex' },
                  '&:hover': { color: '#00ACC1', backgroundColor: 'transparent' },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to="/register"
                aria-label="Create Account"
                sx={{
                  backgroundColor: '#00ACC1',
                  color: '#fff',
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                  '&:hover': { backgroundColor: '#0097A7' },
                }}
              >
                Create Account
              </Button>
            </>
          )}

          {user && (
            <IconButton
              onClick={(event) => setAnchorElUser(event.currentTarget)}
              aria-label="Open user menu"
              aria-controls="menu-user"
              aria-haspopup="true"
              sx={{ p: 0.5 }}
            >
              {user.profilePicture ? (
                <Avatar
                  src={user.profilePicture}
                  alt={user.name || 'Profile'}
                  sx={{ width: 36, height: 36 }}
                />
              ) : (
                <AccountCircle sx={{ fontSize: 34, color: '#1A3C5A' }} />
              )}
            </IconButton>
          )}

          <IconButton
            size="large"
            edge="end"
            aria-label="Open navigation menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={(event) => setAnchorElNav(event.currentTarget)}
            sx={{ display: { xs: 'flex', md: 'none' }, color: '#1A3C5A' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile navigation */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorElNav)}
        onClose={() => setAnchorElNav(null)}
        sx={{ display: { xs: 'block', md: 'none' } }}
        PaperProps={{ sx: { minWidth: 220 } }}
      >
        {navigation.map((item) => (
          <MenuItem
            key={item.path}
            component={RouterLink}
            to={item.path}
            selected={isActive(item.path)}
            onClick={() => setAnchorElNav(null)}
          >
            {item.label}
          </MenuItem>
        ))}
        <Divider />
        {!user ? (
          <>
            <MenuItem
              component={RouterLink}
              to="/login"
              onClick={() => setAnchorElNav(null)}
            >
              Login
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/register"
              onClick={() => setAnchorElNav(null)}
            >
              Create Account
            </MenuItem>
          </>
        ) : (
          <>
            {userMenuItems.map((item) => (
              <MenuItem
                key={item.path}
                component={RouterLink}
                to={item.path}
                onClick={() => setAnchorElNav(null)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.label}</ListItemText>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Desktop user menu */}
      <Menu
        id="menu-user"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorElUser)}
        onClose={() => setAnchorElUser(null)}
        PaperProps={{
          sx: {
            minWidth: 220,
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            mt: 1,
          },
        }}
      >
        {user && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontWeight: 700, color: '#1A3C5A' }} noWrap>
              {user.name || 'Account'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>
        )}
        <Divider />
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.path}
            component={RouterLink}
            to={item.path}
            onClick={() => setAnchorElUser(null)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Navbar;
