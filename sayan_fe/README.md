# LinkUp Portfolio Contact Form

A contact form application with OTP verification for portfolio websites.

## Features

- Contact form with validation
- Email OTP verification
- Mobile-responsive design
- Persistent data storage
- Email notifications

## Local Development Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. The frontend will be available at http://localhost:3000

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd my_portfolio_backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (if not already done)
   - Update the MongoDB connection string and email credentials

4. Start the backend server:
   ```
   npm start
   ```

5. The backend API will be available at http://localhost:3002

## Testing on Mobile Devices

To test on mobile devices while in development:

1. Find your computer's local IP address (e.g., 192.168.1.100)
2. Update the frontend API URL:
   - Create a `.env` file in the root directory
   - Add `REACT_APP_API_URL=http://192.168.1.100:3002/api` (replace with your IP)
3. Update backend CORS settings in `server.js` to allow your IP
4. Access the frontend from your mobile device at http://192.168.1.100:3000

## Deployment Preparation

Before deploying to production:

1. Update MongoDB connection to use a cloud database (MongoDB Atlas recommended)
2. Set up proper email service credentials
3. Configure environment variables for production
4. Build the frontend:
   ```
   npm run build
   ```
5. Set NODE_ENV=production for the backend

## Security Notes

- The application uses file-based OTP storage for development
- For production, consider using Redis or a database for OTP storage
- Email credentials should be secured using environment variables
- CORS settings should be restricted to specific origins in production

## Troubleshooting

- If emails are not being sent, check your email service credentials
- If database connections fail, verify your MongoDB connection string
- For mobile testing issues, ensure your firewall allows connections on the required ports

## License

This project is licensed under the MIT License - see the LICENSE file for details.
