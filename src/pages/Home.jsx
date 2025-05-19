import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLink, FiCopy, FiCheck, FiBarChart2, FiShield, FiClock } from 'react-icons/fi';
import { Container, Row, Col, Form, Button, InputGroup, Card, Badge } from 'react-bootstrap';
import { urlAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (err) {
      toast.error('Invalid URL format');
      return;
    }

    try {
      setLoading(true);

      if (!isAuthenticated()) {
        // For non-authenticated users, just show a demo
        const slug = Math.random().toString(36).substring(2, 8);
        setShortUrl(`http://localhost:3000/s/${slug}`);
        toast.success('URL shortened! (Demo mode)');
        toast('Sign up to create real shortened URLs', {
          icon: '👋',
        });
      } else {
        // For authenticated users, call the API
        const response = await urlAPI.shortenUrl({ originalUrl: url });
        setShortUrl(response.data.data.shortUrl);
        toast.success('URL shortened successfully!');
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast.error(error.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success('Copied to clipboard!');

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <Container className="py-5">
          <Row className="justify-content-center text-center py-5">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">Snippy - Your Smart Link Buddy</h1>
              <p className="lead fs-4 mb-5">
                Create short, memorable links that redirect to your long URLs. Track clicks and analyze your audience.
              </p>

              {/* URL Shortener Form */}
              <Form onSubmit={handleSubmit} className="mb-4">
                <Row className="justify-content-center">
                  <Col md={8}>
                    <InputGroup className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Enter your long URL here"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        aria-label="URL to shorten"
                      />
                      <Button
                        variant="light"
                        type="submit"
                        disabled={loading}
                        className="fw-medium px-4"
                      >
                        {loading ? 'Shortening...' : 'Shorten URL'}
                      </Button>
                    </InputGroup>
                  </Col>
                </Row>
              </Form>

              {/* Display shortened URL */}
              {shortUrl && (
                <div className="bg-white rounded p-3 d-flex align-items-center justify-content-between mx-auto" style={{ maxWidth: '500px' }}>
                  <span className="text-dark fw-medium text-truncate me-3">
                    {shortUrl}
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleCopy}
                    className="flex-shrink-0"
                  >
                    {copied ? <FiCheck /> : <FiCopy />}
                  </Button>
                </div>
              )}

              {!isAuthenticated() && (
                <div className="mt-3 text-white">
                  <Link to="/register" className="text-white fw-medium text-decoration-underline">
                    Sign up
                  </Link>{' '}
                  to create real shortened URLs with analytics and more features.
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div className="section-padding bg-white">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Powerful URL Shortening Features</h2>
              <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>
                Everything you need to manage, track, and optimize your links
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Feature 1 */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon mx-auto mb-3">
                    <FiBarChart2 />
                  </div>
                  <h3 className="h4 fw-bold mb-3">Detailed Analytics</h3>
                  <p className="text-secondary mb-0">
                    Track clicks, geographic locations, devices, browsers, and referrers for each shortened URL.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Feature 2 */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon mx-auto mb-3">
                    <FiShield />
                  </div>
                  <h3 className="h4 fw-bold mb-3">Custom URLs</h3>
                  <p className="text-secondary mb-0">
                    Create branded, memorable links with custom slugs that reflect your content or brand.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Feature 3 */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <div className="feature-icon mx-auto mb-3">
                    <FiClock />
                  </div>
                  <h3 className="h4 fw-bold mb-3">Expiration & One-Time Use</h3>
                  <p className="text-secondary mb-0">
                    Set expiration dates for links or create one-time use links for enhanced security.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-5">
            <Button
              as={Link}
              to={isAuthenticated() ? '/dashboard' : '/register'}
              variant="primary"
              size="lg"
              className="btn-custom px-5"
            >
              {isAuthenticated() ? 'Go to Dashboard' : 'Get Started for Free'}
            </Button>
          </div>
        </Container>
      </div>

      {/* How It Works Section */}
      <div className="section-padding bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">How It Works</h2>
              <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>
                Three simple steps to start shortening your URLs
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Step 1 */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">1</span>
                    </div>
                    <h3 className="h4 fw-bold mb-0">Create an Account</h3>
                  </div>
                  <p className="text-secondary mb-0">
                    Sign up for free and get access to all our URL shortening features.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Step 2 */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">2</span>
                    </div>
                    <h3 className="h4 fw-bold mb-0">Paste Your Long URL</h3>
                  </div>
                  <p className="text-secondary mb-0">
                    Enter your long URL in the shortener form and customize options if needed.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Step 3 */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">3</span>
                    </div>
                    <h3 className="h4 fw-bold mb-0">Share Your Short URL</h3>
                  </div>
                  <p className="text-secondary mb-0">
                    Copy your shortened URL and share it on social media, emails, or anywhere else.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="mb-4 mb-lg-0">
              <h2 className="display-5 fw-bold">Ready to get started?</h2>
              <p className="lead mb-0">Create your free account today.</p>
            </Col>
            <Col lg={5} className="text-lg-end">
              <Button
                as={Link}
                to="/register"
                variant="light"
                size="lg"
                className="me-3 btn-custom"
              >
                Sign up for free
              </Button>
              <Button
                as={Link}
                to="/features"
                variant="outline-light"
                size="lg"
                className="btn-custom"
              >
                Learn more
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Home;
