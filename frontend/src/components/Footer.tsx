import { Link } from 'react-router-dom';
import type { User } from '../types';

interface FooterProps {
  user: User | null;
}

export default function Footer({ user }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          {/* About Section */}
          <div className="footer__section">
            <h3>About F1 Strategies</h3>
            <p className="footer__text">
              Create, share, and analyze Formula 1 race strategies with fellow enthusiasts. 
              Plan pit stops, manage tire choices, and optimize fuel strategies.
            </p>
          </div>

          {/* Quick Links - Dynamic based on user role */}
          <div className="footer__section">
            <h3>Quick Links</h3>
            <ul className="footer__links">
              <li><Link to="/" className="footer__link">Home</Link></li>
              <li><Link to="/strategies" className="footer__link">Browse Strategies</Link></li>
              
              {!user && (
                <>
                  <li><Link to="/login" className="footer__link">Login</Link></li>
                  <li><Link to="/register" className="footer__link">Register</Link></li>
                </>
              )}

              {user && user.role === 'user' && (
                <>
                  <li><Link to="/my-strategies" className="footer__link">My Strategies</Link></li>
                  <li><Link to="/create" className="footer__link">Create Strategy</Link></li>
                </>
              )}

              {user && user.role === 'admin' && (
                <>
                  <li><Link to="/admin" className="footer__link">Admin Panel</Link></li>
                  <li><Link to="/create" className="footer__link">Create Strategy</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="footer__section">
            <h3>Connect</h3>
            <p className="footer__text">
              Join our community of F1 strategy enthusiasts
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Facebook">📘</a>
              <a href="#" className="footer__social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="footer__social-link" aria-label="Instagram">📷</a>
              <a href="#" className="footer__social-link" aria-label="YouTube">📺</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; 2025 F1 Strategies Platform. All rights reserved.</p>
          {user && (
            <p style={{ marginTop: '0.5rem', color: 'var(--f1-light-gray)' }}>
              Logged in as: <strong>{user.username}</strong> ({user.role})
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}