import "../styles/LoginForm.css";
import React, { useState } from "react";
import LoginButton from "./LoginButton";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const apiURL = process.env.REACT_APP_DEV_URL || "https://teacher-light-server.onrender.com";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleValidateUser = (event) => {
    event.preventDefault();

    setIsLoading(true);

    setUsernameError("");
    setPasswordError("");
    setValidationError("");

    if (!username.trim()) {
      setUsernameError("Enter a login name");
    }

    if (!password.trim()) {
      setPasswordError("Enter a password");
    }

    fetch(`${apiURL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherUsername: username,
        teacherPassword: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setIsLoading(false);
          return response.json().then((data) => {
            if (data) {
              setValidationError(data.message);
            } else {
              setValidationError("An error occurred while processing your request.");
            }
          });
        }
      })
      .then((data) => {
        setIsLoading(false);
        if (data && data.teacherID) {
          navigate("/landingPage", {
            state: { teacherID: data.teacherID, teacherUsername: username },
          });
          return data.teacherID;
        } else {
          console.error("ID could not be found.");
        }
      })

      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="login-container">
        <div>
          <h2 className="subheading">Support Allocation Form</h2>
        </div>
        <div className="content">
          <div className="login--header">
            <h2>Login</h2>
          </div>
          <form className="loginForm" action="#" onSubmit={handleValidateUser}>
            <div className="center-align">
              <span className="login--invalid">{validationError}</span>
            </div>
            <div className="field login--field">
              <label htmlFor="username"></label>
              <input
                type="text"
                required
                id="username"
                name="username"
                autoComplete="current-username"
                onChange={(event) => {
                  setUsername(event.target.value);
                  setUsernameError("");
                  setValidationError("");
                }}
                placeholder="Username"
              />
              <span className="fas fa-user"></span>
            </div>
            <div className="left-align">
              <span className="login--invalid">{usernameError}</span>
            </div>
            <div className="field login--field">
              <label htmlFor="password"></label>
              <input
                type="password"
                required
                id="password"
                autoComplete="current-password"
                name="password"
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError("");
                  setValidationError("");
                }}
                placeholder="Password"
              />
              <span className="fas fa-lock"></span>
            </div>
            <div className="left-align">
              <span className="login--invalid">{passwordError}</span>
            </div>
            <LoginButton handleValidateUser={handleValidateUser} />
            <div> {isLoading ? <p>Loading... Please Wait</p> : null}</div>
          </form>
        </div>
      </div>
    </>
  );
}
export default LoginForm;
