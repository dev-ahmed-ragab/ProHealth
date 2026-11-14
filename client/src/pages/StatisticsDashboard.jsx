import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Chart from 'chart.js/auto';
import api, { getErrorMessage, toList } from '../api';

const STATUS_META = {
  pending: { label: 'Pending', color: '#B26A00' },
  confirmed: { label: 'Confirmed', color: '#1B7F5A' },
  completed: { label: 'Completed', color: '#1F5F99' },
  cancelled: { label: 'Cancelled', color: '#B23B3B' },
};

const pad = (value) => String(value).padStart(2, '0');

const dayKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const shortDay = (key) => {
  const date = new Date(`${key}T00:00:00`);
  return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
};

const StatCard = ({ label, value, color }) => (
  <Card
    elevation={0}
    sx={{ height: '100%', borderRadius: '14px', border: '1px solid #E6EEF5' }}
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

const StatisticsDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const lineChartRef = useRef(null);
  const statusChartRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/appointments', { params: { limit: 100 } });
      setAppointments(toList(response.data));
      setError('');
    } catch (err) {
      setAppointments([]);
      setError(getErrorMessage(err, 'Could not load statistics.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(
    () =>
      appointments.reduce(
        (acc, appointment) => {
          acc.total += 1;
          if (STATUS_META[appointment.status]) acc[appointment.status] += 1;
          return acc;
        },
        { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
      ),
    [appointments]
  );

  const daily = useMemo(() => {
    const counts = new Map();
    appointments.forEach((appointment) => {
      if (appointment.status === 'cancelled') return;
      const key = dayKey(appointment.date);
      if (!key) return;
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-10)
      .map(([key, count]) => ({ key, count }));
  }, [appointments]);

  const doctorRows = useMemo(() => {
    const rows = new Map();
    appointments.forEach((appointment) => {
      const name = appointment.doctorInfo?.name || 'Unassigned';
      const current = rows.get(name) || { name, total: 0, completed: 0, cancelled: 0 };
      current.total += 1;
      if (appointment.status === 'completed') current.completed += 1;
      if (appointment.status === 'cancelled') current.cancelled += 1;
      rows.set(name, current);
    });
    return [...rows.values()].sort((a, b) => b.total - a.total);
  }, [appointments]);

  useEffect(() => {
    if (loading) return undefined;

    let lineChart;
    let statusChart;

    if (lineChartRef.current && daily.length > 0) {
      lineChart = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: daily.map((item) => shortDay(item.key)),
          datasets: [
            {
              label: 'Appointments',
              data: daily.map((item) => item.count),
              borderColor: '#00ACC1',
              backgroundColor: 'rgba(0, 172, 193, 0.18)',
              fill: true,
              tension: 0.35,
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Appointments per day',
              color: '#1A3C5A',
              font: { size: 15, weight: '600' },
            },
          },
          scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } },
          },
        },
      });
    }

    if (statusChartRef.current && stats.total > 0) {
      statusChart = new Chart(statusChartRef.current, {
        type: 'doughnut',
        data: {
          labels: Object.values(STATUS_META).map((meta) => meta.label),
          datasets: [
            {
              data: Object.keys(STATUS_META).map((key) => stats[key]),
              backgroundColor: Object.values(STATUS_META).map((meta) => meta.color),
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Appointments by status',
              color: '#1A3C5A',
              font: { size: 15, weight: '600' },
            },
          },
        },
      });
    }

    return () => {
      lineChart?.destroy();
      statusChart?.destroy();
    };
  }, [daily, loading, stats]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
          Statistics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Based on the {appointments.length} most recent appointments.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <StatCard label="Loaded" value={stats.total} />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard label="Pending" value={stats.pending} color="#B26A00" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard label="Completed" value={stats.completed} color="#1F5F99" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard label="Cancelled" value={stats.cancelled} color="#B23B3B" />
            </Grid>
          </Grid>

          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} md={7}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  border: '1px solid #E6EEF5',
                  height: 340,
                }}
              >
                {daily.length === 0 ? (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography color="text.secondary">
                      No appointment dates to chart yet.
                    </Typography>
                  </Box>
                ) : (
                  <canvas ref={lineChartRef} />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  border: '1px solid #E6EEF5',
                  height: 340,
                }}
              >
                {stats.total === 0 ? (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography color="text.secondary">
                      No appointments to chart yet.
                    </Typography>
                  </Box>
                ) : (
                  <canvas ref={statusChartRef} />
                )}
              </Paper>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              mb: 1.5,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
              Doctor workload
            </Typography>
            <Button onClick={load} variant="outlined" sx={{ textTransform: 'none' }}>
              Refresh
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: '16px', border: '1px solid #E6EEF5', overflowX: 'auto' }}
          >
            <Table aria-label="Doctor workload">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#1A3C5A' }}>Doctor</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                    Appointments
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                    Completed
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#1A3C5A' }}>
                    Cancelled
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctorRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No appointments to summarize.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  doctorRows.map((row) => (
                    <TableRow key={row.name} hover>
                      <TableCell sx={{ color: '#1A3C5A', fontWeight: 600 }}>
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.total}</TableCell>
                      <TableCell align="right">{row.completed}</TableCell>
                      <TableCell align="right">{row.cancelled}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default StatisticsDashboard;
