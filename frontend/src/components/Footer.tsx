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