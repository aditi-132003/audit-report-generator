import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AuditList from './pages/AuditList';
import AuditForm from './pages/AuditForm';
import AuditDetail from './pages/AuditDetail';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="audits" element={<AuditList />} />
              <Route path="audits/new" element={<AuditForm />} />
              <Route path="audits/:id" element={<AuditDetail />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
