import { useEffect, useRef } from 'react';
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
  Box,
} from '@mui/material';
import Chart from 'chart.js/auto';

// Dummy data mimicking stock market style
const dummyData = {
  appointments: [
    { date: '2025-05-01', count: 120, revenue: 2400 },
    { date: '2025-05-02', count: 150, revenue: 3000 },
    { date: '2025-05-03', count: 100, revenue: 2000 },
    { date: '2025-05-04', count: 180, revenue: 3600 },
    { date: '2025-05-05', count: 200, revenue: 4000 },
  ],
  doctorsPerformance: [
    { name: 'Dr. Ahmed Mohamed', appointments: 50, revenue: 1000 },
    { name: 'Dr. Sarah Ali', appointments: 70, revenue: 1400 },
    { name: 'Dr. Khaled Hassan', appointments: 30, revenue: 600 },
  ],
};

const StatisticsDashboard = () => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    // Line Chart (Appointments Over Time)
    const lineCtx = lineChartRef.current.getContext('2d');
    const lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: dummyData.appointments.map((d) => d.date),
        datasets: [
          {
            label: 'Number of Appointments',
            data: dummyData.appointments.map((d) => d.count),
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.2)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Revenue (EGP)',
            data: dummyData.appointments.map((d) => d.revenue),
            borderColor: '#d32f2f',
            backgroundColor: 'rgba(211, 47, 47, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Daily Appointment Statistics' },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    // Bar Chart (Doctors Performance)
    const barCtx = barChartRef.current.getContext('2d');
    const barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: dummyData.doctorsPerformance.map((d) => d.name),
        datasets: [
          {
            label: 'Number of Appointments',
            data: dummyData.doctorsPerformance.map((d) => d.appointments),
            backgroundColor: '#1976d2',
          },
          {
            label: 'Revenue (EGP)',
            data: dummyData.doctorsPerformance.map((d) => d.revenue),
            backgroundColor: '#d32f2f',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Doctor Performance' },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      lineChart.destroy();
      barChart.destroy();
    };
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
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
          Statistics Dashboard
        </Typography>

        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: '#1A3C5A',
              mb: 3,
            }}
          >
            Daily Appointment Statistics
          </Typography>
          <canvas ref={lineChartRef} height={100} />
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: '#1A3C5A',
              mb: 3,
            }}
          >
            Doctor Performance
          </Typography>
          <canvas ref={barChartRef} height={100} />
        </Box>

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
                  Date
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: '#1A3C5A',
                    borderBottom: '2px solid #e0e0e0',
                  }}
                >
                  Appointments
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: '#1A3C5A',
                    borderBottom: '2px solid #e0e0e0',
                  }}
                >
                  Revenue (EGP)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyData.appointments.map((item, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {item.date}
                  </TableCell>
                  <TableCell align="right">{item.count}</TableCell>
                  <TableCell align="right">{item.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default StatisticsDashboard;
