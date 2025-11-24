# Feelize Website Setup Guide

This guide will help you set up the Feelize website project for local development.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Firebase Project (for authentication)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Feelize-dev/Feelize-website.git
cd Feelize-website
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

#### Configure Backend Environment Variables

The `.env` file has been created with placeholder values. You need to update it with your actual credentials:

**Required Configuration:**

1. **MongoDB**: Update `MONGO_DB_CONNECTION_STRING` with your MongoDB connection string
   ```
   MONGO_DB_CONNECTION_STRING=mongodb://localhost:27017/feelize
   ```
   Or use MongoDB Atlas:
   ```
   MONGO_DB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/feelize
   ```

2. **Firebase Admin SDK**: Get credentials from [Firebase Console](https://console.firebase.google.com/)
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Update these values in `.env`:
     ```
     FIREBASE_PROJECT_ID=your-actual-project-id
     FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Actual-Key-Here\n-----END PRIVATE KEY-----\n"
     ```

3. **CORS Configuration** (already set for local development):
   ```
   DEVELOPMENT_CLIENT_URL=http://localhost:5174
   ```

#### Start the Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd feelize-ai
npm install
```

#### Configure Frontend Environment Variables

The `.env` file has been created with placeholder values. You need to update it with your Firebase Web App credentials:

**Required Configuration:**

1. **Firebase Web App Configuration**: Get credentials from [Firebase Console](https://console.firebase.google.com/)
   - Go to Project Settings → General → Your apps
   - Select or create a Web app
   - Copy the configuration values and update `.env`:
     ```
     VITE_SERVER_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     VITE_SERVER_AUTH_DOMAIN=your-project.firebaseapp.com
     VITE_SERVER_PROJECT_ID=your-project-id
     VITE_SERVER_STORAGE_BUCKET=your-project.appspot.com
     VITE_SERVER_MESSAGING_CENTER_ID=123456789012
     VITE_SERVER_APP_ID=1:123456789012:web:abcdef1234567890
     ```

2. **Backend API Endpoint** (already set for local development):
   ```
   VITE_SERVER_API_ENDPOINT=http://localhost:3000
   ```

#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5174`

### 4. Testing CORS Configuration (Optional)

Once the backend is running, you can test the CORS configuration:

```bash
cd Backend
chmod +x test-cors.sh  # Make executable (first time only)
./test-cors.sh          # Run the tests
```

This will verify that CORS is properly configured and working.

## Troubleshooting

### CORS Errors

If you see CORS errors like:
```
Access to XMLHttpRequest at 'http://localhost:3000/api/users/verify' from origin 'http://localhost:5174' 
has been blocked by CORS policy
```

**Solution:**
1. Ensure the backend `.env` file has `DEVELOPMENT_CLIENT_URL=http://localhost:5174`
2. Ensure `ENVIRONMENT=Development` in the backend `.env`
3. Restart the backend server

### Firebase API Key Errors

If you see errors like:
```
Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

**Solution:**
1. Verify you've copied the correct Firebase Web App API key to `VITE_SERVER_API_KEY`
2. Make sure the API key is from the Firebase Web App configuration (not Admin SDK)
3. Check that your Firebase project is active and the API key hasn't been restricted
4. Restart the frontend development server after updating `.env`

### MongoDB Connection Errors

If you see MongoDB connection errors:

**Solution:**
1. Ensure MongoDB is running locally: `mongod`
2. Or use MongoDB Atlas and update the connection string
3. Check that the connection string format is correct

## Environment Files Reference

### Backend `.env` Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `ENVIRONMENT` | Development or Production | Yes |
| `MONGO_DB_CONNECTION_STRING` | MongoDB connection string | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | Yes |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | Yes |
| `DEVELOPMENT_CLIENT_URL` | Frontend URL for CORS (dev) | Yes |
| `PRODUCTION_CLIENT_URL` | Frontend URL for CORS (prod) | No |

### Frontend `.env` Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SERVER_API_ENDPOINT` | Backend API URL | Yes |
| `VITE_SERVER_API_KEY` | Firebase Web API key | Yes |
| `VITE_SERVER_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_SERVER_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_SERVER_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_SERVER_MESSAGING_CENTER_ID` | Firebase messaging sender ID | Yes |
| `VITE_SERVER_APP_ID` | Firebase app ID | Yes |

## Additional Resources

- [Firebase Setup Guide](https://ariangarshi.medium.com/how-to-use-firebase-for-google-authentication-in-a-react-js-in-2022-78171a235404)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas/register)
- [Backend README](./Backend/README.md)

## Support

If you encounter any issues not covered in this guide, please:
1. Check that all environment variables are correctly set
2. Ensure all services (MongoDB, Backend, Frontend) are running
3. Check the console logs for specific error messages
4. Review the Firebase Console for any API key restrictions or quota issues
