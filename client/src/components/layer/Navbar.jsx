import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleCloseUserMenu();
  };

  // Mobile Navigation Items
  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Find Doctor', path: '/find-doctor' },
    { label: 'Service', path: '/service' },
    { label: 'Contact Us', path: '/contact' },
  ];

  // Dropdown items for user profile icon
  const userMenuItems =
    user && user.user
      ? [
          { label: 'Profile', path: `/profile/${user.user.id}` },
          ...(user.user.role === 'admin'
            ? [{ label: 'Admin Dashboard', path: '/admin-dashboard' }]
            : []),
          ...(user.user.role === 'doctor'
            ? [{ label: 'Doctor Dashboard', path: '/doctor-dashboard' }]
            : []),
          ...(user.user.role === 'user'
            ? [{ label: 'My Appointments', path: '/my-appointments' }]
            : []),
          { label: 'Logout', action: handleLogout },
        ]
      : [
          { label: 'Login', path: '/login' },
          { label: 'Create Account', path: '/register' },
        ];

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: isScrolled ? '#fff' : 'transparent',
        boxShadow: isScrolled ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
        color: '#1A3C5A',
        zIndex: 999,
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        {/* Logo - Always on the left */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 0,
          }}
        >
          <img src="/images/logo.png" alt="Logo" style={{ height: '60px' }} />
        </Typography>

        {/* Desktop Navigation Links */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 2,
            flexGrow: 1,
            justifyContent: 'center',
          }}
        >
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={item.path}
              sx={{
                color: '#1A3C5A',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                textTransform: 'none',
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

        {/* Right Side Buttons / Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          {/* Auth Buttons for non-logged users */}
          {!user && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                aria-label="Login"
                sx={{
                  color: '#1A3C5A',
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  textTransform: 'none',
                  display: { xs: 'none', md: 'inline-flex' },
                  '&:hover': {
                    color: '#00ACC1',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                aria-label="Create Account"
                sx={{
                  backgroundColor: '#00ACC1',
                  color: '#fff',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  display: { xs: 'none', md: 'inline-flex' },
                  '&:hover': {
                    backgroundColor: '#0097A7',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Create Account
              </Button>
            </>
          )}

          {/* Profile Icon with Dropdown for logged users */}
          {user && (
            <IconButton
              onClick={handleOpenUserMenu}
              color="inherit"
              aria-label="User Profile"
              sx={{ color: '#1A3C5A' }}
            >
              <AccountCircle sx={{ fontSize: 28 }} />
            </IconButton>
          )}

          {/* Mobile Menu Button */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="Open mobile menu"
            onClick={handleOpenNavMenu}
            sx={{ display: { xs: 'flex', md: 'none' }, color: '#1A3C5A' }}
          >
            <MenuIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleCloseNavMenu}
            sx={{ color: '#1A3C5A', fontWeight: 600 }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      {/* User Profile Dropdown Menu */}
      <Menu
        id="menu-user"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        PaperProps={{
          sx: {
            width: 220,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {userMenuItems.map((item, index) =>
          item.action ? (
            <MenuItem
              key={index}
              onClick={() => {
                item.action();
                handleCloseUserMenu();
              }}
              sx={{ color: '#1A3C5A', fontWeight: 600 }}
            >
              {item.label}
            </MenuItem>
          ) : (
            <MenuItem
              key={index}
              component={Link}
              to={item.path}
              onClick={handleCloseUserMenu}
              sx={{ color: '#1A3C5A', fontWeight: 600 }}
            >
              {item.label}
            </MenuItem>
          )
        )}
      </Menu>
    </AppBar>
  );
}

export default Navbar;
