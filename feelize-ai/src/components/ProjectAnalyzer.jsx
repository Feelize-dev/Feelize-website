import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Image as ImageIcon, File, Sparkles, Download, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_API_ENDPOINT || 'http://localhost:3000';

export const ProjectAnalyzer = () => {
  const [projectDescription, setProjectDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleFileUpload = (event) => {
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
      setUploadedFiles(prev => [...prev, ...processedFiles]);
    });
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeProject = async () => {
    if (!projectDescription.trim() && uploadedFiles.length === 0) {
      alert('Please provide a project description or upload files');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai/analyze-project`, {
        description: projectDescription,
        files: uploadedFiles.map(f => ({
          name: f.name,
          type: f.type,
          content: f.data
        }))
      });

      setReportData(response.data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;

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
      alert('Please allow popups to view the report. Check your browser settings.');
      return;
    }

    reportWindow.document.write(reportData.htmlReport);
    reportWindow.document.close();

    // Trigger print dialog after content loads
    setTimeout(() => {
      reportWindow.print();
    }, 500);
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <Card className="bg-[#141324] border border-gray-700/50">
        <CardContent className="p-8 space-y-6">
          <div>
            <label className="block text-white text-lg font-semibold mb-3">
              Describe Your Project
            </label>
            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Tell us about your project idea, goals, target audience, key features you envision..."
              className="bg-[#0A0E14] border-gray-700 text-white placeholder-gray-500 min-h-[150px] text-base"
            />
          </div>

          <div>
            <label className="block text-white text-lg font-semibold mb-3">
              Upload Supporting Files (Optional)
            </label>
            <p className="text-gray-400 text-sm mb-4">
              Upload images, mockups, documents, or any reference materials
            </p>
            
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-white font-medium">Click to upload files</p>
                <p className="text-gray-500 text-sm mt-2">
                  Supports images, PDFs, and text documents
                </p>
              </label>
            </div>
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <p className="text-white font-medium">Uploaded Files ({uploadedFiles.length})</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-[#0A0E14] border border-gray-700 rounded-lg p-3"
                  >
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-purple-900/20 rounded flex items-center justify-center text-purple-400">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{file.name}</p>
                      <p className="text-gray-500 text-xs">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={analyzeProject}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white py-6 text-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Your Project...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Project Plan & Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {reportData && (
        <Card className="bg-[#141324] border border-gray-700/50">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Your Project Report</h3>
              <Button
                onClick={downloadReport}
                className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download as PDF
              </Button>
            </div>

            {/* Report Preview */}
            <div
              className="bg-[#0A0E14] border border-gray-700 rounded-lg p-8"
              dangerouslySetInnerHTML={{ __html: reportData.htmlReport }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
