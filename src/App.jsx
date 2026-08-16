import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import LenderDashboard from './pages/LenderDashboard';
import AgentApp from './pages/AgentApp';
import FarmerPortal from './pages/FarmerPortal';
import AdminPanel from './pages/AdminPanel';
import './index.css';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<LenderDashboard />} />
          <Route path="/dashboard/map" element={<LenderDashboard />} />
          <Route path="/agent" element={<AgentApp />} />
          <Route path="/farmer" element={<FarmerPortal />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
