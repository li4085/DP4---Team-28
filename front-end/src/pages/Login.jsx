import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password || !role) {
      alert("Please make sure all fields are filled out.");
      return;
    }

    let endpoint;

    if (role === "patient") {
      endpoint = "http://localhost:8000/patients-login/login";
    } else {
      endpoint = "http://localhost:8000/psw-login/login";
    }

    try {
      const response = await fetch(
        `${endpoint}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { method: "POST" },
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.detail || "Login failed.");
        return;
      }

      const data = await response.json();

      // Save token and info for use on other pages
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("role", role);

      // Navigate based on role
      if (role === "patient") {
        navigate("/patient");
      } else {
        navigate("/psw");
      }
    } catch (err) {
      alert("Could not connect to the server.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        gap: "16px",
      }}
    >
      <h1
        style={{
          fontFamily: "DM Sans",
        }}
      >
        Login
      </h1>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          fontSize: "24px",
          fontFamily: "DM Sans",
        }}
      >
        <option value="" disabled>
          Select role
        </option>
        <option value="patient">Patient</option>
        <option value="psw">PSW</option>
      </select>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          padding: "10px",
          width: "250px",
          fontSize: "24px",
          fontFamily: "DM Sans",
        }}
      ></input>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          padding: "10px",
          width: "250px",
          fontSize: "24px",
          fontFamily: "DM Sans",
        }}
      ></input>

      <button
        onClick={handleLogin}
        style={{
          padding: "10px",
          fontSize: "24px",
          backgroundColor: "#547aad",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontFamily: "DM Sans",
        }}
      >
        {" "}
        Login{" "}
      </button>
    </div>
  );
}
