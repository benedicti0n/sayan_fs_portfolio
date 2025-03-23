import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AdminPanel = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/enquiries');
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }
      
      // Update local state
      setEnquiries(enquiries.map(e => 
        e._id === id ? { ...e, status: newStatus } : e
      ));
      
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
      
    } catch (err) {
      setError('Error updating status: ' + err.message);
      console.error(err);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/enquiries/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete enquiry');
      }
      
      // Update local state
      setEnquiries(enquiries.filter(e => e._id !== id));
      
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry(null);
      }
      
    } catch (err) {
      setError('Error deleting enquiry: ' + err.message);
      console.error(err);
    }
  };

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setStatus(enquiry.status);
  };

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

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'new': return '#ff9800';
      case 'in-progress': return '#2196f3';
      case 'resolved': return '#4caf50';
      default: return '#757575';
    }
  };

  if (loading && enquiries.length === 0) {
    return (
      <AdminContainer>
        <h2>Admin Panel</h2>
        <LoadingMessage>Loading enquiries...</LoadingMessage>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <h2>Admin Panel</h2>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <RefreshButton onClick={fetchEnquiries}>
        Refresh Enquiries
      </RefreshButton>
      
      <PanelContent>
        <EnquiryList>
          <h3>Enquiries ({enquiries.length})</h3>
          
          {enquiries.length === 0 ? (
            <EmptyMessage>No enquiries found</EmptyMessage>
          ) : (
            <ListContainer>
              {enquiries.map(enquiry => (
                <EnquiryItem 
                  key={enquiry._id}
                  onClick={() => handleViewDetails(enquiry)}
                  selected={selectedEnquiry && selectedEnquiry._id === enquiry._id}
                >
                  <div>
                    <h4>{enquiry.name}</h4>
                    <p>{enquiry.email}</p>
                    <small>{formatDate(enquiry.createdAt)}</small>
                  </div>
                  <StatusBadge color={getStatusBadgeColor(enquiry.status)}>
                    {enquiry.status}
                  </StatusBadge>
                </EnquiryItem>
              ))}
            </ListContainer>
          )}
        </EnquiryList>
        
        {selectedEnquiry && (
          <EnquiryDetail>
            <h3>Enquiry Details</h3>
            <DetailContent>
              <DetailRow>
                <DetailLabel>Name:</DetailLabel>
                <DetailValue>{selectedEnquiry.name}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Email:</DetailLabel>
                <DetailValue>{selectedEnquiry.email}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Status:</DetailLabel>
                <DetailValue>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <UpdateButton 
                    onClick={() => handleStatusChange(selectedEnquiry._id, status)}
                    disabled={status === selectedEnquiry.status}
                  >
                    Update
                  </UpdateButton>
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Created:</DetailLabel>
                <DetailValue>{formatDate(selectedEnquiry.createdAt)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Message:</DetailLabel>
                <MessageValue>{selectedEnquiry.message}</MessageValue>
              </DetailRow>
              <DeleteButton 
                onClick={() => handleDeleteEnquiry(selectedEnquiry._id)}
              >
                Delete Enquiry
              </DeleteButton>
            </DetailContent>
          </EnquiryDetail>
        )}
      </PanelContent>
    </AdminContainer>
  );
};

const AdminContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  position: relative;
  
  h2 {
    color: #1089d3;
    margin-top: 0;
    border-bottom: 2px solid #f0f2f5;
    padding-bottom: 15px;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background-color: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #f44336;
`;

const RefreshButton = styled.button`
  background-color: #12B1D1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0e95b1;
  }
`;

const PanelContent = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EnquiryList = styled.div`
  flex: 1;
  
  h3 {
    color: #666;
    margin-top: 0;
  }
`;

const EmptyMessage = styled.div`
  padding: 30px;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 5px;
`;

const ListContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
`;

const EnquiryItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
  background-color: ${props => props.selected ? '#f0f7ff' : 'white'};
  
  &:hover {
    background-color: ${props => props.selected ? '#f0f7ff' : '#f5f5f5'};
  }
  
  h4 {
    margin: 0 0 5px 0;
    color: #333;
  }
  
  p {
    margin: 0 0 5px 0;
    color: #666;
    font-size: 14px;
  }
  
  small {
    color: #999;
    font-size: 12px;
  }
`;

const StatusBadge = styled.span`
  background-color: ${props => props.color};
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
`;

const EnquiryDetail = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 20px;
  
  h3 {
    color: #666;
    margin-top: 0;
    margin-bottom: 20px;
  }
`;

const DetailContent = styled.div`
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DetailRow = styled.div`
  margin-bottom: 15px;
  display: flex;
  
  &:last-child {
    margin-bottom: 20px;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const DetailLabel = styled.div`
  font-weight: bold;
  color: #666;
  width: 100px;
  flex-shrink: 0;
`;

const DetailValue = styled.div`
  flex: 1;
  
  select {
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    margin-right: 10px;
  }
`;

const MessageValue = styled.div`
  flex: 1;
  white-space: pre-wrap;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  margin-top: 5px;
`;

const UpdateButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  margin-top: 10px;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

export default AdminPanel; 