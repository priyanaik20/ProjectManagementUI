import { useState } from 'react';
import APIMethods from '../../services/apiService';

function UserForm({ onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    passwordHash: '',
    role: '',
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  // const [createdAt] = useState(() => new Date().toISOString());

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await APIMethods.postData('/api/user', {
        ...formData
      });
      setIsSuccess(true);
      setMessage('Your account has been created. You can now sign in.');
    } catch (error) {
      console.error('Error registering user:', error);
      setIsSuccess(false);
      setMessage(
        error.response?.data?.message ||
          (typeof error.response?.data === 'string' ? error.response.data : '') ||
          error.message ||
          'Registration failed.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="form-header">
        <span className="eyebrow">Get started</span>
        <h2>Create account</h2>
      </div>

      <form className="login-form registration-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="register-name">Name</label>
          <input
            id="register-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="passwordHash"
            type="password"
            value={formData.passwordHash}
            onChange={handleChange}
            placeholder="Create a password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="register-role">Role</label>
          <input
            id="register-role"
            name="role"
            type="text"
            value={formData.role}
            onChange={handleChange}
            placeholder="Enter your role"
            required
          />
        </div>

        <label className="checkbox-row active-row">
          <input
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span>Active account</span>
        </label>

        {message && (
          <p className={`form-message ${isSuccess ? 'success' : 'error'}`} role="status">
            {message}
          </p>
        )}

        <button type="submit" className="login-button" disabled={isLoading || isSuccess}>
          {isLoading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="auth-toggle">
        Already have an account?{' '}
        <button type="button" onClick={onCancel}>
          Sign in
        </button>
      </p>
    </>
  );
}

export default UserForm;
