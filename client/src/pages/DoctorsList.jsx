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
} from '@mui/material';
import axios from 'axios';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(
          'https://pro-health-backend.vercel.app/api/users/doctors',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };
    fetchDoctors();
  }, [token]);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        All Doctors
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Specialty</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Profile Picture</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor._id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.specialty || 'Not specified'}</TableCell>
                <TableCell>{doctor.phone || 'Not available'}</TableCell>
                <TableCell>
                  {doctor.profilePicture ? (
                    <img
                      src={doctor.profilePicture}
                      alt={doctor.name}
                      style={{ width: 50, height: 50, borderRadius: '50%' }}
                    />
                  ) : (
                    'No image'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DoctorsList;