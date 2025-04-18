import { NavLink } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  isLoggedIn: boolean;
}

const Navbar = ({ isLoggedIn }: NavbarProps) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">PETFINDER</NavLink>
      </div>
      <div className="navbar-links">
        {isLoggedIn && ( 
          <NavLink to="/available-animals" className={({ isActive }) => (isActive ? 'active' : '')}>
            Available pets
          </NavLink>
        )}
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
          Happy stories
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;