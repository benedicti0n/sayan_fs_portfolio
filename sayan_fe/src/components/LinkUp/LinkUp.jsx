import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './LinkUp.module.css'; // Import the CSS module

// API base URL - can be configured based on environment
// Default to absolute URL for local development if environment variable is not set
const API_BASE_URL = "https://sayan-fs-be.onrender.com/api";

// OTP expiration time in minutes
const OTP_EXPIRATION_MINUTES = 15;

const LinkupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiStatus, setApiStatus] = useState({ checked: false, available: true }); // Default to available for better UX
  const [otpTimer, setOtpTimer] = useState(OTP_EXPIRATION_MINUTES * 60); // Timer in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30); // 30 seconds countdown for resend

  // Check API availability on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Try to connect to the health endpoint
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          console.log('API is available');
          setApiStatus({ checked: true, available: true });
        } else {
          console.error('API health check failed');
          setApiStatus({ checked: true, available: false });
        }
      } catch (error) {
        console.error('API connection error:', error);
        setApiStatus({ checked: true, available: false });
      }
    };

    checkApiStatus();
  }, []);

  // OTP timer countdown effect
  useEffect(() => {
    let interval;
    if (timerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prevTime => prevTime - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      // OTP expired
      if (showOTP) {
        toast.error('OTP has expired. Please request a new one.');
        setShowOTP(false);
        resetForm();
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, otpTimer, showOTP]);

  // Resend countdown effect
  useEffect(() => {
    let interval;
    if (showOTP && !canResend && resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            setCanResend(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTP, canResend, resendCountdown]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};

    // Basic validation rules
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^0-9]/g, ''))) errors.phone = "Phone number is invalid";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Check if API is available
    if (!apiStatus.available) {
      toast.error("Server is not available. Please try again later.");
      return;
    }

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      console.log(`Submitting form to ${API_BASE_URL}/submit`);

      // Use the configured API URL
      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Check the status code to determine the type of response
      if (response.ok) {
        if (result.message === 'OTP_REQUIRED') {
          toast.success('OTP has been sent to your email address');
          setShowOTP(true);
          // Start the timer
          setOtpTimer(OTP_EXPIRATION_MINUTES * 60);
          setTimerActive(true);
          // Reset resend ability
          setCanResend(false);
          setResendCountdown(30);
        } else {
          toast.info(result.message || 'Form submitted');
        }
      } else {
        // Handle error responses with proper messages
        if (response.status === 400) {
          // This is likely a validation error
          toast.error(result.message || 'Please check your form data and try again.');
        } else if (response.status === 500) {
          toast.error(result.message || 'Server error. Please try again later.');
        } else {
          toast.error(result.message || 'An error occurred');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // This is a true connection error
      toast.error('Connection error. Please check your internet and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!apiStatus.available) {
      toast.error("Server is not available. Please try again later.");
      return;
    }

    if (!formData.otp.trim()) {
      toast.error('Please enter the OTP sent to your email');
      return;
    }

    setIsLoading(true);

    try {
      console.log(`Verifying OTP at ${API_BASE_URL}/verify`);

      // Use the configured API URL
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Check the status code to determine the type of response
      if (response.ok) {
        if (result.message === 'Data saved successfully.') {
          toast.success('Your message has been received. Thank you for contacting us!');
          setShowOTP(false);
          setTimerActive(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            otp: ''
          });
        } else {
          toast.info(result.message || 'Submission processed');
        }
      } else {
        // Handle error responses with proper messages
        if (response.status === 400) {
          // This is likely an invalid OTP
          toast.error(result.message || 'Invalid OTP. Please try again.');
        } else {
          toast.error(result.message || 'Server error. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // This is a true connection error
      toast.error('Connection error. Please check your internet and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setShowOTP(false);
    setIsLoading(false);
    setTimerActive(false);
    setCanResend(false);
    setResendCountdown(30);
  };

  const requestNewOTP = () => {
    if (!canResend) return;

    setShowOTP(false);
    setTimerActive(false);
    setCanResend(false);
    setResendCountdown(30);
    handleSubmit();
  };

  return (
    <div className={styles.styledWrapper}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

      <div className={styles.formCard1}>
        <div className={styles.formCard2}>
          {isLoading && (
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
            </div>
          )}

          {showOTP ? (
            <div className={styles.otpFormContainer}>
              <p className={styles.formHeading}>Enter OTP</p>
              <div className={styles.timerContainer}>
                <p>Time remaining: <span className={otpTimer < 60 ? styles.timerWarning : ''}>{formatTime(otpTimer)}</span></p>
              </div>
              <div className={styles.formField}>
                <input
                  required
                  placeholder="Enter OTP sent to your email"
                  name="otp"
                  className={styles.inputField}
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                />
              </div>
              <button
                onClick={handleVerifyOTP}
                className={styles.sendMessageBtn}
                disabled={isLoading}
              >
                Submit
              </button>
              <div className={styles.otpButtonsRow}>
                <button
                  onClick={resetForm}
                  className={`${styles.sendMessageBtn} ${styles.cancelBtn}`}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={requestNewOTP}
                  className={`${styles.sendMessageBtn} ${styles.resendBtn}`}
                  disabled={isLoading || !canResend}
                >
                  {canResend ? 'Resend OTP' : `Resend in ${resendCountdown}s`}
                </button>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <p className={styles.formHeading}>Get In Touch</p>
              <div className={styles.formField}>
                <input
                  required
                  placeholder="Name"
                  name="name"
                  className={`${styles.inputField} ${formErrors.name ? styles.inputError : ''}`}
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.name && <div className={styles.errorText}>{formErrors.name}</div>}
              </div>
              <div className={styles.formField}>
                <input
                  required
                  placeholder="Email"
                  name="email"
                  className={`${styles.inputField} ${formErrors.email ? styles.inputError : ''}`}
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.email && <div className={styles.errorText}>{formErrors.email}</div>}
              </div>
              <div className={styles.formField}>
                <input
                  required
                  placeholder="Phone"
                  name="phone"
                  className={`${styles.inputField} ${formErrors.phone ? styles.inputError : ''}`}
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.phone && <div className={styles.errorText}>{formErrors.phone}</div>}
              </div>
              <div className={styles.formField}>
                <input
                  required
                  placeholder="Subject"
                  name="subject"
                  className={`${styles.inputField} ${formErrors.subject ? styles.inputError : ''}`}
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.subject && <div className={styles.errorText}>{formErrors.subject}</div>}
              </div>
              <div className={styles.formField}>
                <textarea
                  required
                  placeholder="Message"
                  name="message"
                  cols={30}
                  rows={3}
                  className={`${styles.inputField} ${formErrors.message ? styles.inputError : ''}`}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.message && <div className={styles.errorText}>{formErrors.message}</div>}
              </div>
              <button
                type="submit"
                className={styles.sendMessageBtn}
                disabled={isLoading}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default LinkupForm;