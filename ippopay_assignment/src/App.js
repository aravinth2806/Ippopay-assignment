import React, { useState } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [steps, setSteps] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  function calculateMinSteps(password) {
    const minLength = 6;

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);

    let repeatingCount = 0;
    let steps = 0;

    for (let i = 0; i < password.length; i++) {
      if (
        i > 1 &&
        password[i] === password[i - 1] &&
        password[i] === password[i - 2]
      ) {
        repeatingCount++;
        steps += Math.floor(repeatingCount / 2);
      } else {
        repeatingCount = 0;
      }
    }

    const missingConditions = !hasLowerCase + !hasUpperCase + !hasDigit;
    const lengthDifference = Math.max(0, minLength - password.length);

    return Math.max(lengthDifference, missingConditions, steps);
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setSteps(calculateMinSteps(newPassword));
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (event) => {
    const data = {
      name: username,
      password: password,
    };
    event.preventDefault();

    // Make the API call
    axios
      .post("http://127.0.0.1:4000/api/admin/login", data)
      .then((response) => {
        // Handle successful login (e.g., redirect to dashboard)
        console.log("response", response);
        if (response) {
          setUsername("");
          setPassword("");
          alert(response.data.message);
        }
      })
      .catch((error) => {
        // Handle login error
        setLoginError("Invalid username or password");
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />{" "}
          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
          />{" "}
          <span onClick={togglePasswordVisibility}>
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </span>
          {steps !== 0 ? (
            <p>Steps required to make password strong: {steps}</p>
          ) : (
            ""
          )}
          <p className="error-message">{loginError}</p>
          <button type="submit" onClick={handleLogin}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
