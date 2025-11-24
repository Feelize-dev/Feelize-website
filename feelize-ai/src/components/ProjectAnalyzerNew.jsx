import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Image as ImageIcon, File, Sparkles, Loader2, ChevronRight, Check } from 'lucide-react';
import axios from 'axios';
import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_SERVER_API_ENDPOINT || 'http://localhost:3000';

export const ProjectAnalyzer = () => {
  const [step, setStep] = useState(1); // 1: Initial Input, 2: AI Questions, 3: Generate Report
  const [answers, setAnswers] = useState({});
  const [projectDescription, setProjectDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState([]);
  const [analysisProgress, setAnalysisProgress] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [reportHtml, setReportHtml] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const { data: user, isLoading, refetch } = useUser();
  const navigate = useNavigate();

  const handleAnswer = (questionId, value, isMultiple = false) => {
    setAnswers(prev => {
      if (isMultiple) {
        const current = prev[questionId] || [];
        if (current.includes(value)) {
          return { ...prev, [questionId]: current.filter(v => v !== value) };
        } else {
          return { ...prev, [questionId]: [...current, value] };
        }
      }
      return { ...prev, [questionId]: value };
    });
  };

  const generateAIQuestions = async () => {
    if (!projectDescription.trim() && uploadedFiles.length === 0) {
      alert('Please provide a project description or upload files');
      return;
    }

    if (!user) {
      alert('Please log in to use the AI project analyzer.');
      navigate('/StartProject');
    }

    setIsGeneratingQuestions(true);
    setShowProgress(true);
    setAnalysisProgress([]);

    try {
      // Simulate progress updates
      const addProgress = (message, type = 'info') => {
        setAnalysisProgress(prev => [...prev, { message, type, timestamp: Date.now() }]);
      };

      // Step 1: Upload documents
      addProgress('📄 Processing your project description...', 'info');
      await new Promise(resolve => setTimeout(resolve, 500));

      if (uploadedFiles.length > 0) {
        addProgress(`📎 Analyzing ${uploadedFiles.length} uploaded file${uploadedFiles.length > 1 ? 's' : ''}...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Show file names
        uploadedFiles.forEach((file, index) => {
          addProgress(`   • ${file.name}`, 'file');
        });
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Step 2: Extract key information
      addProgress('🔍 Extracting key information from your input...', 'info');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Extract some keywords from description
      const words = projectDescription.toLowerCase().split(/\s+/);
      const techKeywords = ['website', 'app', 'mobile', 'ecommerce', 'saas', 'platform', 'api', 'database', 'ai', 'payment'];
      const foundKeywords = techKeywords.filter(keyword => words.some(word => word.includes(keyword)));

      if (foundKeywords.length > 0) {
        addProgress(`💡 Identified key areas: ${foundKeywords.join(', ')}`, 'highlight');
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Step 3: Call API
      addProgress('🤖 AI is analyzing your project requirements...', 'info');

      const response = await axios.post(`${API_BASE_URL}/api/ai/generate-questions`, {
        description: projectDescription,
        files: uploadedFiles.map(f => ({
          name: f.name,
          type: f.type,
          content: f.data
        }))
      });

      if (response.data.success && response.data.questions) {
        addProgress('✅ Analysis complete! Generating personalized questions...', 'success');
        await new Promise(resolve => setTimeout(resolve, 500));

        addProgress(`📋 Generated ${response.data.questions.length} custom questions for you`, 'success');
        await new Promise(resolve => setTimeout(resolve, 500));

        setAiGeneratedQuestions(response.data.questions);

        // Small delay before transitioning
        await new Promise(resolve => setTimeout(resolve, 800));
        setStep(2); // Move to questions step
        setShowProgress(false);
      }
    } catch (error) {
      console.error('Failed to generate questions:', error);
      setAnalysisProgress(prev => [...prev, {
        message: '❌ Failed to generate questions. Please try again.',
        type: 'error',
        timestamp: Date.now()
      }]);
      setTimeout(() => {
        setShowProgress(false);
        setIsGeneratingQuestions(false);
      }, 2000);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const canProceed = () => {
    if (aiGeneratedQuestions.length === 0) return false;
    return aiGeneratedQuestions.every(q => {
      if (q.multiple) {
        return answers[q.id] && answers[q.id].length > 0;
      }
      return answers[q.id];
    });
  };

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
    setShowProgress(true);
    setAnalysisProgress([]);

    try {
      const addProgress = (message, type = 'info') => {
        setAnalysisProgress(prev => [...prev, { message, type, timestamp: Date.now() }]);
      };

      // Step 1: Preparing data
      addProgress('📊 Preparing your project analysis...', 'info');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Build enhanced description with questionnaire context
      const questionnaireContext = Object.entries(answers)
        .map(([key, value]) => {
          const q = aiGeneratedQuestions.find(qu => qu.id === key);
          if (!q) return '';
          if (Array.isArray(value)) {
            return `${q.question}: ${value.join(', ')}`;
          }
          const option = q.options.find(opt => opt.value === value);
          return `${q.question}: ${option?.label || value}`;
        })
        .filter(Boolean)
        .join('\n');

      const enhancedDescription = `
PROJECT QUESTIONNAIRE RESPONSES:
${questionnaireContext}

DETAILED PROJECT DESCRIPTION:
${projectDescription}
`;

      // Step 2: Processing responses
      addProgress(`✅ Processed ${aiGeneratedQuestions.length} questionnaire responses`, 'success');
      await new Promise(resolve => setTimeout(resolve, 500));

      if (uploadedFiles.length > 0) {
        addProgress(`📎 Including ${uploadedFiles.length} uploaded file${uploadedFiles.length > 1 ? 's' : ''}...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Step 3: AI Analysis
      addProgress('🤖 AI is generating your comprehensive project report...', 'info');
      addProgress('   • Analyzing requirements and scope', 'file');
      await new Promise(resolve => setTimeout(resolve, 300));
      addProgress('   • Estimating timeline and budget', 'file');
      await new Promise(resolve => setTimeout(resolve, 300));
      addProgress('   • Recommending technology stack', 'file');
      await new Promise(resolve => setTimeout(resolve, 300));
      addProgress('   • Creating detailed breakdown', 'file');

      const response = await axios.post(`${API_BASE_URL}/api/ai/analyze-project`, {
        description: enhancedDescription,
        questionnaire: answers,
        files: uploadedFiles.map(f => ({
          name: f.name,
          type: f.type,
          content: f.data
        }))
      });

      if (response.data.success && response.data.htmlReport) {
        addProgress('✨ Report generated successfully!', 'success');
        await new Promise(resolve => setTimeout(resolve, 800));

        // Show report in modal overlay
        setReportHtml(response.data.htmlReport);
        setShowReportModal(true);
        setIsMinimized(false);
        setShowProgress(false);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisProgress(prev => [...prev, {
        message: '❌ Failed to generate report. Please try again.',
        type: 'error',
        timestamp: Date.now()
      }]);
      setTimeout(() => {
        setShowProgress(false);
      }, 3000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Initial Input - Files & Description */}
      {step === 1 && (
        <Card className="bg-[#141324] border border-gray-700/50">
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Tell us about your project</h3>
              <p className="text-gray-400">Describe your idea and upload any reference materials</p>
            </div>

            <div>
              <label className="block text-white text-lg font-semibold mb-3">
                Describe Your Project
              </label>
              <Textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Tell us about your project vision, goals, target audience, key features you envision, any specific requirements..."
                className="bg-[#0A0E14] border-gray-700 text-white placeholder-gray-500 min-h-[200px] text-base"
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
              onClick={generateAIQuestions}
              disabled={isGeneratingQuestions}
              className="w-full bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white py-6 text-md md:text-lg"
            >
              {isGeneratingQuestions ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Your Project...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Continue - Let AI Analyze
                </>
              )}
            </Button>

            {/* Progress Display */}
            {showProgress && analysisProgress.length > 0 && (
              <div className="mt-6 bg-[#0A0E14] border border-gray-700 rounded-lg p-6 space-y-3">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                  Analysis in Progress
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analysisProgress.map((progress, index) => (
                    <div
                      key={index}
                      className={`text-sm animate-fadeIn ${progress.type === 'error' ? 'text-red-400' :
                        progress.type === 'success' ? 'text-green-400' :
                          progress.type === 'highlight' ? 'text-purple-400 font-semibold' :
                            progress.type === 'file' ? 'text-gray-400 pl-4' :
                              'text-gray-300'
                        }`}
                    >
                      {progress.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: AI-Generated Questionnaire */}
      {step === 2 && aiGeneratedQuestions.length > 0 && (
        <Card className="bg-[#141324] border border-gray-700/50">
          <CardContent className="p-8 space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Based on your project, we have some questions</h3>
              <p className="text-gray-400">Answer these to get an accurate estimate</p>
            </div>

            {aiGeneratedQuestions.map((q, qIndex) => (
              <div key={q.id} className="space-y-4">
                <label className="block text-white text-lg font-semibold">
                  {qIndex + 1}. {q.question}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(q.id, option.value, q.multiple)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${q.multiple
                        ? (answers[q.id] || []).includes(option.value)
                          ? 'border-purple-500 bg-purple-900/20 text-white'
                          : 'border-gray-700 bg-[#0A0E14] text-gray-300 hover:border-gray-600'
                        : answers[q.id] === option.value
                          ? 'border-purple-500 bg-purple-900/20 text-white'
                          : 'border-gray-700 bg-[#0A0E14] text-gray-300 hover:border-gray-600'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {q.multiple && (answers[q.id] || []).includes(option.value) && (
                          <Check className="w-5 h-5 text-purple-400" />
                        )}
                        {!q.multiple && answers[q.id] === option.value && (
                          <Check className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-4">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 border-gray-700 text-white hover:bg-gray-800"
              >
                Back
              </Button>
              <Button
                onClick={analyzeProject}
                disabled={!canProceed() || isAnalyzing}
                className="flex-1 bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white py-6 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Full Report
                  </>
                )}
              </Button>
            </div>

            {/* Progress Display for Report Generation */}
            {showProgress && analysisProgress.length > 0 && (
              <div className="mt-6 bg-[#0A0E14] border border-gray-700 rounded-lg p-6 space-y-3">
                <div className="flex items-center gap-2 text-purple-400 font-semibold mb-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Your Report</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analysisProgress.map((progress, index) => (
                    <div
                      key={index}
                      className={`text-sm animate-fadeIn ${progress.type === 'error' ? 'text-red-400' :
                        progress.type === 'success' ? 'text-green-400' :
                          progress.type === 'highlight' ? 'text-purple-400 font-semibold' :
                            progress.type === 'file' ? 'text-gray-400 ml-4' :
                              'text-gray-300'
                        }`}
                    >
                      {progress.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Success message after report generation */}
      {step === 3 && (
        <Card className="bg-[#141324] border border-gray-700/50">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-[#0580E8] to-[#7000FF] rounded-full flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">✨ Report Generated Successfully!</h3>
            <p className="text-gray-400 text-lg mb-6">
              Your comprehensive project analysis is ready to view!
            </p>
            <Button
              onClick={() => {
                setStep(1);
                setAnswers({});
                setProjectDescription('');
                setUploadedFiles([]);
                setAiGeneratedQuestions([]);
              }}
              className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white px-8 py-4"
            >
              Analyze Another Project
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Modal Overlay */}
      {showReportModal && reportHtml && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          style={{
            display: isMinimized ? 'none' : 'flex'
          }}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] px-6 py-3 flex items-center justify-between shrink-0">
              <h3 className="text-white font-bold text-lg">📊 Project Analysis Report</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    // Extract title from report for filename
                    const titleMatch = reportHtml.match(/<title>(.*?)<\/title>/i);
                    const filename = titleMatch ? `${titleMatch[1].replace(/[^a-z0-9]/gi, '_')}.html` : 'Feelize_Project_Report.html';

                    // Create blob and download
                    const blob = new Blob([reportHtml], { type: 'text/html' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 text-sm flex items-center gap-1"
                  title="Download Report"
                >
                  <FileText className="w-4 h-4" />
                  Save
                </Button>
                <Button
                  onClick={() => setIsMinimized(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 text-sm"
                  title="Minimize"
                >
                  _
                </Button>
                <Button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportHtml(null);
                    setStep(1);
                    setAnswers({});
                    setProjectDescription('');
                    setUploadedFiles([]);
                    setAiGeneratedQuestions([]);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 text-sm"
                  title="Close"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Modal Content - Scrollable Report */}
            <div className="flex-1 overflow-y-auto">
              <iframe
                srcDoc={reportHtml}
                className="w-full h-full border-0"
                title="Project Analysis Report"
                sandbox="allow-same-origin allow-scripts allow-modals allow-popups allow-forms"
              />
            </div>
          </div>
        </div>
      )}

      {/* Minimized Report Button */}
      {showReportModal && isMinimized && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsMinimized(false)}
            className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white px-6 py-3 shadow-2xl rounded-full flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            View Report
          </Button>
        </div>
      )}
    </div>
  );
};
