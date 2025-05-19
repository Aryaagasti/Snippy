import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { Container, Row, Col, Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <div className="not-found-page d-flex align-items-center justify-content-center min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8} lg={6}>
            <div className="error-content">
              <h1 className="display-1 fw-bold text-primary" style={{ fontSize: '10rem', lineHeight: '1' }}>404</h1>
              <h2 className="display-5 fw-bold mb-3">Page Not Found</h2>
              <p className="lead text-secondary mb-4">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button
                  as={Link}
                  to="/"
                  variant="primary"
                  size="lg"
                  className="btn-custom d-inline-flex align-items-center"
                >
                  <FiHome className="me-2" />
                  Back to Home
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  variant="outline-secondary"
                  size="lg"
                  className="btn-custom d-inline-flex align-items-center"
                >
                  <FiArrowLeft className="me-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
