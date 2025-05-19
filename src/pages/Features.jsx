import { Link } from 'react-router-dom';
import { FiBarChart2, FiShield, FiClock, FiLink, FiSmartphone, FiGlobe, FiLock, FiDownload } from 'react-icons/fi';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Features = () => {
  // Feature data for easy mapping
  const features = [
    {
      icon: <FiBarChart2 />,
      title: "Detailed Analytics",
      description: "Track clicks, geographic locations, devices, browsers, and referrers for each shortened URL. Gain valuable insights into your audience and link performance."
    },
    {
      icon: <FiShield />,
      title: "Custom URLs",
      description: "Create branded, memorable links with custom slugs that reflect your content or brand. Make your links more trustworthy and recognizable."
    },
    {
      icon: <FiClock />,
      title: "Expiration & One-Time Use",
      description: "Set expiration dates for links or create one-time use links for enhanced security. Perfect for time-sensitive content or secure sharing."
    },
    {
      icon: <FiLink />,
      title: "Link Management",
      description: "Easily manage all your shortened URLs in one place. Activate, deactivate, or delete links as needed. Add descriptions to keep track of link purposes."
    },
    {
      icon: <FiSmartphone />,
      title: "Mobile Friendly",
      description: "Our responsive design works seamlessly on all devices. Create and manage your shortened URLs on the go from your smartphone or tablet."
    },
    {
      icon: <FiGlobe />,
      title: "Global Tracking",
      description: "See where your links are being clicked from around the world. Understand your global audience with country and region-based analytics."
    },
    {
      icon: <FiLock />,
      title: "Secure & Reliable",
      description: "Our platform is built with security in mind. Your data and links are protected, and our service ensures high availability and reliability."
    },
    {
      icon: <FiDownload />,
      title: "QR Code Generation",
      description: "Generate QR codes for your shortened URLs. Perfect for print materials, business cards, or any offline-to-online marketing campaigns."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <Container className="py-5">
          <Row className="justify-content-center text-center py-5">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">Snippy's Powerful Features</h1>
              <p className="lead fs-4 mb-0">
                Snippy provides a comprehensive set of features to help you manage, track, and optimize your links.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Grid */}
      <div className="section-padding bg-white">
        <Container>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} lg={4} key={index}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div className="feature-icon mx-auto mb-3">
                      {feature.icon}
                    </div>
                    <h3 className="h4 fw-bold mb-3">{feature.title}</h3>
                    <p className="text-secondary mb-0">
                      {feature.description}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Comparison Section */}
      <div className="section-padding bg-light">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h2 className="display-5 fw-bold mb-3">Why Choose Snippy?</h2>
              <p className="lead text-secondary">
                Compare our features with other link shortening services
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th scope="col">Feature</th>
                      <th scope="col" className="text-center">Our Service</th>
                      <th scope="col" className="text-center">Basic Services</th>
                      <th scope="col" className="text-center">Premium Services</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Custom URLs</td>
                      <td className="text-center text-success fw-bold">✓</td>
                      <td className="text-center text-danger">✗</td>
                      <td className="text-center text-success">✓</td>
                    </tr>
                    <tr>
                      <td>Analytics Dashboard</td>
                      <td className="text-center text-success fw-bold">✓</td>
                      <td className="text-center text-danger">✗</td>
                      <td className="text-center text-success">✓</td>
                    </tr>
                    <tr>
                      <td>QR Code Generation</td>
                      <td className="text-center text-success fw-bold">✓</td>
                      <td className="text-center text-danger">✗</td>
                      <td className="text-center text-success">✓</td>
                    </tr>
                    <tr>
                      <td>Link Expiration</td>
                      <td className="text-center text-success fw-bold">✓</td>
                      <td className="text-center text-danger">✗</td>
                      <td className="text-center text-success">✓</td>
                    </tr>
                    <tr>
                      <td>One-time Use Links</td>
                      <td className="text-center text-success fw-bold">✓</td>
                      <td className="text-center text-danger">✗</td>
                      <td className="text-center text-danger">✗</td>
                    </tr>
                    <tr>
                      <td>Free Plan</td>
                      <td className="text-center text-success fw-bold">✓</td>
                      <td className="text-center text-success">✓</td>
                      <td className="text-center text-danger">✗</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                to="/"
                variant="outline-light"
                size="lg"
                className="btn-custom"
              >
                Try it now
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Features;
