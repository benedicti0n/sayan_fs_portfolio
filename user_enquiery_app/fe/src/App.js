import React, { useState, useEffect } from 'react';
import Form from './components/Form';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Use the same IP address as the frontend
  const API_URL = "https://sayan-fs-portfolio.onrender.com"
  useEffect(() => {
    if (showAdminPanel) {
      fetchEnquiries();
    }
  }, [showAdminPanel]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/enquiries`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch enquiries');
      }

      setEnquiries(data.data || []);
      setError('');
    } catch (err) {
      setError('Error fetching enquiries: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminClick = () => {
    setShowAdminPanel(!showAdminPanel);
    setSelectedMessage(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleMessageClick = (enquiry) => {
    setSelectedMessage(enquiry);
  };

  const closeMessageModal = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="page-container">
      <div className="content-wrap">
        <div className="admin-button-container">
          <button className="admin-button" onClick={handleAdminClick}>
            <i className="fas fa-user-shield"></i>
          </button>
        </div>

        {showAdminPanel ? (
          <div className="admin-panel">
            <h2><i className="fas fa-database"></i></h2>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading">Loading data...</div>
            ) : enquiries.length === 0 ? (
              <div className="no-data">No enquiries found</div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map(enquiry => (
                      <tr key={enquiry._id}>
                        <td>{enquiry.name}</td>
                        <td>{enquiry.email}</td>
                        <td
                          className="message-cell"
                          onClick={() => handleMessageClick(enquiry)}
                        >
                          <div className="message-preview">
                            {enquiry.message}
                            <span className="view-more">View</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${enquiry.status}`}>
                            {enquiry.status}
                          </span>
                        </td>
                        <td>{formatDate(enquiry.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="refresh-button" onClick={fetchEnquiries}>
                  <i className="fas fa-sync-alt"></i> Refresh Data
                </button>
              </div>
            )}
          </div>
        ) : (
          <Form />
        )}

        {selectedMessage && (
          <div className="message-modal-overlay" onClick={closeMessageModal}>
            <div className="message-modal" onClick={e => e.stopPropagation()}>
              <button className="close-button" onClick={closeMessageModal}>
                <i className="fas fa-times"></i>
              </button>
              <h3>Message from {selectedMessage.name}</h3>
              <div className="message-details">
                <p><strong>Email:</strong> {selectedMessage.email}</p>
                <p><strong>Date:</strong> {formatDate(selectedMessage.createdAt)}</p>
                <p><strong>Status:</strong>
                  <span className={`status-badge ${selectedMessage.status}`}>
                    {selectedMessage.status}
                  </span>
                </p>
              </div>
              <div className="message-content">
                <p>{selectedMessage.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
