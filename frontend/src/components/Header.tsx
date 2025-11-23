import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__container container">
        <Link to="/" className="header__logo">
          🏎️ F1 STRATEGIES
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav">
          <ul className="nav__list">
            <li><Link to="/" className="nav__link">HOME</Link></li>
            <li><Link to="/browse" className="nav__link">BROWSE</Link></li>
            
            {/* Show STRATEGIES only for logged-in users */}
            {user && (
              <li><Link to="/strategies" className="nav__link">STRATEGIES</Link></li>
            )}
            
            {/* Guest Navigation */}
            {!user && (
              <>
                <li><Link to="/login" className="nav__link">LOGIN</Link></li>
                <li><Link to="/register" className="nav__link">REGISTER</Link></li>
              </>
            )}

            {/* User Navigation */}
            {user && user.role === 'user' && (
              <>
                <li><Link to="/create" className="nav__link">CREATE</Link></li>
                <li>
                  <button onClick={handleLogout} className="nav__link">
                    LOGOUT ({user.username})
                  </button>
                </li>
              </>
            )}

            {/* Admin Navigation */}
            {user && user.role === 'admin' && (
              <>
                <li><Link to="/admin" className="nav__link">ADMIN</Link></li>
                <li><Link to="/create" className="nav__link">CREATE</Link></li>
                <li>
                  <button onClick={handleLogout} className="nav__link">
                    LOGOUT ({user.username})
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button (Hamburger) */}
        <button
          className={`mobile-menu-btn ${mobileMenuOpen ? 'mobile-menu-btn--open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="mobile-menu-btn__line"></span>
          <span className="mobile-menu-btn__line"></span>
          <span className="mobile-menu-btn__line"></span>
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`mobile-nav__overlay ${mobileMenuOpen ? 'mobile-nav__overlay--active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav--open' : ''}`}>
        <ul className="mobile-nav__list">
          <li>
            <Link to="/" className="mobile-nav__link" onClick={() => setMobileMenuOpen(false)}>
              HOME
            </Link>
          </li>
          <li>
            <Link to="/browse" className="mobile-nav__link" onClick={() => setMobileMenuOpen(false)}>
              BROWSE
            </Link>
          </li>

          {/* Show STRATEGIES only for logged-in users */}
          {user && (
            <li>
              <Link to="/strategies" className="mobile-nav__link" onClick={() => setMobileMenuOpen(false)}>
                STRATEGIES
              </Link>
            </li>
          )}

          {/* Guest Mobile Navigation */}
          {!user && (
            <>
              <li>
                <Link to="/login" className="mobile-nav__link" onClick={() => setMobileMenuOpen(false)}>
                  LOGIN
                </Link>
              </li>
              <li>
                <Link to="/register" className="mobile-nav__link" onClick={() => setMobileMenuOpen(false)}>
                  REGISTER
                </Link>
              </li>
            </>
          )}

          {/* User Mobile Navigation */}
          {user && user.role === 'user' && (
            <>
              <li>
                <Link to="/create" className="mobile-nav__link" onClick={() => setMobileMenuOpen(false)}>
                  CREATE
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="mobile-nav__link">
                  LOGOUT
                </button>
              </li>
            </>
          )}

          {/* Admin Mobile Navigation */}
          {user && user.role === 'admin' && (
            <>
              <li>
                <Link to="/admin" className="mobile-nav__link" onClick={() => setMobileMenuOpen(false)}>
                  ADMIN PANEL
                </Link>
              </li>
              <li>
                <Link to="/create" className="mobile-nav__link" onClick={() => setMobileMenuOpen(false)}>
                  CREATE STRATEGY
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="mobile-nav__link">
                  LOGOUT
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}