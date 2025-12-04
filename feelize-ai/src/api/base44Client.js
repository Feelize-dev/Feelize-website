import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68cfd9b791e6aadfa7fac25f", 
  requiresAuth: false // Ensure authentication is required for all operations
});