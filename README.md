# Daring Achievers Network - Complete Platform

A production-ready web application for Mwatha Njoroge's book sales platform with M-Pesa STK Push integration and WhatsApp e-book delivery.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- M-Pesa Developer Account (Safaricom)
- WhatsApp API Account (UltraMsg, Twilio, or Chat-API)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd daring-achievers-network
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

3. **Environment Setup**
```bash
# Frontend environment
cp .env.example .env
# Edit .env with your frontend configuration

# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your backend configuration
```

4. **Database Setup**
```bash
cd backend
npm run setup
cd ..
```

5. **Start Development Servers**
```bash
# Start backend (from backend directory)
cd backend
npm run dev

# Start frontend (from root directory)
cd ..
npm run dev
```

## 📋 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/daring_achievers

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here
DOWNLOAD_TOKEN_SECRET=your-download-token-secret-here

# M-Pesa Configuration
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_BUSINESS_SHORTCODE=174379
MPESA_PASSKEY=your-mpesa-passkey
MPESA_CALLBACK_URL=https://your-domain.com/api/payments/callback

# WhatsApp API Configuration
WHATSAPP_API_URL=https://api.ultramsg.com
WHATSAPP_INSTANCE_ID=your-instance-id
WHATSAPP_TOKEN=your-whatsapp-token

# Contact Information
CONTACT_EMAIL=mwathanjoroge@gmail.com
CONTACT_PHONE=254786780780
CONTACT_WHATSAPP=254717003322
```

## 🔧 Configuration Guide

### 1. M-Pesa Setup
1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create a new app and get your Consumer Key and Secret
3. For sandbox testing, use:
   - Business Shortcode: `174379`
   - Passkey: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`
4. Set up your callback URL (must be publicly accessible)

### 2. WhatsApp API Setup

#### Option A: UltraMsg (Recommended)
1. Visit [UltraMsg](https://ultramsg.com/)
2. Create an account and get your Instance ID and Token
3. Connect your WhatsApp number

#### Option B: Twilio WhatsApp API
1. Create a [Twilio account](https://www.twilio.com/)
2. Set up WhatsApp Business API
3. Get your Account SID and Auth Token

### 3. MongoDB Setup

#### Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

#### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Replace in MONGODB_URI

### 4. Email Configuration (Optional)
For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate an app password
3. Use app password in SMTP_PASS

## 🧪 Testing

### Default Admin Credentials
- **Email**: admin@daringachievers.com
- **Password**: admin123

### Test Phone Numbers (Sandbox)
- Success: 254708374149
- Failed: 254708374150
- Invalid: 254708374151

### API Testing
Import the Postman collection from `backend/postman/Daring_Achievers_API.postman_collection.json`

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend:
```bash
npm run build
```
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`

### Backend Deployment (Railway/Render/Heroku)
1. Set all environment variables in your hosting platform
2. Ensure MongoDB is accessible
3. Set `NODE_ENV=production`
4. Update `FRONTEND_URL` to your frontend domain
5. Update `MPESA_CALLBACK_URL` to your backend domain

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/daring_achievers
FRONTEND_URL=https://your-frontend-domain.com
MPESA_ENVIRONMENT=production
MPESA_CALLBACK_URL=https://your-backend-domain.com/api/payments/callback
```

## 📁 Project Structure

```
daring-achievers-network/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── ...
├── backend/               # Backend source code
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── scripts/           # Database scripts
│   └── postman/           # API testing
└── ...
```

## 🔒 Security Features

- JWT authentication with role-based access
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure file uploads
- Token-based download URLs with expiration
- Environment variable protection

## 📞 Support

For technical support:
- **Email**: mwathanjoroge@gmail.com
- **Phone**: +254 786 780 780
- **WhatsApp**: +254 717 003 322

## 📄 License

© 2024 Daring Achievers Network. All rights reserved.