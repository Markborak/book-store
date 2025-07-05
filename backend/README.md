# Daring Achievers Network - Backend API

Production-ready backend for Mwatha Njoroge's book sales platform with M-Pesa STK Push integration and WhatsApp e-book delivery.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- M-Pesa Developer Account (Safaricom)
- WhatsApp API Account (UltraMsg, Twilio, or Chat-API)

### Installation & Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd backend
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database Setup**
```bash
# Create admin user and seed sample books
npm run setup
```

4. **Start Development Server**
```bash
npm run dev
```

## 📋 Environment Variables

Create a `.env` file with the following variables:

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

# Email Configuration
EMAIL_FROM=mwathanjoroge@gmail.com
EMAIL_FROM_NAME=Mwatha Njoroge - Daring Achievers Network
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# Contact Information
CONTACT_EMAIL=mwathanjoroge@gmail.com
CONTACT_PHONE=254786780780
CONTACT_WHATSAPP=254717003322
```

## 🔧 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run test:watch # Run tests in watch mode
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
npm run seed:admin # Create admin user
npm run seed:books # Seed sample books
npm run seed:all   # Create admin and seed books
npm run setup      # Install dependencies and setup database
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a Bearer token:
```
Authorization: Bearer <jwt-token>
```

### Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `PUT /auth/password` - Change password

#### Books
- `GET /books` - Get all active books
- `GET /books/:id` - Get single book
- `GET /books/meta/categories` - Get book categories
- `GET /books/featured/list` - Get featured books
- `GET /books/meta/stats` - Get book statistics

#### Payments
- `POST /payments/initiate` - Initiate M-Pesa payment
- `POST /payments/callback` - M-Pesa callback handler
- `GET /payments/status/:transactionId` - Check payment status
- `POST /payments/retry-delivery/:transactionId` - Retry WhatsApp delivery

#### Admin (Protected)
- `GET /admin/dashboard/stats` - Dashboard statistics
- `GET /admin/books` - Get all books (including inactive)
- `POST /admin/books` - Create new book
- `PUT /admin/books/:id` - Update book
- `DELETE /admin/books/:id` - Delete book
- `GET /admin/purchases` - Get purchase logs
- `POST /admin/purchases/:id/resend` - Resend e-book

#### Downloads
- `GET /downloads/:token` - Download e-book with token
- `GET /downloads/:token/info` - Get download information

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Postman Collection
Import the Postman collection from `postman/Daring_Achievers_API.postman_collection.json` for comprehensive API testing.

### Test Data
- **Admin Login**: admin@daringachievers.com / admin123
- **Test Phone Numbers (Sandbox)**:
  - 254708374149 (Success)
  - 254708374150 (Failed)
  - 254708374151 (Invalid)

## 💳 M-Pesa Integration

### Sandbox Credentials
```
Business Shortcode: 174379
Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
```

### Payment Flow
1. Customer initiates payment via `/payments/initiate`
2. STK Push sent to customer's phone
3. Customer enters M-Pesa PIN
4. Payment processed by Safaricom
5. Callback received at `/payments/callback`
6. E-book delivered via WhatsApp if successful

## 📱 WhatsApp Integration

### Supported Services
- **UltraMsg**: Recommended for ease of use
- **Twilio WhatsApp API**: Enterprise-grade
- **Chat-API**: Alternative option

### Message Format
The system sends a formatted message with:
- Thank you note
- Book details
- Download link
- Important instructions
- Contact information

## 🔒 Security Features

- JWT authentication with role-based access
- Rate limiting (general and payment-specific)
- Input validation and sanitization
- Secure file uploads with validation
- Token-based download URLs (24-hour expiry)
- Comprehensive error handling and logging

## 📊 Admin Features

- Dashboard with sales analytics
- Book management (CRUD operations)
- Purchase log monitoring
- Manual e-book resend functionality
- User management
- Revenue tracking

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up production M-Pesa credentials
4. Configure WhatsApp API for production
5. Set secure JWT secrets

### Recommended Hosting
- **Railway**: Easy deployment with MongoDB
- **Render**: Free tier available
- **Heroku**: Established platform
- **VPS**: Full control and customization

### Post-Deployment Checklist
- [ ] Test payment flow in production
- [ ] Verify WhatsApp delivery
- [ ] Check callback URL accessibility
- [ ] Monitor logs for errors
- [ ] Set up monitoring and alerts

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── validators/      # Input validation
├── scripts/             # Database seeding scripts
├── tests/               # Test files
├── postman/             # Postman collection
├── uploads/             # File uploads (created automatically)
└── logs/                # Log files (created automatically)
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB URI in .env
   - Ensure MongoDB is running
   - Check network connectivity

2. **M-Pesa STK Push Failed**
   - Verify M-Pesa credentials
   - Check callback URL accessibility
   - Ensure phone number format is correct

3. **WhatsApp Delivery Failed**
   - Verify WhatsApp API credentials
   - Check instance status
   - Ensure phone number is WhatsApp-enabled

4. **File Upload Issues**
   - Check file size limits (50MB)
   - Verify file types (PDF, EPUB for books; images for covers)
   - Ensure upload directories exist

## 📞 Support

For technical support or questions:
- **Email**: mwathanjoroge@gmail.com
- **Phone**: +254 786 780 780
- **WhatsApp**: +254 717 003 322

## 📄 License

© 2024 Daring Achievers Network. All rights reserved.