import { useState } from "react";

function Login({ setLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("https://powerloom-management.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid username or password");
      return;
    }

    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));

    setLoggedIn(true);
  } catch (error) {
    alert("Server connection failed. Please check the backend.");
  }
};

  return (
    <div className="login-page">

      <div className="login-card">

        <img
          src="/images/kt-logo.png"
          alt="Kiruthika Textiles Logo"
          className="login-logo"
        />

        <h1>Kiruthika Textiles</h1>

        <p className="login-subtitle">
          Powerloom Production Management System
        </p>

        <form className="login-form" onSubmit={handleLogin}>

          <div className="login-form-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

        </form>

        <p className="login-role">
          Role: <strong>Owner</strong>
        </p>

      </div>

    </div>
  );
}

export default Login;