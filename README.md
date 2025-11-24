# Feelize Website

A modern web application for project management and collaboration, built with React (Vite) frontend and Express.js backend.

## 🚀 Quick Start

**Want to get started in 5 minutes?** → [QUICK-START.md](./QUICK-START.md)

**Need detailed setup instructions?** → [SETUP.md](./SETUP.md)

## 📁 Project Structure

```
Feelize-website/
├── Backend/              # Express.js backend server
│   ├── config/          # Database and Firebase configuration
│   ├── controller/      # Request handlers
│   ├── middleware/      # Auth and validation middleware
│   ├── model/          # MongoDB data models
│   ├── routes/         # API route definitions
│   └── services/       # Business logic
│
├── feelize-ai/          # React (Vite) frontend application
│   ├── src/
│   │   ├── api/        # API client functions
│   │   ├── components/ # React components
│   │   ├── config/     # Firebase config
│   │   ├── hooks/      # Custom React hooks
│   │   └── pages/      # Page components
│   └── public/         # Static assets
│
└── Documentation/       # Setup and solution guides
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: TanStack Query
- **Routing**: React Router v7
- **Authentication**: Firebase Auth
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Firebase Admin SDK
- **Email**: Nodemailer
- **AI Integration**: Google Gemini

## 📖 Documentation

### Getting Started
- **[QUICK-START.md](./QUICK-START.md)** - Get running in 5 minutes
- **[SETUP.md](./SETUP.md)** - Comprehensive setup guide with troubleshooting

### Technical Documentation
- **[SOLUTION-OVERVIEW.md](./SOLUTION-OVERVIEW.md)** - Architecture and solution overview
- **[CORS-FIREBASE-FIX-SUMMARY.md](./CORS-FIREBASE-FIX-SUMMARY.md)** - CORS and Firebase configuration details
- **[Backend/README.md](./Backend/README.md)** - Backend-specific documentation

## ⚙️ Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Firebase Project (for authentication)

## 🔧 Configuration

The application requires environment configuration for both frontend and backend:

### Backend Environment (`Backend/.env`)
- MongoDB connection string
- Firebase Admin SDK credentials
- CORS configuration
- Email service credentials (optional)
- Gemini AI API key (optional)

### Frontend Environment (`feelize-ai/.env`)
- Backend API endpoint
- Firebase Web App credentials

See [SETUP.md](./SETUP.md) for detailed configuration instructions.

## 🚦 Running the Application

### Development Mode

**Backend:**
```bash
cd Backend
npm install
npm run dev
# Runs on http://localhost:3000
```

**Frontend:**
```bash
cd feelize-ai
npm install
npm run dev
# Runs on http://localhost:5174
```

### Production Mode

**Backend:**
```bash
cd Backend
npm install
npm start
```

**Frontend:**
```bash
cd feelize-ai
npm install
npm run build
npm run preview
```

## 🧪 Testing

### Test CORS Configuration
```bash
cd Backend
chmod +x test-cors.sh
./test-cors.sh
```

### Linting
```bash
# Frontend
cd feelize-ai
npm run lint
```

## 🔒 Security

- Environment variables properly gitignored
- Firebase credentials required for authentication
- CORS properly configured for cross-origin requests
- Regular security scans with CodeQL

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure backend is running on port 3000
- Verify `DEVELOPMENT_CLIENT_URL=http://localhost:5174` in `Backend/.env`
- Check browser console for detailed error messages
- See [SETUP.md](./SETUP.md#cors-errors) for detailed troubleshooting

**Firebase Authentication Errors**
- Verify Firebase credentials are correct
- Ensure you're using Web App credentials for frontend
- Ensure you're using Admin SDK credentials for backend
- See [SETUP.md](./SETUP.md#firebase-errors) for detailed troubleshooting

**MongoDB Connection Errors**
- Ensure MongoDB is running: `mongod`
- Or configure MongoDB Atlas connection string
- Check connection string format
- See [SETUP.md](./SETUP.md#mongodb-errors) for detailed troubleshooting

## 📝 API Documentation

The backend exposes the following API endpoints:

- `GET /api/users/verify` - Verify user session
- `GET /api/users/sessionLogin` - Create user session
- `POST /api/users/logout` - Logout user
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- And more... (see Backend/routes for complete list)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

[Add your license here]

## 🆘 Support

- **Documentation**: Start with [QUICK-START.md](./QUICK-START.md)
- **Detailed Setup**: See [SETUP.md](./SETUP.md)
- **Technical Details**: See [SOLUTION-OVERVIEW.md](./SOLUTION-OVERVIEW.md)
- **Issues**: Open a GitHub issue

## ✨ Recent Updates

### CORS and Firebase Configuration (Latest)
- ✅ Fixed CORS policy blocking frontend requests
- ✅ Improved Firebase initialization with graceful degradation
- ✅ Added comprehensive documentation and setup guides
- ✅ Created automated CORS testing script
- ✅ Enhanced error messages and logging

See [CORS-FIREBASE-FIX-SUMMARY.md](./CORS-FIREBASE-FIX-SUMMARY.md) for complete details.

---

**Happy coding! 🎉**

For questions or issues, please refer to the documentation or open a GitHub issue.
