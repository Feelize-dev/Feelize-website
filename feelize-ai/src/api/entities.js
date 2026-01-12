// Entities now handled by Firebase backend API
import axios from 'axios';
import { auth } from '@/config/firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_SERVER_API_ENDPOINT || 'http://localhost:3000';

// Helper function to create entity CRUD operations
const createEntity = (entityName) => ({
  async create(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/${entityName}`, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error creating ${entityName}:`, error);
      throw error;
    }
  },

  async get(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/${entityName}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error getting ${entityName}:`, error);
      throw error;
    }
  },

  async filter(params) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/${entityName}`, { params, withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error filtering ${entityName}:`, error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/${entityName}/${id}`, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error updating ${entityName}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/${entityName}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);
      throw error;
    }
  }
});

export const Project = createEntity('projects');
export const ProjectBrief = createEntity('project-briefs');
export const Engineer = createEntity('engineers');
export const Task = createEntity('tasks');
export const ActivityLog = createEntity('activity-logs');
export const Affiliate = createEntity('affiliates');
export const Referral = createEntity('referrals');
export const Meeting = createEntity('meetings');
Meeting.sync = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/meetings/sync`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error syncing meeting:", error);
    throw error;
  }
};

export const User = {
  async me() {
    return auth.currentUser;
  },

  async login() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account"
    });
    const result = await signInWithPopup(auth, provider);

    // Create backend session
    const token = await result.user.getIdToken();
    await axios.get(`${API_BASE_URL}/api/users/sessionLogin`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });

    return result.user;
  },

  async logout() {
    await signOut(auth);
  },

  redirectToLogin(returnUrl) {
    window.location.href = `/login?redirect=${encodeURIComponent(returnUrl || window.location.pathname)}`;
  }
};
