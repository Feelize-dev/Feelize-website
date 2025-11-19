// // Integrations now handled by Firebase backend
// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_SERVER_API_ENDPOINT || 'http://localhost:3000';

// export const Core = {
//   InvokeLLM: async ({ prompt, response_json_schema }) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/llm/invoke`, {
//         prompt,
//         response_json_schema
//       });
//       return response.data;
//     } catch (error) {
//       console.error('LLM invocation failed:', error);
//       throw error;
//     }
//   },
  
//   SendEmail: async (emailData) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/email/send`, emailData);
//       return response.data;
//     } catch (error) {
//       console.error('Email sending failed:', error);
//       throw error;
//     }
//   },
  
//   UploadFile: async (fileData) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/file/upload`, fileData);
//       return response.data;
//     } catch (error) {
//       console.error('File upload failed:', error);
//       throw error;
//     }
//   },
  
//   GenerateImage: async (imageData) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/image/generate`, imageData);
//       return response.data;
//     } catch (error) {
//       console.error('Image generation failed:', error);
//       throw error;
//     }
//   }
// };

// export const InvokeLLM = Core.InvokeLLM;
// export const SendEmail = Core.SendEmail;
// export const UploadFile = Core.UploadFile;
// export const GenerateImage = Core.GenerateImage;
// export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;
// export const CreateFileSignedUrl = Core.CreateFileSignedUrl;
// export const UploadPrivateFile = Core.UploadPrivateFile;






import { base44 } from './base44Client';


export const Core = base44.integrations.Core;

export const InvokeLLM = base44.integrations.Core.InvokeLLM;

export const SendEmail = base44.integrations.Core.SendEmail;

export const UploadFile = base44.integrations.Core.UploadFile;

export const GenerateImage = base44.integrations.Core.GenerateImage;

export const ExtractDataFromUploadedFile = base44.integrations.Core.ExtractDataFromUploadedFile;

export const CreateFileSignedUrl = base44.integrations.Core.CreateFileSignedUrl;

export const UploadPrivateFile = base44.integrations.Core.UploadPrivateFile;





