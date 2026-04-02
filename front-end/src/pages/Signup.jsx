import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [fullname, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [assignedPSW, setAssignedPSW] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!fullname || !age || !username || !password || !role) {
      alert('Please make sure all fields are filled out.');
      return;
    }

    if (role === 'patient' && (!address || !assignedPSW)) {
      alert('Please make sure all patient fields are filled out.');
      return;
    }

    if (Number.isNaN(Number(age)) || Number(age) <= 0) {
      alert('Please enter a valid age.');
      return;
    }

    setIsSubmitting(true);

    try {
      let signupResponse;

      if (role === 'patient') {
        signupResponse = await fetch(
          `http://localhost:8000/patients-login/signup?psw_username=${encodeURIComponent(assignedPSW)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: fullname,
              age: Number(age),
              address,
              username,
              password,
            }),
          },
        );
      } else {
        signupResponse = await fetch('http://localhost:8000/psw-login/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: fullname,
            age: Number(age),
            username,
            password,
          }),
        });
      }

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupData.detail || 'Sign up failed.');
      }

      const loginEndpoint =
        role === 'patient'
          ? 'http://localhost:8000/patients-login/login'
          : 'http://localhost:8000/psw-login/login';

      const loginResponse = await fetch(
        `${loginEndpoint}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { method: 'POST' },
      );

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.detail || 'Account created, but login failed.');
      }

      localStorage.setItem('token', loginData.token);
      localStorage.setItem('name', loginData.name);
      localStorage.setItem('role', role);

      if (role === 'patient') {
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
      handleSignup();
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
        Sign-Up
      </h1>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{
          padding: '10px',
          width: '250px',
          fontSize: '24px',
          fontFamily: 'DM Sans',
        }}
      >
        <option value="" disabled>
          Select role
        </option>
        <option value="patient">Patient</option>
        <option value="psw">PSW</option>
      </select>

      <p style={{ fontFamily: 'DM Sans', fontSize: '16px' }}>
        Already have an account?{' '}
        <a
          href="/login"
          style={{
            textDecoration: 'underline',
            color: 'inherit',
            fontFamily: 'DM Sans',
            fontSize: '16px',
          }}
        >
          Login
        </a>
      </p>

      {role === 'patient' && (
        <>
          <input
            type="text"
            placeholder="Full Name (First, Last)"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '23px', fontFamily: 'DM Sans' }}
          />

          <input
            type="text"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <input
            type="text"
            placeholder="Assigned PSW username"
            value={assignedPSW}
            onChange={(e) => setAssignedPSW(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '21px', fontFamily: 'DM Sans' }}
          />

          <input
            type="text"
            placeholder="Pick a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <input
            type="password"
            placeholder="Create a Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <button
            onClick={handleSignup}
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
            {isSubmitting ? 'Signing Up...' : 'Sign-Up'}
          </button>
        </>
      )}

      {role === 'psw' && (
        <>
          <input
            type="text"
            placeholder="Full Name (First, Last)"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '23px', fontFamily: 'DM Sans' }}
          />

          <input
            type="text"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <input
            type="text"
            placeholder="Create a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <input
            type="password"
            placeholder="Create a Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px', width: '250px', fontSize: '24px', fontFamily: 'DM Sans' }}
          />

          <button
            onClick={handleSignup}
            disabled={isSubmitting}
            style={{
              padding: '10px',
              fontSize: '24px',
              backgroundColor: '#7ed957',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isSubmitting ? 'wait' : 'pointer',
              opacity: isSubmitting ? 0.8 : 1,
              fontFamily: 'DM Sans',
            }}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign-Up'}
          </button>
        </>
      )}
    </div>
  );
}
