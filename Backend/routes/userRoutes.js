import express from "express"
import { deleteSession, verifyFirebaseTokenId } from '../controllers/auth.controller.js';
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
router.get('/verify', verifyUserSession, (req, res) => {
  res.json({
    data: req.user,
    success: false,
    message: "Session Successfully verified"
  });
})
router.post('/logout', verifyUserSession, deleteSession)

export default router;
