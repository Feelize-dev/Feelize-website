import express from "express"
import { revokeSession, verifyFirebaseTokenId } from '../controllers/auth.controller.js';
import { createNewUser, verifyUserSession } from '../controllers/user.controller.js';
const router = express.Router();

// Placeholder for user routes
// Add authentication and user management routes here

router.get('/me', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User routes placeholder'
  });
});

router.get('/sessionLogin', verifyFirebaseTokenId, createNewUser)
router.get('/verify', verifyUserSession)
router.get('/logout',verifyUserSession,revokeSession)

export default router;
