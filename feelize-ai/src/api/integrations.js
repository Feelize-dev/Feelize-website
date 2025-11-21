import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_API_ENDPOINT || 'http://localhost:3000';

export const Core = {
    InvokeLLM: async ({ prompt, response_json_schema }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/llm/invoke`, {
                prompt,
                response_json_schema
            }, { withCredentials: true });
            return response.data.data; // Backend returns { success: true, data: ... }
        } catch (error) {
            console.error('LLM invocation failed:', error);
            throw error;
        }
    },

    SendEmail: async (emailData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/email/send`, emailData, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    },

    UploadFile: async (fileData) => {
        try {
            // fileData should be a FormData object
            const response = await axios.post(`${API_BASE_URL}/api/file/upload`, fileData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('File upload failed:', error);
            throw error;
        }
    },

    GenerateImage: async (imageData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/image/generate`, imageData, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Image generation failed:', error);
            throw error;
        }
    }
};

export const InvokeLLM = Core.InvokeLLM;
export const SendEmail = Core.SendEmail;
export const UploadFile = Core.UploadFile;
export const GenerateImage = Core.GenerateImage;
// Export placeholders for others if needed, or implement them
export const ExtractDataFromUploadedFile = async () => { console.warn("ExtractDataFromUploadedFile not implemented"); };
export const CreateFileSignedUrl = async () => { console.warn("CreateFileSignedUrl not implemented"); };
export const UploadPrivateFile = async () => { console.warn("UploadPrivateFile not implemented"); };





