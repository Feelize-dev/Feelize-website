# 🚀 Quick Start Guide

Get the Feelize application running in 5 minutes!

## Prerequisites

- ✅ Node.js installed (v16+)
- ✅ MongoDB running (or MongoDB Atlas account)
- ✅ Firebase project created

## Step-by-Step Setup

### 1️⃣ Install Dependencies

```bash
# Backend
cd Backend
npm install

# Frontend (in a new terminal)
cd feelize-ai
npm install
```

### 2️⃣ Configure Backend

```bash
cd Backend
# Edit .env file
```

**Required Changes in `Backend/.env`:**

```bash
# Replace with your MongoDB connection string
MONGO_DB_CONNECTION_STRING=mongodb://localhost:27017/feelize
# OR
MONGO_DB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/feelize

# Replace with your Firebase Admin SDK credentials
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"

# CORS is already configured for local development ✅
DEVELOPMENT_CLIENT_URL=http://localhost:5174
```

**Get Firebase Admin credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings → Service Accounts → Generate New Private Key
3. Copy values from downloaded JSON to .env

### 3️⃣ Configure Frontend

```bash
cd feelize-ai
# Edit .env file
```

**Required Changes in `feelize-ai/.env`:**

```bash
# Backend API is already configured ✅
VITE_SERVER_API_ENDPOINT=http://localhost:3000

# Replace with your Firebase Web App credentials
VITE_SERVER_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_SERVER_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_SERVER_PROJECT_ID=your-project-id
VITE_SERVER_STORAGE_BUCKET=your-project.appspot.com
VITE_SERVER_MESSAGING_CENTER_ID=123456789012
VITE_SERVER_APP_ID=1:123456789012:web:abcdef1234567890
```

**Get Firebase Web credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings → General → Your apps → Web app
3. Copy the config values to .env

### 4️⃣ Start the Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

You should see:
```
✅ Firebase Admin SDK initialized successfully
✅ Database Connected successfully
🚀 Server running on port 3000
📝 Environment: Development
🌐 CORS allowed origin: http://localhost:5174
```

**Terminal 2 - Frontend:**
```bash
cd feelize-ai
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

### 5️⃣ Test It!

Open your browser to `http://localhost:5174`

## ⚠️ Troubleshooting

### CORS Error?
```
❌ Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix:**
- Check `Backend/.env` has `DEVELOPMENT_CLIENT_URL=http://localhost:5174`
- Restart backend server
- Clear browser cache

### Firebase Error?
```
❌ Firebase: Error (auth/api-key-not-valid)
```

**Fix:**
- Verify `VITE_SERVER_API_KEY` in `feelize-ai/.env` is correct
- Check you're using the **Web App** API key, not Admin SDK
- Restart frontend server

### MongoDB Error?
```
❌ Database connection Error: connect ECONNREFUSED
```

**Fix:**
- Start MongoDB: `mongod`
- Or update connection string to use MongoDB Atlas
- Restart backend server

## 📚 Need More Help?

- **Detailed Setup:** See [SETUP.md](./SETUP.md)
- **Fix Summary:** See [CORS-FIREBASE-FIX-SUMMARY.md](./CORS-FIREBASE-FIX-SUMMARY.md)
- **Backend Info:** See [Backend/README.md](./Backend/README.md)

## ✅ Success Indicators

Backend started successfully:
```
✅ Firebase Admin SDK initialized successfully
✅ Database Connected successfully
🚀 Server running on port 3000
🌐 CORS allowed origin: http://localhost:5174
```

Frontend started successfully:
```
➜  Local:   http://localhost:5174/
```

No CORS errors in browser console ✅
No Firebase API key errors ✅

---

**Need to test CORS?**
```bash
cd Backend
chmod +x test-cors.sh
./test-cors.sh
```
