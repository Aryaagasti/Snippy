import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to log in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page py-5 bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="text-center mb-4">
              <h1 className="h2 fw-bold mb-2">Welcome to Snippy!</h1>
              <p className="text-muted">Sign in to your account to continue</p>
            </div>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                {error && (
                  <Alert variant="danger" className="d-flex align-items-center">
                    <FiAlertCircle className="me-2" size={18} />
                    <span>{error}</span>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="email">Email Address</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FiMail className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-start-0 ps-0"
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Label htmlFor="password" className="mb-0">Password</Form.Label>
                      <Link to="/forgot-password" className="text-decoration-none small">
                        Forgot password?
                      </Link>
                    </div>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FiLock className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-start-0 ps-0"
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="remember-me"
                      label="Remember me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  </Form.Group>

                  <div className="d-grid mb-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="btn-custom"
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </div>
                </Form>

                <div className="text-center mb-4">
                  <p className="text-muted mb-0">Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none fw-medium">
                      Create Account
                    </Link>
                  </p>
                </div>

                <div className="position-relative mb-4">
                  <hr />
                  <div className="position-absolute top-50 start-50 translate-middle px-3 bg-white">
                    <span className="text-muted">Or</span>
                  </div>
                </div>

                <div className="d-grid">
                  <Button
                    variant="light"
                    size="lg"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="btn-custom d-flex align-items-center justify-content-center border"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <FcGoogle className="me-2" size={24} />
                    <span className="fw-medium">Continue with Google</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                By signing in, you agree to our <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
