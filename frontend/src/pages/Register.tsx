import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasDigit = /\d/.test(formData.password);

    if (!hasUpperCase) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    }

    if (!hasDigit) {
      newErrors.password = 'Password must contain at least one digit';
    }

    // Password confirmation
    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await authService.register(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="auth-container">
            <div className="auth-card card">
              <div className="alert alert--success">
                <span>✅</span>
                <div>
                  <strong>Registration successful!</strong>
                  <p style={{ margin: '0.5rem 0 0 0' }}>
                    Redirecting to login page...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card card">
            <div className="auth-header">
              <h1 className="auth-title">Join F1 Strategies! 🏁</h1>
              <p className="auth-subtitle">Create your free account and start strategizing</p>
            </div>

            {errors.general && (
              <div className="alert alert--error">
                <span>⚠️</span>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username *
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  className={`form-input ${errors.username ? 'form-input--error' : ''}`}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  autoFocus
                  disabled={loading}
                  minLength={3}
                />
                {errors.username && (
                  <span className="form-error">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  disabled={loading}
                />
                {errors.email && (
                  <span className="form-error">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  disabled={loading}
                  minLength={6}
                />
                {errors.password && (
                  <span className="form-error">{errors.password}</span>
                )}
                <small style={{ color: 'var(--f1-light-gray)', display: 'block', marginTop: '0.25rem' }}>
                  Must be at least 6 characters with uppercase letter and digit
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="password_confirm" className="form-label">
                  Confirm Password *
                </label>
                <input
                  id="password_confirm"
                  type="password"
                  name="password_confirm"
                  className={`form-input ${errors.password_confirm ? 'form-input--error' : ''}`}
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  disabled={loading}
                />
                {errors.password_confirm && (
                  <span className="form-error">{errors.password_confirm}</span>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn--primary" 
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Login here
                </Link>
              </p>
            </div>
          </div>

          <div className="auth-info">
            <div className="auth-info-card card">
              <h3>Get Started in Seconds</h3>
              <ul className="auth-features">
                <li>
                  <span className="auth-feature-icon">🚀</span>
                  <span>Quick and easy registration</span>
                </li>
                <li>
                  <span className="auth-feature-icon">🔒</span>
                  <span>Secure and encrypted</span>
                </li>
                <li>
                  <span className="auth-feature-icon">💯</span>
                  <span>100% free forever</span>
                </li>
                <li>
                  <span className="auth-feature-icon">🌍</span>
                  <span>Join our global community</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}