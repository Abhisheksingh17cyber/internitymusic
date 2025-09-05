# MusicStream Pro

A premium music streaming and download platform with secure UPI payment integration. Built with React frontend and Node.js backend.

## 🎵 Features

- **High-Quality Music Streaming**: Stream music in multiple quality formats
- **Secure Downloads**: Download purchased music with multiple quality options
- **UPI Payment Integration**: Secure payments using UPI with QR code support
- **Google OAuth**: Easy sign-in with Google authentication
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Streaming**: Efficient audio streaming with seek support
- **User Management**: Profile management and purchase history
- **Admin Panel**: Music upload and management features

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google OAuth 2.0** for social login
- **Multer** for file uploads
- **FFmpeg** for audio processing
- **QR Code** generation for UPI payments

### Frontend
- **React 18** with hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Heroicons** for icons
- **Axios** for API calls
- **Google OAuth** integration

### DevOps & Deployment
- **Docker** containerization
- **Nginx** reverse proxy
- **GitHub Actions** CI/CD
- **PM2** process management

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- FFmpeg (for audio processing)
- Google OAuth credentials
- UPI payment gateway credentials (optional)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/musicstream-pro.git
cd musicstream-pro
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your configurations

# Create uploads directory
mkdir -p uploads/music/original uploads/music/compressed uploads/artwork

# Start MongoDB service (if running locally)
# mongod

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your configurations

# Start development server
npm start
```

### 4. Environment Configuration

#### Backend (.env)
```bash
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/musicstream

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# UPI Payment (Replace with actual values)
UPI_MERCHANT_ID=your_merchant_upi_id
UPI_RECEIVER_VPA=merchant@upi
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_APP_NAME=MusicStream Pro
REACT_APP_VERSION=1.0.0
```

## 🐳 Docker Setup

### Development with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up -d

# With nginx proxy
docker-compose -f docker-compose.yml -f docker-compose.nginx.yml up -d
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Music Endpoints
- `GET /api/music` - Get all music (with search, pagination)
- `GET /api/music/:id` - Get single music track
- `GET /api/music/:id/stream` - Stream music file
- `POST /api/music/upload` - Upload new music (admin only)

### Payment Endpoints
- `POST /api/payments/create` - Create payment intent
- `GET /api/payments/:transactionId/status` - Check payment status
- `GET /api/payments/history` - Get payment history

## 🔒 Security Features

- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **JWT token** authentication
- **CORS** configuration
- **File upload** validation
- **Payment webhook** verification

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers
- Mobile browsers (iOS Safari, Android Chrome)
- Progressive Web App (PWA) ready

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
npm run test:watch
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

## 🚀 Deployment Options

### 1. Traditional Server (PM2)
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start ecosystem.config.js

# Monitor processes
pm2 monit

# View logs
pm2 logs
```

### 2. Docker Deployment
```bash
# Build production images
docker build -t musicstream-backend ./backend
docker build -t musicstream-frontend ./frontend

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Cloud Platforms
- **AWS**: EC2, ECS, or Elastic Beanstalk
- **Google Cloud**: App Engine or Cloud Run
- **Heroku**: With MongoDB Atlas
- **DigitalOcean**: App Platform or Droplets

## 📊 Monitoring

### Health Checks
- Backend: `GET /api/health`
- Automated monitoring script: `scripts/monitor.js`

### Logging
- Application logs via Morgan
- PM2 process logs
- Docker container logs

## 🔧 Development

### Code Style
- ESLint for JavaScript linting
- Prettier for code formatting
- Husky for pre-commit hooks

### Git Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and queries:
- Email: support@musicstreampro.com
- Create an issue on GitHub
- Join our Discord community

## 🙏 Acknowledgments

- **React** team for the amazing framework
- **Node.js** community for excellent ecosystem
- **MongoDB** for flexible database solution
- **Tailwind CSS** for utility-first CSS framework
- All open source contributors

---

**Made with ❤️ in India**
