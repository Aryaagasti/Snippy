import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiLink, FiCopy, FiBarChart2, FiTrash2, FiEye, FiEyeOff, FiPlus, FiDownload, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { Container, Row, Col, Button, Card, Badge, Table, Spinner, Alert } from 'react-bootstrap';
import { urlAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedSlug, setCopiedSlug] = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await urlAPI.getUserUrls();
      setUrls(response.data.data);
      setError('');
    } catch (error) {
      console.error('Error fetching URLs:', error);
      setError('Failed to fetch URLs');
      toast.error('Failed to fetch your URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (shortUrl, slug) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedSlug(slug);
    toast.success('Copied to clipboard!');

    setTimeout(() => {
      setCopiedSlug('');
    }, 2000);
  };

  const handleDeactivate = async (slug) => {
    try {
      await urlAPI.deactivateUrl(slug);

      // Update the URL in the state
      setUrls(urls.map(url =>
        url.slug === slug ? { ...url, active: false } : url
      ));

      toast.success('URL deactivated successfully');
    } catch (error) {
      console.error('Error deactivating URL:', error);
      toast.error('Failed to deactivate URL');
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Are you sure you want to delete this URL? This action cannot be undone.')) {
      try {
        await urlAPI.deleteUrl(slug);

        // Remove the URL from the state
        setUrls(urls.filter(url => url.slug !== slug));

        toast.success('URL deleted successfully');
      } catch (error) {
        console.error('Error deleting URL:', error);
        toast.error('Failed to delete URL');
      }
    }
  };

  const handleDownloadQR = async (slug) => {
    try {
      const response = await urlAPI.generateQrCode(slug);

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qr-${slug}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('QR code downloaded successfully');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h1 className="h2 fw-bold mb-1">Your Snippy Links</h1>
          <p className="text-secondary mb-0">
            Manage and track all your shortened links
          </p>
        </Col>
        <Col md={6} className="d-flex justify-content-md-end mt-3 mt-md-0">
          <Button
            variant="outline-secondary"
            className="me-2 d-flex align-items-center"
            onClick={fetchUrls}
          >
            <FiRefreshCw className="me-2" />
            Refresh
          </Button>
          <Button
            as={Link}
            to="/create"
            variant="primary"
            className="d-flex align-items-center"
          >
            <FiPlus className="me-2" />
            Create New URL
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-secondary">Loading your URLs...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : urls.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <div className="mb-3">
              <FiLink size={48} className="text-secondary" />
            </div>
            <h3 className="h5 fw-bold mb-2">No URLs found</h3>
            <p className="text-secondary mb-4">
              Get started by creating a new shortened URL.
            </p>
            <Button
              as={Link}
              to="/create"
              variant="primary"
              className="btn-custom"
            >
              Create New URL
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Original URL</th>
                    <th>Short URL</th>
                    <th className="text-center">Clicks</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Expires</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url) => (
                    <tr key={url.slug}>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                            url.active && !url.expired ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'
                          }`} style={{ width: '36px', height: '36px' }}>
                            {url.active && !url.expired ? <FiEye /> : <FiEyeOff />}
                          </div>
                          <div className="text-truncate" style={{ maxWidth: '250px' }}>
                            {url.originalUrl}
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <span className="text-primary fw-medium me-2">{url.shortUrl}</span>
                          <Button
                            variant="link"
                            className="p-0 text-secondary"
                            onClick={() => handleCopy(url.shortUrl, url.slug)}
                          >
                            {copiedSlug === url.slug ? <FiCheck className="text-success" /> : <FiCopy />}
                          </Button>
                        </div>
                      </td>
                      <td className="text-center align-middle">
                        <Badge bg="primary" pill>{url.totalClicks}</Badge>
                      </td>
                      <td className="text-center align-middle">
                        <Badge
                          bg={url.active && !url.expired ? 'success' : 'danger'}
                          pill
                        >
                          {url.active && !url.expired
                            ? 'Active'
                            : url.expired
                            ? 'Expired'
                            : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="text-center align-middle">
                        {url.expiresAt ? (
                          <span className="small text-secondary">
                            {new Date(url.expiresAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="small text-secondary">Never</span>
                        )}
                      </td>
                      <td className="text-center align-middle">
                        <div className="d-flex justify-content-center">
                          <Button
                            as={Link}
                            to={`/analytics/${url.slug}`}
                            variant="light"
                            size="sm"
                            className="me-1"
                            title="View Analytics"
                          >
                            <FiBarChart2 />
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            className="me-1"
                            title="Download QR Code"
                            onClick={() => handleDownloadQR(url.slug)}
                          >
                            <FiDownload />
                          </Button>
                          {url.active && !url.expired && (
                            <Button
                              variant="light"
                              size="sm"
                              className="me-1"
                              title="Deactivate URL"
                              onClick={() => handleDeactivate(url.slug)}
                            >
                              <FiEyeOff />
                            </Button>
                          )}
                          <Button
                            variant="light"
                            size="sm"
                            className="text-danger"
                            title="Delete URL"
                            onClick={() => handleDelete(url.slug)}
                          >
                            <FiTrash2 />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Dashboard;
