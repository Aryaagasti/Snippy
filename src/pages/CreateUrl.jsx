import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLink, FiCopy, FiCheck, FiCalendar, FiInfo, FiArrowLeft } from 'react-icons/fi';
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert } from 'react-bootstrap';
import { urlAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateUrl = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [oneTimeUse, setOneTimeUse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalUrl) {
      toast.error('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (err) {
      toast.error('Invalid URL format');
      return;
    }

    try {
      setLoading(true);

      const urlData = {
        originalUrl,
        customSlug: customSlug || undefined,
        description: description || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        oneTimeUse
      };

      const response = await urlAPI.shortenUrl(urlData);
      setShortUrl(response.data.data.shortUrl);
      toast.success('URL shortened successfully!');
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

  const handleCreateAnother = () => {
    setOriginalUrl('');
    setCustomSlug('');
    setDescription('');
    setExpiresAt('');
    setOneTimeUse(false);
    setShortUrl('');
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-2">
            <Button
              as={Link}
              to="/dashboard"
              variant="link"
              className="p-0 me-2 text-decoration-none"
            >
              <FiArrowLeft className="me-1" /> Back to Dashboard
            </Button>
          </div>
          <h1 className="h2 fw-bold mb-2">Create Snippy Link</h1>
          <p className="text-secondary">
            Create a new shortened link with custom options
          </p>
        </Col>
      </Row>

      {shortUrl ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="rounded-circle bg-success bg-opacity-10 text-success d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                <FiCheck size={32} />
              </div>
              <h3 className="h4 fw-bold">Snippy Link Created Successfully</h3>
              <p className="text-secondary">Your shortened link is ready to use and share.</p>
            </div>

            <div className="bg-light rounded p-3 d-flex align-items-center justify-content-between mb-4">
              <span className="text-break fw-medium me-2">
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

            <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
              <Button
                variant="outline-secondary"
                onClick={handleCreateAnother}
                className="btn-custom"
              >
                Create Another
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                className="btn-custom"
              >
                Go to Dashboard
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4 p-md-5">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label htmlFor="original-url">
                  Original URL <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <FiLink className="text-secondary" />
                  </InputGroup.Text>
                  <Form.Control
                    id="original-url"
                    type="text"
                    placeholder="https://example.com/very/long/url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    required
                    className="border-start-0 ps-0"
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="custom-slug">
                  Custom Slug (Optional)
                </Form.Label>
                <Form.Control
                  id="custom-slug"
                  type="text"
                  placeholder="my-custom-url"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Leave empty to generate a random slug
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="description">
                  Description (Optional)
                </Form.Label>
                <Form.Control
                  id="description"
                  type="text"
                  placeholder="A brief description of this URL"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="expires-at">
                  Expiration Date (Optional)
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <FiCalendar className="text-secondary" />
                  </InputGroup.Text>
                  <Form.Control
                    id="expires-at"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="border-start-0 ps-0"
                  />
                </InputGroup>
                <Form.Text className="text-muted">
                  Leave empty for a URL that never expires
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="one-time-use"
                  label={
                    <div>
                      <span className="fw-medium">One-time use</span>
                      <p className="text-secondary mb-0 mt-1">Recommended for sensitive links (you'll need to manually deactivate it)</p>
                    </div>
                  }
                  checked={oneTimeUse}
                  onChange={(e) => setOneTimeUse(e.target.checked)}
                />
              </Form.Group>

              <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Shortened URL'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default CreateUrl;
