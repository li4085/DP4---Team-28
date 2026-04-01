import { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
 
export default function PatientSchedule() {
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
 
  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/schedule/?token=${token}`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);
 
  return (
        <div style={{ display: 'flex' }}>
 
      {/* Side Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#547aad',
          height: '650px',
          width: '200px'
        }}>
 
          <Link to="/patient" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}>Home</Link>
          <Link to="/patient/schedule" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: location.pathname === '/patient/schedule' ? '#325585' : 'transparent'
          }}>Schedule</Link>
          <Link to="/patient/history" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box'
          }}>History</Link>
          <Link to="/patient/map" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #325585',
            width: '100%',
            boxSizing: 'border-box',
          }}>Map</Link>
          <Link to="/patient/settings" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            width: '100%',
            boxSizing: 'border-box'
          }}>Settings</Link>
 
        </nav>
      </div>
 
      {/*Main Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        <h1 style={{
          color: '#547aad',
          fontSize: '100px',
          marginBottom: '20px',
          fontFamily: 'Monospace',
          paddingRight: '150px'
        }}>Schedule</h1>
      </div>
    </div>
  );
}