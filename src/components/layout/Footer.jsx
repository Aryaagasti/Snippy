import { Link } from 'react-router-dom';
import { FiLink, FiGithub, FiLinkedin } from 'react-icons/fi';
import { Container, Row, Col } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${darkMode ? 'bg-dark text-light' : 'bg-primary text-white'} py-5 mt-auto`}>
      <Container>
        <Row className="mb-4">
          <Col md={6} className="mb-4 mb-md-0">
            <div className="d-flex align-items-center">
              <FiLink size={28} className="me-2" />
              <span className="fw-bold fs-4">Snippy</span>
            </div>
            <p className={`${darkMode ? 'text-light' : 'text-white'} mt-3 opacity-75`}>
              Create short, memorable links that redirect to your long URLs.
              Track clicks and analyze your audience.
            </p>
          </Col>
          <Col md={6}>
            <Row>
              <Col sm={6}>
                <h5 className="fw-bold mb-3">Quick Links</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to="/" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-white'} opacity-75 hover-opacity-100`}>Home</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/features" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-white'} opacity-75 hover-opacity-100`}>Features</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/dashboard" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-white'} opacity-75 hover-opacity-100`}>Dashboard</Link>
                  </li>
                </ul>
              </Col>
              <Col sm={6}>
                <h5 className="fw-bold mb-3">Account</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to="/login" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-white'} opacity-75 hover-opacity-100`}>Login</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/register" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-white'} opacity-75 hover-opacity-100`}>Sign Up</Link>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="d-flex justify-content-center mb-4">
          <a href="https://github.com/Aryaagasti" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-light' : 'text-white'} opacity-75 mx-2 hover-opacity-100`}>
            <FiGithub size={24} />
          </a>
          <a href="https://www.linkedin.com/in/arya-agasti-56234018b/" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-light' : 'text-white'} opacity-75 mx-2 hover-opacity-100`}>
            <FiLinkedin size={24} />
          </a>
        </div>

        <hr className={`${darkMode ? 'border-secondary' : 'border-white opacity-25'}`} />

        <div className="text-center">
          <p className="mb-0 small opacity-75">&copy; {currentYear} Snippy. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
