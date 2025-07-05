# Deployment Guide - Daring Achievers Network

This guide covers deploying the complete Daring Achievers Network platform to production.

## 🚀 Deployment Options

### Recommended Stack
- **Frontend**: Netlify or Vercel
- **Backend**: Railway or Render
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary (optional)

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup
Ensure all required environment variables are configured:

#### Frontend
- `VITE_API_URL`: Your backend API URL

#### Backend
- `NODE_ENV`: Set to "production"
- `MONGODB_URI`: Production MongoDB connection string
- `FRONTEND_URL`: Your frontend domain
- `JWT_SECRET`: Strong, unique secret
- `DOWNLOAD_TOKEN_SECRET`: Strong, unique secret
- `MPESA_*`: Production M-Pesa credentials
- `WHATSAPP_*`: Production WhatsApp API credentials
- `MPESA_CALLBACK_URL`: Your backend domain + /api/payments/callback

### 2. M-Pesa Production Setup
1. Apply for M-Pesa production credentials
2. Get your production Business Shortcode
3. Generate production Passkey
4. Update callback URL to production domain
5. Test with small amounts first

### 3. WhatsApp API Production
1. Upgrade to production WhatsApp API plan
2. Verify business account
3. Update API endpoints to production
4. Test message delivery

## 🌐 Frontend Deployment

### Option A: Netlify
1. **Build the project**:
```bash
npm run build
```

2. **Deploy to Netlify**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

3. **Set environment variables** in Netlify dashboard:
   - `VITE_API_URL=https://your-backend-domain.com/api`

### Option B: Vercel
1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Set environment variables** in Vercel dashboard:
   - `VITE_API_URL=https://your-backend-domain.com/api`

## 🖥️ Backend Deployment

### Option A: Railway
1. **Create Railway account** at [railway.app](https://railway.app)

2. **Connect GitHub repository**

3. **Set environment variables** in Railway dashboard:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/daring_achievers
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your-production-jwt-secret
DOWNLOAD_TOKEN_SECRET=your-production-download-secret
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=your-production-consumer-key
MPESA_CONSUMER_SECRET=your-production-consumer-secret
MPESA_BUSINESS_SHORTCODE=your-production-shortcode
MPESA_PASSKEY=your-production-passkey
MPESA_CALLBACK_URL=https://your-backend-domain.com/api/payments/callback
WHATSAPP_API_URL=https://api.ultramsg.com
WHATSAPP_INSTANCE_ID=your-production-instance-id
WHATSAPP_TOKEN=your-production-token
CONTACT_EMAIL=mwathanjoroge@gmail.com
CONTACT_PHONE=254786780780
CONTACT_WHATSAPP=254717003322
```

4. **Deploy** - Railway will automatically deploy from your repository

### Option B: Render
1. **Create Render account** at [render.com](https://render.com)

2. **Create new Web Service**

3. **Connect GitHub repository**

4. **Configure build settings**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`

5. **Set environment variables** (same as Railway above)

## 🗄️ Database Setup

### MongoDB Atlas
1. **Create cluster** at [MongoDB Atlas](https://www.mongodb.com/atlas)

2. **Configure network access**:
   - Add your deployment platform's IP ranges
   - Or allow access from anywhere (0.0.0.0/0) for simplicity

3. **Create database user**

4. **Get connection string**:
```
mongodb+srv://username:password@cluster.mongodb.net/daring_achievers
```

5. **Seed production data**:
```bash
# Connect to your deployed backend and run:
npm run seed:admin
npm run seed:books
```

## 🔧 Post-Deployment Configuration

### 1. Test Payment Flow
1. Use small test amounts (KES 1-10)
2. Verify STK Push works
3. Check callback URL receives data
4. Confirm WhatsApp delivery

### 2. Test Admin Functions
1. Login with admin credentials
2. Upload a test book
3. Check purchase logs
4. Test manual e-book resend

### 3. Monitor Logs
- Check application logs for errors
- Monitor payment callback logs
- Watch WhatsApp delivery status

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use strong, unique secrets
- Rotate secrets regularly

### 2. Database Security
- Use strong database passwords
- Enable MongoDB authentication
- Restrict network access

### 3. API Security
- Enable CORS for your frontend domain only
- Monitor for unusual API usage
- Set up rate limiting

### 4. File Security
- Validate file uploads
- Set file size limits
- Use secure file storage

## 📊 Monitoring & Maintenance

### 1. Application Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track payment success rates

### 2. Database Monitoring
- Monitor database performance
- Set up automated backups
- Track storage usage

### 3. Regular Maintenance
- Update dependencies regularly
- Monitor security advisories
- Review and rotate API keys

## 🚨 Troubleshooting

### Common Issues

#### 1. M-Pesa Callback Not Working
- Ensure callback URL is publicly accessible
- Check firewall settings
- Verify HTTPS is enabled
- Test callback URL manually

#### 2. WhatsApp Delivery Failing
- Check API credentials
- Verify phone number format
- Ensure WhatsApp instance is active
- Check API rate limits

#### 3. File Upload Issues
- Check file size limits
- Verify upload directory permissions
- Ensure sufficient disk space
- Check file type validation

#### 4. Database Connection Issues
- Verify connection string
- Check network access rules
- Ensure database user has correct permissions
- Monitor connection pool usage

## 📞 Support

For deployment assistance:
- **Email**: mwathanjoroge@gmail.com
- **Phone**: +254 786 780 780
- **WhatsApp**: +254 717 003 322

## 🎯 Success Metrics

After deployment, monitor:
- Payment success rate (target: >95%)
- WhatsApp delivery rate (target: >98%)
- Page load times (target: <3 seconds)
- API response times (target: <500ms)
- Uptime (target: >99.9%)