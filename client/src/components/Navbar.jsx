import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">Nightmare Studioz</span>
          </Link>
          
          <label className="theme-toggle">
            <input 
              type="checkbox" 
              checked={theme === 'dark'} 
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
