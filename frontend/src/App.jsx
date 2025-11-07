import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import PrivateRoute from './components/PrivateRoute';
import axios from 'axios';
import { useState } from 'react';
import ChatPage from './pages/ChatPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx'; // 👈 Import the new page
// ... (function App)
<Routes>
  {/* ... (home, login, signup routes) ... */}
  
  <Route 
    path="/dashboard" 
    element={
      <PrivateRoute>
        <DashboardPage /> {/* 👈 Use the new dashboard */}
      </PrivateRoute>
    } 
  />
  <Route 
    path="/chat" 
    element={
      <PrivateRoute>
        <ChatPage />
      </PrivateRoute>
    } 
  />
</Routes>
// A placeholder for your protected dashboard
function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [apiMsg, setApiMsg] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login (or let the PrivateRoute handle it)
    } catch {
      console.error('Failed to log out');
    }
  };

  const testApi = async () => {
    try {
      const token = await currentUser.getIdToken();
      const res = await axios.get('http://localhost:5001/api/test', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiMsg(res.data.message);
    } catch (error) {
      setApiMsg('API test failed: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {currentUser?.email}</p>
      <button onClick={testApi}>Test Protected API</button>
      {apiMsg && <p><strong>API Response:</strong> {apiMsg}</p>}
      <br />
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

// A simple home page
function Home() {
  return <h1>Welcome to Code Empath!</h1>;
}

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/login">Login</Link> | 
        <Link to="/signup">Signup</Link> | 
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/chat">Chat</Link> {/* Add Chat link */}
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* This is the protected route */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} /> {/* Protected Chat route */}
        
      </Routes>
    </div>
  );
}

export default App;