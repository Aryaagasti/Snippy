import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiEdit, FiKey, FiSave, FiX } from 'react-icons/fi';
import { Container, Row, Col, Card, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // This would be implemented with a real API call
      // await userAPI.updateProfile({ name });
      
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // This would be implemented with a real API call
      // await userAPI.changePassword({ currentPassword, newPassword });
      
      toast.success('Password changed successfully');
      setChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="h2 fw-bold mb-4">Your Profile</h1>
          
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              {!editMode ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h5 fw-bold mb-0">Personal Information</h2>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => setEditMode(true)}
                      className="d-flex align-items-center"
                    >
                      <FiEdit className="me-1" /> Edit
                    </Button>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FiUser className="text-secondary me-2" />
                      <span className="text-secondary">Name</span>
                    </div>
                    <p className="fw-medium mb-0">{name}</p>
                  </div>
                  
                  <div>
                    <div className="d-flex align-items-center mb-2">
                      <FiMail className="text-secondary me-2" />
                      <span className="text-secondary">Email</span>
                    </div>
                    <p className="fw-medium mb-0">{email}</p>
                  </div>
                </>
              ) : (
                <Form onSubmit={handleSaveProfile}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h5 fw-bold mb-0">Edit Profile</h2>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setEditMode(false)}
                      className="d-flex align-items-center"
                      type="button"
                    >
                      <FiX className="me-1" /> Cancel
                    </Button>
                  </div>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FiUser className="text-secondary" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border-start-0 ps-0"
                      />
                    </InputGroup>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FiMail className="text-secondary" />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        value={email}
                        disabled
                        className="border-start-0 ps-0 bg-light"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Email cannot be changed
                    </Form.Text>
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <FiSave className="me-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              {!changePassword ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h5 fw-bold mb-0">Security</h2>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => setChangePassword(true)}
                      className="d-flex align-items-center"
                    >
                      <FiKey className="me-1" /> Change Password
                    </Button>
                  </div>
                  
                  <p className="text-secondary mb-0">
                    Your password was last changed on {new Date().toLocaleDateString()}
                  </p>
                </>
              ) : (
                <Form onSubmit={handleChangePassword}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h5 fw-bold mb-0">Change Password</h2>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setChangePassword(false)}
                      className="d-flex align-items-center"
                      type="button"
                    >
                      <FiX className="me-1" /> Cancel
                    </Button>
                  </div>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? 'Changing Password...' : 'Change Password'}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
