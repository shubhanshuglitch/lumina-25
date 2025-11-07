import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle, syncUserToBackend } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // No sync needed here, as user should already be in DB
      // But the onAuthStateChanged listener will catch it
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      // 1. Sign in with Google
      const userCredential = await loginWithGoogle();
      
      // 2. Sync to backend (this route is smart, it won't create duplicates)
      await syncUserToBackend(userCredential.user);
      
      // 3. Redirect
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in with Google: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Log In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
      <hr />
      <button onClick={handleGoogleLogin}>Log In with Google</button>
    </div>
  );
}

export default LoginPage;
