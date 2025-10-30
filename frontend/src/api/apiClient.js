import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_ENDPOINT,
  withCredentials: true, // Important for sending cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// API functions for projects
export const projectsApi = {
  // List all projects
  list: async (filters = {}) => {
    const response = await apiClient.get('/user/projects', { params: filters });
    return response.data.data;
  },

  // Get single project
  get: async (id) => {
    const response = await apiClient.get(`/user/project/${id}`);
    return response.data.data;
  },

  // Create new project
  create: async (projectData) => {
    const response = await apiClient.post('/user/project', projectData);
    return response.data.data;
  },

  // Update project
  update: async (id, updates) => {
    const response = await apiClient.put(`/user/project/${id}`, updates);
    return response.data.data;
  },

  // Generate report
  generateReport: async (id) => {
    const response = await apiClient.post(`/user/project/${id}/generate-report`);
    return response.data.data;
  }
};

// API functions for messages
export const messagesApi = {
  // List messages for a project
  list: async (projectId, params = {}) => {
    const response = await apiClient.get(`/user/project/${projectId}/messages`, { params });
    return response.data.data;
  },

  // Send a message
  send: async (projectId, content, attachments = []) => {
    const response = await apiClient.post(`/user/project/${projectId}/messages`, {
      content,
      attachments
    });
    return response.data.data;
  }
};

// API functions for user
export const userApi = {
  // Get current user
  me: async () => {
    const response = await apiClient.get('/user/me');
    return response.data.data;
  }
};

export default apiClient;