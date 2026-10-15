import { useState } from "react";
import "../../styles/login.css";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";
import APIMethods from "../../services/apiService";
import { LoadingSpinner } from "../../components/LoadingStates";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await APIMethods.postData(`/api/login`, formData);
      console.log(response);
      login(response);
      navigate("/dashboard");
    } catch (error) {
      alert("Incorrect email or password. Please enter the right credentials.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="brand-panel">
          <div className="brand-mark">PM</div>
          <span className="brand-tag">Project management</span>
          <h1>ProjectFlow</h1>
          <p>
            Plan smarter, collaborate faster, and keep every project moving with
            complete visibility.
          </p>

          <ul className="feature-list">
            <li>Live project tracking</li>
            <li>Task updates in real time</li>
            <li>Team collaboration made easy</li>
          </ul>
        </div>

        <div className="form-panel">
          {!isRegistering && (
            <>
              <div className="form-header">
                <span className="eyebrow">Welcome back</span>
                <h2>Sign in</h2>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="email">
                    Email address<span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleOnChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password">
                    Password<span className="required">*</span>
                  </label>

                  <div className="password-input">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleOnChange}
                      placeholder="Enter your password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner label="Signing in..." />
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
              <p className="auth-toggle">
                Don’t have an account?{" "}
                <button type="button" onClick={() => setIsRegistering(true)}>
                  Register
                </button>
              </p>
            </>
          )}
          {isRegistering && (
            <UserForm onCancel={() => setIsRegistering(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
