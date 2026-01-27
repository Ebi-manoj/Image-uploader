import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import Upload from './pages/Upload';
import { IsAuthenticated } from './components/IsAuthenticated';
import { IsProtected } from './components/IsProtected';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route element={<IsAuthenticated />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<IsProtected />}>
          <Route path="" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
