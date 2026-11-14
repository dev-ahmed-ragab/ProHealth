import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailSentPage from './pages/VerifyEmailSentPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProfilePage from './pages/ProfilePage';
import DoctorsPage from './pages/DoctorsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/layer/Navbar';
import Footer from './components/layer/Footer';
import { Box } from '@mui/material';
import Services from './pages/Services';
import Contact from './pages/Contact';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Box
          sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        >
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden' }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/find-doctor" element={<DoctorsPage />} />
              <Route path="/service" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
              />
              <Route
                path="/verify-email-sent"
                element={<VerifyEmailSentPage />}
              />
              <Route
                path="/verify-email/:token"
                element={<VerifyEmailPage />}
              />

              {/* Any signed-in user */}
              <Route element={<PrivateRoute />}>
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route
                  path="/book-appointment/:doctorId"
                  element={<BookAppointmentPage />}
                />
                <Route
                  path="/my-appointments"
                  element={<MyAppointmentsPage />}
                />
              </Route>

              {/* Doctors and admins */}
              <Route element={<PrivateRoute roles={['doctor', 'admin']} />}>
                <Route
                  path="/doctor-dashboard/*"
                  element={<DoctorDashboard />}
                />
              </Route>

              {/* Admins only */}
              <Route element={<PrivateRoute roles={['admin']} />}>
                <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
              </Route>

              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/services" element={<Navigate to="/service" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </AuthProvider>
    </Router>
  );
}

export default App;
