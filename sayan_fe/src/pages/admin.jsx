import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './admin.module.css';

// API base URL - can be configured based on environment
const API_BASE_URL = "https://sayan-fs-be.onrender.com/api";

// Debug log
console.log('Admin component loaded, API_BASE_URL:', API_BASE_URL);

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  // Fetch all users on component mount
  useEffect(() => {
    console.log('Admin component mounted, fetching users...');
    fetchUsers();
  }, []);

  // Function to fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    const url = `${API_BASE_URL}/admin/users`;
    console.log('Fetching users from:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Users fetched successfully:', data.length);
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load user messages. Please try again later.');
      toast.error('Failed to load user messages');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Remove the deleted user from the state
      setUsers(users.filter(user => user._id !== userId));
      toast.success('Message deleted successfully');

      // Close modal if the deleted user was being viewed
      if (selectedUser && selectedUser._id === userId) {
        setShowModal(false);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
      toast.error('Failed to delete message');
    }
  };

  // Function to view user details
  const viewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Function to handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'cards' : 'table');
  };

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Apply sorting and filtering
  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render user cards for mobile view
  const renderUserCards = () => {
    if (filteredUsers.length === 0) {
      return (
        <div className={styles.noDataCard}>
          {searchTerm ? 'No matching messages found' : 'No messages yet. When users submit the contact form, their messages will appear here.'}
        </div>
      );
    }

    return filteredUsers.map(user => (
      <div key={user._id} className={styles.userCard}>
        <div className={styles.cardHeader}>
          <h3>{user.name}</h3>
          <span className={styles.cardDate}>{formatDate(user.createdAt)}</span>
        </div>
        <div className={styles.cardSubject}>{user.subject}</div>
        <div className={styles.cardPreview}>{user.message.substring(0, 100)}...</div>
        <div className={styles.cardActions}>
          <button
            onClick={() => viewUser(user)}
            className={styles.viewButton}
          >
            View Full Message
          </button>
          <button
            onClick={() => deleteUser(user._id)}
            className={styles.deleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.adminContainer}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={styles.header}>
        <h1>Message Dashboard</h1>
        <div className={styles.headerControls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
          <button
            onClick={toggleViewMode}
            className={styles.viewToggleButton}
          >
            {viewMode === 'table' ? 'Card View' : 'Table View'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading messages...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchUsers} className={styles.retryButton}>
            Retry
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th onClick={() => requestSort('name')}>
                      From {sortConfig.key === 'name' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th onClick={() => requestSort('subject')}>
                      Subject {sortConfig.key === 'subject' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th onClick={() => requestSort('createdAt')}>
                      Date {sortConfig.key === 'createdAt' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th>Message Preview</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td>
                          <div>{user.name}</div>
                          <div className={styles.emailSmall}>{user.email}</div>
                        </td>
                        <td className={styles.subjectCell}>{user.subject}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td className={styles.messagePreview}>{user.message.substring(0, 50)}...</td>
                        <td className={styles.actions}>
                          <button
                            onClick={() => viewUser(user)}
                            className={styles.viewButton}
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className={styles.noData}>
                        {searchTerm ? 'No matching messages found' : 'No messages yet. When users submit the contact form, their messages will appear here.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.cardsContainer}>
              {renderUserCards()}
            </div>
          )}

          <div className={styles.stats}>
            <p>Total Messages: <strong>{users.length}</strong></p>
            <p>Showing: <strong>{filteredUsers.length}</strong></p>
          </div>
        </>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Message Details</h2>
              <button onClick={closeModal} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.userDetail}>
                <span className={styles.label}>From:</span>
                <span className={styles.value}>{selectedUser.name}</span>
              </div>
              <div className={styles.userDetail}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{selectedUser.email}</span>
              </div>
              <div className={styles.userDetail}>
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>{selectedUser.phone}</span>
              </div>
              <div className={styles.userDetail}>
                <span className={styles.label}>Subject:</span>
                <span className={styles.value}>{selectedUser.subject}</span>
              </div>
              <div className={styles.userDetail}>
                <span className={styles.label}>Date:</span>
                <span className={styles.value}>{formatDate(selectedUser.createdAt)}</span>
              </div>
              <div className={styles.userDetail}>
                <span className={styles.label}>Verified:</span>
                <span className={styles.value}>{selectedUser.isVerified ? 'Yes' : 'No'}</span>
              </div>
              <div className={styles.messageContainer}>
                <span className={styles.label}>Message:</span>
                <p className={styles.message}>{selectedUser.message}</p>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => deleteUser(selectedUser._id)}
                className={styles.deleteButton}
              >
                Delete Message
              </button>
              <button
                onClick={closeModal}
                className={styles.closeModalButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 