import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
    </Routes>
  );
}

export default App;
