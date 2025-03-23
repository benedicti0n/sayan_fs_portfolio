import React, { useState } from 'react';
import styled from 'styled-components';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Use the same IP address as the frontend
  const API_URL = "https://sayan-fs-portfolio.onrender.com"

  const handleAgreementClick = (e) => {
    e.preventDefault();
    console.log('License agreement clicked');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="heading">Enquiry</div>
        {success && (
          <div className="success-message">
            Your enquiry has been submitted successfully!
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="form">
          <input
            required
            className="input"
            type="text"
            name="name"
            id="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            required
            className="input"
            type="email"
            name="email"
            id="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
          />
          <textarea
            required
            className="input textarea"
            name="message"
            id="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        <span className="agreement">
          <a href="/license-agreement" onClick={handleAgreementClick}>Learn user licence agreement</a>
        </span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .container {
    max-width: 480px;
    width: 90%;
    background: #F8F9FD;
    background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
    border-radius: 40px;
    padding: 40px 50px;
    border: 5px solid rgb(255, 255, 255);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
    margin: 20px auto;
  }

  .heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(16, 137, 211);
  }

  .form {
    margin-top: 20px;
  }

  .form .input {
    width: 100%;
    background: white;
    border: none;
    padding: 15px 89px 15px 20px;
    border-radius: 20px;
    margin-top: 15px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    border-inline: 2px solid transparent;
    text-align: left;
  }

  .form .textarea {
    min-height: 120px;
    resize: vertical;
    font-family: inherit;
  }

  .form .input::-moz-placeholder {
    color: rgb(170, 170, 170);
  }

  .form .input::placeholder {
    color: rgb(170, 170, 170);
    text-align: left;
    padding-left: 0;
  }

  .form .input:focus {
    outline: none;
    border-inline: 2px solid #12B1D1;
  }

  .login-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
    color: white;
    padding-block: 15px;
    margin: 20px auto;
    border-radius: 20px;
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .login-button:hover {
    transform: scale(1.03);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
  }

  .login-button:active {
    transform: scale(0.95);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
  }

  .login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .success-message {
    background-color: rgba(76, 175, 80, 0.1);
    color: #2e7d32;
    padding: 12px 15px;
    border-radius: 8px;
    margin-top: 15px;
    border-left: 4px solid #4caf50;
    font-size: 14px;
  }

  .error-message {
    background-color: rgba(244, 67, 54, 0.1);
    color: #d32f2f;
    padding: 12px 15px;
    border-radius: 8px;
    margin-top: 15px;
    border-left: 4px solid #f44336;
    font-size: 14px;
  }

  .agreement {
    display: block;
    text-align: center;
    margin-top: 25px;
  }

  .agreement a {
    text-decoration: none;
    color: #0099ff;
    font-size: 9px;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .container {
      max-width: 450px;
      width: 92%;
      padding: 35px 40px;
    }
  }

  @media (max-width: 480px) {
    .container {
      max-width: 100%;
      width: 95%;
      padding: 25px 30px;
      border-radius: 30px;
      margin: 10px auto;
    }
    
    .heading {
      font-size: 24px;
    }
    
    .form .input {
      padding: 12px 66px 12px 20px;
    }
  }
  
  @media (max-width: 350px) {
    .container {
      padding: 15px 20px;
      border-width: 4px;
    }
    
    .heading {
      font-size: 22px;
    }
    
    .form .input {
      padding: 10px 51px 10px 15px;
      margin-top: 12px;
    }
    
    .login-button {
      padding-block: 12px;
    }
  }
`;

export default Form; 