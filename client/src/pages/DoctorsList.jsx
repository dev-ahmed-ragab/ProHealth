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
        const res = await axios.get('http://localhost:5000/api/users/doctors', {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        جميع الأطباء
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>التخصص</TableCell>
              <TableCell>رقم الهاتف</TableCell>
              <TableCell>الصورة الشخصية</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor._id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.specialty || 'غير محدد'}</TableCell>
                <TableCell>{doctor.phone || 'غير متوفر'}</TableCell>
                <TableCell>
                  {doctor.profilePicture ? (
                    <img
                      src={doctor.profilePicture}
                      alt={doctor.name}
                      style={{ width: 50, height: 50, borderRadius: '50%' }}
                    />
                  ) : (
                    'لا توجد صورة'
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