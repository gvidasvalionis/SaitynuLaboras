import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import type { User } from '../types';

interface LoginProps {
    onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login({ username, password });
            const currentUser = await authService.getCurrentUser();
            onLogin(currentUser);
            navigate('/');
        } catch (error: any) {
            setError(error.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-container">
                    <div className="auth-card card">
                        <div className="auth-header">
                            <h1 className="auth-title">Welcome Back!</h1>
                            <p className="auth-subtitle">Login to your F1 app</p>
                        </div>

                        {error && (
                            <div className="alert alert--error">
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="username" className="form-label">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    className="form-input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoFocus
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn--primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                                        Logging in...
                                    </span>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                Don't have an account? <Link to="/register">Register here</Link>.
                            </p>
                        </div>
                    </div>

                    <div className="auth-info">
                        <div className="auth-info-card card">
                            <h3> Why Join F1 App?</h3>
                            <ul className="auth-features">
                                <li>
                                    <span className="auth-feature-icon">✅</span>
                                    <span>Create unlimited race strategies</span>
                                </li>
                                <li>
                                    <span className="auth-feature-icon">✅</span>
                                    <span>Share with the community</span>
                                </li>
                                <li>
                                    <span className="auth-feature-icon">✅</span>
                                    <span>Analyze pit stop tactics</span>
                                </li>
                                <li>
                                    <span className="auth-feature-icon">✅</span>
                                    <span>Learn from other strategists</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}