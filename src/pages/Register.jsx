import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 25;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25;

    // Contains number or special char
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;

    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return 'danger';
    if (passwordStrength <= 50) return 'warning';
    if (passwordStrength <= 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await register(name, email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to create an account');
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

      // Check if it's the unauthorized domain error
      if (error.message && error.message.includes('domain is not authorized')) {
        setError(
          'This domain is not authorized for Google authentication. Please use email/password registration for now. ' +
          'To fix this permanently, the domain needs to be added to Firebase authorized domains list.'
        );
      } else {
        setError(error.message || 'Failed to sign up with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page py-5 bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7} xl={6}>
            <div className="text-center mb-4">
              <h1 className="h2 fw-bold mb-2">Join Snippy Today</h1>
              <p className="text-muted">Create your account and start shortening links</p>
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
                    <Form.Label htmlFor="name">Full Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FiUser className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border-start-0 ps-0"
                      />
                    </InputGroup>
                  </Form.Group>

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
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FiLock className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        className="border-start-0 ps-0"
                      />
                    </InputGroup>

                    {password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small>Password Strength</small>
                          <small className={`text-${getPasswordStrengthColor()}`}>{getPasswordStrengthText()}</small>
                        </div>
                        <ProgressBar
                          variant={getPasswordStrengthColor()}
                          now={passwordStrength}
                          className="password-strength-meter"
                          style={{ height: '6px' }}
                        />

                        <div className="mt-2 d-flex flex-wrap">
                          <div className="me-3 mb-1 d-flex align-items-center">
                            <div className={`me-1 rounded-circle ${password.length >= 8 ? 'bg-success' : 'bg-secondary'}`} style={{ width: '8px', height: '8px' }}></div>
                            <small className="text-muted">8+ characters</small>
                          </div>
                          <div className="me-3 mb-1 d-flex align-items-center">
                            <div className={`me-1 rounded-circle ${/[A-Z]/.test(password) ? 'bg-success' : 'bg-secondary'}`} style={{ width: '8px', height: '8px' }}></div>
                            <small className="text-muted">Uppercase</small>
                          </div>
                          <div className="me-3 mb-1 d-flex align-items-center">
                            <div className={`me-1 rounded-circle ${/[0-9]/.test(password) ? 'bg-success' : 'bg-secondary'}`} style={{ width: '8px', height: '8px' }}></div>
                            <small className="text-muted">Number</small>
                          </div>
                        </div>
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="confirm-password">Confirm Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FiLock className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border-start-0 ps-0"
                      />
                    </InputGroup>

                    {confirmPassword && password === confirmPassword && (
                      <div className="mt-2 d-flex align-items-center text-success">
                        <FiCheck size={14} className="me-1" />
                        <small>Passwords match</small>
                      </div>
                    )}

                    {confirmPassword && password !== confirmPassword && (
                      <div className="mt-2 d-flex align-items-center text-danger">
                        <FiAlertCircle size={14} className="me-1" />
                        <small>Passwords don't match</small>
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="agree-terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      label={
                        <span>I agree to the <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a></span>
                      }
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
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </Form>

                <div className="text-center mb-4">
                  <p className="text-muted mb-0">Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-medium">
                      Sign In
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
