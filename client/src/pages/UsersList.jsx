import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import { Delete, Edit, Event } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    specialty: null,
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      specialty: user.specialty || null,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${selectedUser._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(
        users.map((u) =>
          u._id === selectedUser._id ? { ...u, ...formData } : u
        )
      );
      handleClose();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: '#fff',
      }}
    >
      <Container>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
            fontWeight: 700,
            color: '#005C97',
            mb: 4,
            textAlign: 'center',
          }}
        >
          User Management
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            overflowX: 'auto',
          }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#1A3C5A',
                    borderBottom: '2px solid #e0e0e0',
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: '#1A3C5A',
                    borderBottom: '2px solid #e0e0e0',
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: '#1A3C5A',
                    borderBottom: '2px solid #e0e0e0',
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: '#1A3C5A',
                    borderBottom: '2px solid #e0e0e0',
                  }}
                >
                  Specialty
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: '#1A3C5A',
                    borderBottom: '2px solid #e0e0e0',
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{user.role}</TableCell>
                  <TableCell align="right">
                    {user.specialty || 'Not Specified'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpen(user)}
                      aria-label={`Edit ${user.name}`}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user._id)}
                      aria-label={`Delete ${user.name}`}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={`/admin-dashboard/appointment/${user._id}`}
                      state={{ userId: user._id }}
                      aria-label={`Schedule Appointment for ${user.name}`}
                    >
                      <Event />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="name"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              aria-label="Name"
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              aria-label="Email"
            />
            <TextField
              margin="dense"
              name="role"
              label="Role"
              select
              fullWidth
              value={formData.role}
              onChange={handleChange}
              aria-label="Select Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            {formData.role === 'doctor' && (
              <TextField
                margin="dense"
                name="specialty"
                label="Specialty"
                select
                fullWidth
                value={formData.specialty || ''}
                onChange={handleChange}
                aria-label="Select Specialty"
              >
                <MenuItem value={null}>Not Specified</MenuItem>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="cardiology">Cardiology</MenuItem>
                <MenuItem value="neurology">Neurology</MenuItem>
                <MenuItem value="pediatrics">Pediatrics</MenuItem>
                <MenuItem value="orthopedics">Orthopedics</MenuItem>
                <MenuItem value="dermatology">Dermatology</MenuItem>
              </TextField>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              sx={{
                backgroundColor: '#00ACC1',
                color: '#fff',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#0097A7',
                },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default UsersList;
