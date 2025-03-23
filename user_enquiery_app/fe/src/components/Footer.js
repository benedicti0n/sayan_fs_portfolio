import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <StyledFooter>
      <div className="container">
        <div className="copyright">
          &copy; {currentYear} User Enquiry App. All rights reserved.
        </div>
      </div>
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  width: 100%;
  background: transparent;
  color: white;
  padding: 20px 0;
  margin-top: auto;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .copyright {
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  }
  
  @media (max-width: 480px) {
    padding: 15px 0;
    
    .copyright {
      font-size: 12px;
    }
  }
`;

export default Footer; 