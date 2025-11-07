import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Send, Sparkles, MessageCircle, Paperclip, FileText, Image as ImageIcon, Download } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_API_ENDPOINT || 'http://localhost:3000';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const AIChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hey there! I\'m Feely, your AI assistant. 😊 Ask me anything about building your project, our services, pricing, or even coding questions!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileAttach = (event) => {
    const files = Array.from(event.target.files);
    const filePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result,
            preview: file.type.startsWith('image/') ? e.target.result : null
          });
        };

        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      });
    });

    Promise.all(filePromises).then(processedFiles => {
      setAttachedFiles(prev => [...prev, ...processedFiles]);
    });
  };

  const removeAttachment = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateProjectReport = async () => {
    if (messages.length < 3) {
      alert('Please have a conversation about your project first!');
      return;
    }

    setIsGeneratingReport(true);

    try {
      // Collect all files that were shared during the conversation
      const allChatFiles = messages
        .filter(msg => msg.files && msg.files.length > 0)
        .flatMap(msg => msg.files);

      // Build a comprehensive description from the conversation
      const conversationSummary = messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Feely'}: ${msg.content}`)
        .join('\n\n');

      // Use the analyze-project endpoint which handles both description and files
      const response = await axios.post(`${API_BASE_URL}/api/ai/analyze-project`, {
        description: `PROJECT CONTEXT FROM CONVERSATION:\n\n${conversationSummary}`,
        files: allChatFiles.length > 0 ? allChatFiles.map(f => ({
          name: f.name,
          type: f.type,
          content: f.data
        })) : []
      });

      if (response.data.success) {
        // Open in a new popup window with specific dimensions
        const width = Math.min(1200, window.screen.width * 0.9);
        const height = Math.min(900, window.screen.height * 0.9);
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        
        const reportWindow = window.open(
          'about:blank', 
          '_blank',
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );
        
        if (!reportWindow) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: '⚠️ Please allow popups to view the report. Check your browser settings and try again.' 
          }]);
          return;
        }

        reportWindow.document.write(response.data.htmlReport);
        reportWindow.document.close();

        // Trigger print dialog
        setTimeout(() => {
          reportWindow.print();
        }, 500);

        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '🎉 I\'ve generated your project report! It should open in a new window. You can print it or save as PDF.' 
        }]);
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '😔 Sorry, I couldn\'t generate the report. Please try again or contact us at hello@feelize.com' 
      }]);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;

    const userMessage = input.trim() || '[File attachment]';
    const filesToSend = [...attachedFiles];
    
    setInput('');
    setAttachedFiles([]);
    
    // Add user message with file info
    const messageContent = filesToSend.length > 0 
      ? `${userMessage}\n\n📎 Attached: ${filesToSend.map(f => f.name).join(', ')}`
      : userMessage;
    
    // Store files with the message for later report generation
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: messageContent,
      files: filesToSend.length > 0 ? filesToSend : undefined
    }]);
    setIsLoading(true);

    try {
      let promptText = userMessage;
      
      // Add file content to prompt
      if (filesToSend.length > 0) {
        promptText += `\n\nUser has attached ${filesToSend.length} file(s):\n`;
        filesToSend.forEach((file, index) => {
          promptText += `\nFile ${index + 1}: ${file.name} (${file.type})\n`;
          if (file.type.startsWith('text/') || file.type.includes('json') || file.type.includes('javascript') || file.type.includes('typescript')) {
            promptText += `Content:\n${file.data}\n`;
          } else if (file.type.startsWith('image/')) {
            promptText += `[Image file - User wants you to analyze or discuss this image in context]\n`;
          } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            promptText += `[PDF Document - This appears to be a project document. Ask the user to describe what's in it, or suggest they use the "Generate Project Report" button which can analyze files more deeply]\n`;
          } else {
            promptText += `[File attached - Ask user to describe the content or use Generate Project Report for detailed analysis]\n`;
          }
        });
      }

      // Try to use Gemini API directly - use gemini-2.5-flash for fast chat responses
      if (GEMINI_API_KEY) {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `You are Feely (short for Feelize AI Personal Assistant - what your mom used to call you). You're a friendly, conversational AI assistant for Feelize, a development-first agency.

PERSONALITY & TONE:
- Be conversational and warm, like chatting with a knowledgeable friend
- Keep responses SHORT and to the point (2-4 sentences max unless explaining something complex)
- If asked your name, say: "I'm Feely! It's what my mom used to call me - short for Feelize AI Personal Assistant 😊"
- Be helpful and understand context from the conversation
- Ask clarifying questions when needed
- If gathering project info, guide users naturally toward details needed for a project report

FEELIZE SERVICES:
- Campaign Sites: $2,999 (1-2 weeks) - Landing pages, lead capture, custom design
- E-commerce Pro: $7,999 (4-6 weeks) - Full online store, payments, inventory
- SaaS Platforms: $20,000+ (8-16 weeks) - Custom web apps, user auth, complex features

KEY STATS:
- 95% faster delivery with AI
- 80% cost savings
- 100% client satisfaction

PROCESS: Discovery → AI Planning → Development → QA → Launch

WHEN USER ATTACHES FILES:
- If they attach a PDF, image, or document, acknowledge it and ask them to describe what it contains
- For detailed file analysis, suggest: "I can see you've attached a file! For a comprehensive analysis with cost breakdown, click the 'Generate Project Report' button and I'll create a detailed proposal for you."
- You can discuss the project based on what the user tells you, but deep file analysis happens via the report generator

WHEN DISCUSSING PROJECTS:
If the user is describing a project idea, naturally gather:
1. What they want to build
2. Who it's for (target audience)
3. Key features they envision
4. Timeline expectations
5. Budget range

Once you have enough info, offer: "Want me to generate a detailed project report for you? Just click the 'Generate Project Report' button!"

Keep it natural and conversational - don't interrogate, just chat!
                    
                    Now respond to: ${promptText}`
                  }
                ]
              }
            ]
          }
        );

        const aiResponse = response.data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } else {
        // Fallback to backend
        const response = await axios.post(`${API_BASE_URL}/api/chat`, {
          message: promptText,
          files: filesToSend.map(f => ({
            name: f.name,
            type: f.type,
            content: f.data
          })),
          context: 'feelize-assistant'
        });
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again or contact us at hello@feelize.com'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 h-[600px] bg-[#141324] border-gray-700 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-[#0580E8] to-[#7000FF]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white" />
              <h3 className="font-semibold text-white">Feely - Your AI Assistant</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {messages.length > 3 && (
            <Button
              onClick={generateProjectReport}
              disabled={isGeneratingReport}
              size="sm"
              className="w-full bg-white/20 hover:bg-white/30 text-white text-xs"
            >
              {isGeneratingReport ? (
                <>Generating Report...</>
              ) : (
                <>
                  <Download className="w-3 h-3 mr-1" />
                  Generate Project Report
                </>
              )}
            </Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[#0580E8] to-[#7000FF] text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          {/* File attachments preview */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 text-sm"
                >
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} className="w-8 h-8 object-cover rounded" />
                  ) : (
                    file.type.includes('pdf') ? (
                      <FileText className="w-4 h-4 text-purple-400" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-400" />
                    )
                  )}
                  <span className="text-gray-300 truncate max-w-[120px]">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileAttach}
              multiple
              accept="image/*,.pdf,.txt,.doc,.docx,.json"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              disabled={isLoading}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="bg-gray-800 border-gray-700 text-white flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
              className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Floating Chat Button
export const ChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-[#0580E8] to-[#7000FF] text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-200"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};

export default AIChatbot;
