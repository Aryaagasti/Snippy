import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FiLink, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { Navbar as BootstrapNavbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <BootstrapNavbar
      bg={darkMode ? "dark" : "primary"}
      variant={darkMode ? "dark" : "dark"}
      expand="lg"
      className="shadow-sm py-2"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FiLink className="me-2" size={24} color="white" />
          <span className="fw-bold text-white">Snippy</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
            {isAuthenticated() && (
              <>
                <Nav.Link as={Link} to="/dashboard" className="text-white">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/create" className="text-white">Create URL</Nav.Link>
              </>
            )}
            <Nav.Link as={Link} to="/features" className="text-white">Features</Nav.Link>
          </Nav>

          <Nav className="d-flex align-items-center">
            {/* Theme Toggle Button */}
            <Button
              variant={darkMode ? "outline-light" : "outline-light"}
              size="sm"
              className="me-3 rounded-circle p-2"
              onClick={toggleTheme}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </Button>

            {isAuthenticated() ? (
              <NavDropdown
                title={
                  <div className="d-inline-flex align-items-center">
                    <div className="rounded-circle bg-white d-flex align-items-center justify-content-center text-primary"
                         style={{ width: '32px', height: '32px' }}>
                      {currentUser?.name?.charAt(0) || <FiUser />}
                    </div>
                    <span className="ms-2 text-white">{currentUser?.name || 'User'}</span>
                  </div>
                }
                id="user-dropdown"
                align="end"
                className="custom-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">Your Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Sign out</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex align-items-center">
                <Nav.Link as={Link} to="/login" className="me-2 text-white">Log in</Nav.Link>
                <Button as={Link} to="/register" variant="light" className="btn-custom">Sign up</Button>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
