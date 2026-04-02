import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please make sure all fields are filled out.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:8000/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { method: 'POST' },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      localStorage.setItem('role', data.role);

      if (data.role === 'patient') {
        navigate('/patient');
      } else {
        navigate('/psw');
      }
    } catch (error) {
      alert(error.message || 'Could not connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: '16px',
      }}
    >
      <h1
        style={{
          fontFamily: 'Monospace',
          fontSize: '80px',
          marginTop: '-200px',
        }}
      >
        Welcome to PSUU
      </h1>

      <h1
        style={{
          fontFamily: 'DM Sans',
          paddingTop: '80px',
        }}
      >
        Login
      </h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
      />

      <button
        onClick={handleLogin}
        disabled={isSubmitting}
        style={{
          padding: '10px',
          fontSize: '24px',
          backgroundColor: '#547aad',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isSubmitting ? 'wait' : 'pointer',
          opacity: isSubmitting ? 0.8 : 1,
          fontFamily: 'DM Sans',
        }}
      >
        {isSubmitting ? 'Logging In...' : 'Login'}
      </button>

      <p style={{ fontFamily: 'DM Sans', fontSize: '16px' }}>
        Need an account?{' '}
        <a
          href="/signup"
          style={{
            textDecoration: 'underline',
            color: 'inherit',
            fontFamily: 'DM Sans',
            fontSize: '16px',
          }}
        >
          Sign up
        </a>
      </p>
    </div>
  );
}
