# Feelize Backend

This is the backend server for the Feelize application, built with Express.js, MongoDB, and Firebase Admin SDK.

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   See the [main SETUP.md](../SETUP.md) for detailed configuration instructions.

3. **Start the development server**
   ```bash
   npm run dev
   ```

## Environment Variables

See `.env.example` for all required environment variables. The most important ones are:

- `PORT` - Server port (default: 3000)
- `ENVIRONMENT` - Development or Production
- `MONGO_DB_CONNECTION_STRING` - MongoDB connection string
- `DEVELOPMENT_CLIENT_URL` - Frontend URL for CORS (e.g., http://localhost:5174)
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_PRIVATE_KEY` - Firebase private key

## CORS Configuration

The server is configured to accept requests from:
- **Development**: `http://localhost:5174` (Vite dev server)
- **Production**: Value from `PRODUCTION_CLIENT_URL` environment variable

If you see CORS errors, ensure:
1. The `DEVELOPMENT_CLIENT_URL` matches your frontend URL
2. The `ENVIRONMENT` is set correctly (Development or Production)
3. Both backend and frontend servers are running

## How to get firebase service account private key

If you have already created a project in Firebase and created a service account for the frontend, follow these steps:

1. Go to Firebase Console (https://console.firebase.google.com/)
2. Click on the settings icon → Project Settings → Service Accounts
3. Click "Generate new private key"
4. A JSON file will be downloaded to your device
5. Copy the required API keys from that file and put them in the `.env` file:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

If you are setting up Firebase for the first time, check out this guide:
https://ariangarshi.medium.com/how-to-use-firebase-for-google-authentication-in-a-react-js-in-2022-78171a235404

## API Routes

- `GET /` - Health check
- `GET /api/users/verify` - Verify user session
- `GET /api/users/sessionLogin` - Create user session
- `POST /api/users/logout` - Logout user
- And more... (see routes directory)

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run build` - No build step needed (placeholder command)

## Troubleshooting

### MongoDB Connection Errors
- Ensure MongoDB is running locally or use MongoDB Atlas
- Check your connection string in the `.env` file

### Firebase Authentication Errors
- Verify your Firebase credentials are correct
- Ensure the private key is properly formatted with escaped newlines

### CORS Errors
- Check that `DEVELOPMENT_CLIENT_URL` matches your frontend URL
- Verify the backend server is running
- Check browser console for detailed error messages
