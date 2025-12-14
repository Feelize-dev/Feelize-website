import React, { useState, useRef, useEffect } from "react";
// Using backend API for project creation instead of Base44
import { InvokeLLM, UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Send,
  Paperclip,
  Bot,
  User as UserIcon,
  FileText,
  Image as ImageIcon,
  Check,
  Loader2,
  Sparkles,
  ArrowRight,
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  Target,
  Zap,
  Download,
} from "lucide-react";
import { auth, signInWithGooglePopup } from "@/config/firebaseConfig";
import axios from "axios";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useUser } from "@/hooks/useUser";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from "html2pdf.js";

export default function StartProjectPage() {
  // const [currentUser, setCurrentUser] = useState(null);
  const [currentStep, setCurrentStep] = useState("welcome"); // welcome, form, processing, report
  const [projectData, setProjectData] = useState({
    client_name: "",
    client_email: "",
    company_name: "",
    project_type: "",
    project_description: "",
    key_features: [],
    design_preferences: "",
    target_audience: "",
    budget_range: "",
    timeline: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdProject, setCreatedProject] = useState(null);
  const fileInputRef = useRef(null);

  const { data: user, isLoading, refetch } = useUser();

  const [processingStatus, setProcessingStatus] =
    useState("Initializing AI...");
  const [progressValue, setProgressValue] = useState(10);

  useEffect(() => {
    if (user) {
      setProjectData((prev) => ({
        ...prev,
        client_name: user.displayName || "",
        client_email: user.email || "",
      }));
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const result = await signInWithGooglePopup();
      const token = await result.user.getIdToken();
      console.log(token);

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/users/sessionLogin`,

        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      await refetch();
    } catch (error) {
      console.error("Google Sign-in or verification failed:", error);
    }
  };

  const handleDownloadReport = (markdownContent, projectName) => {
    if (!markdownContent) return;

    // Create a temporary container with the rendered markdown
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <div class="markdown-content">${markdownContent.replace(
      /\n/g,
      "<br>"
    )}</div>
      </div>
    `;

    // PDF options
    const opt = {
      margin: 1,
      filename: `${(projectName || "Project").replace(/\s+/g, "-")}-Report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Generate PDF
    html2pdf().set(opt).from(tempDiv).save();
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const { file_url } = await UploadFile({ file });
        return {
          name: file.name,
          type: file.type,
          url: file_url,
        };
      } catch (error) {
        console.error("Upload error:", error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(Boolean);
    setUploadedFiles((prev) => [...prev, ...successfulUploads]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setCurrentStep("processing");

    // Stage 1: Start
    setProcessingStatus("Initializing AI Architect...");
    setProgressValue(25);

    try {
      // Stage 2: Calling AI
      setProcessingStatus("AI is analyzing your project requirements...");
      setProgressValue(45);

      // Generate AI analysis
      const aiAnalysis = await InvokeLLM({
        prompt: `
          Analyze this project brief and provide comprehensive insights.
          
          CRITICAL INSTRUCTION: Do NOT include a title page, "Project Name", "Client", "Date", or any formal report header at the start. Start directly with the first section key insights.

          Project Type: ${projectData.project_type}
          Description: ${projectData.project_description}
          Target Audience: ${projectData.target_audience}
          Budget: ${projectData.budget_range}
          Timeline: ${projectData.timeline}
          
          Provide detailed analysis covering:
          1. Technical Requirements & Recommendations
          2. Design Direction & User Experience Strategy  
          3. Development Timeline & Milestones
          4. Budget Allocation & Cost Optimization
          5. Potential Challenges & Solutions
          6. Success Metrics & KPIs
          
          Format as a comprehensive project analysis report using Markdown.
        `,
      });

      // Stage 3: AI Finished, preparing backend request
      setProcessingStatus("Analysis complete. Generating final report...");
      setProgressValue(75);

      const briefData = {
        ...projectData,
        uploaded_files: uploadedFiles.map((f) => f.url),
        ai_analysis: aiAnalysis,
        status: "completed",
        referral_code: sessionStorage.getItem("referral_code") || null, // Include referral code
      };

      // Stage 4: Sending to backend (Saving & Emailing)
      setProcessingStatus("Creating project and sending email report...");
      setProgressValue(90);

      // Send to backend API to persist in MongoDB (session cookie required)
      try {
        const apiRes = await axios.post(
          `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/projects`,
          briefData,
          { withCredentials: true }
        );

        if (apiRes?.data?.success) {
          setCreatedProject(apiRes.data.data);
        } else {
          // fallback: use AI analysis locally in UI
          setCreatedProject({ ...briefData });
          console.warn(
            "Backend did not return success for project creation",
            apiRes?.data
          );
        }

        // Stage 5: Done
        setProgressValue(100);
        setCurrentStep("report");
      } catch (apiErr) {
        console.error("Failed to save project to backend:", apiErr);
        // still show report to user with local data
        setCreatedProject({ ...briefData });
        setCurrentStep("report");
      }
    } catch (error) {
      console.error("Processing error:", error);
      setCurrentStep("form"); // Go back to form on error
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  // Login Required Screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          {/* Multiple purple gradient blurs throughout the page */}
          {[
            { left: "10%", top: "-350px" },
            { left: "70%", top: "-250px" },
            { left: "-142px", top: "200px" },
            { left: "864px", top: "500px" },
            { left: "191px", top: "100px" },
            { left: "1226px", top: "300px" },
            { left: "-142px", top: "2664px" },
            { left: "864px", top: "3040px" },
            { left: "191px", top: "1992px" },
            { left: "1226px", top: "2183px" },
            { left: "-142px", top: "4774px" },
            { left: "864px", top: "5150px" },
            { left: "191px", top: "4102px" },
            { left: "1226px", top: "4293px" },
            { left: "-142px", top: "6644px" },
            { left: "864px", top: "7020px" },
            { left: "191px", top: "5972px" },
            { left: "1226px", top: "6163px" },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-[542px] h-[494px] rounded-full blur-[75px]"
              style={{
                left: pos.left,
                top: pos.top,
                background: "rgba(80, 0, 181, 0.67)",
                opacity: 0.25,
              }}
            />
          ))}
        </div>
        <div className="max-w-md w-full">
          <Card className="glass-morphism border border-white/20 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Welcome to Feelize AI
                </h1>
                <p className="text-slate-300 text-sm">
                  Sign in to start building your project with our AI assistant
                </p>
              </div>

              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold py-3 rounded-xl"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In to Continue
              </Button>

              <div className="mt-6 pt-6 border-t border-slate-600/30 text-center">
                <p className="text-slate-400 text-xs"></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Project Form
  if (currentStep === "welcome" || currentStep === "form") {
    return (
      <div className="min-h-screen py-8">
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          {/* Multiple purple gradient blurs throughout the page */}
          {[
            { left: "10%", top: "-350px" },
            { left: "70%", top: "-250px" },
            { left: "-142px", top: "200px" },
            { left: "864px", top: "500px" },
            { left: "191px", top: "100px" },
            { left: "1226px", top: "300px" },
            { left: "-142px", top: "2664px" },
            { left: "864px", top: "3040px" },
            { left: "191px", top: "1992px" },
            { left: "1226px", top: "2183px" },
            { left: "-142px", top: "4774px" },
            { left: "864px", top: "5150px" },
            { left: "191px", top: "4102px" },
            { left: "1226px", top: "4293px" },
            { left: "-142px", top: "6644px" },
            { left: "864px", top: "7020px" },
            { left: "191px", top: "5972px" },
            { left: "1226px", top: "6163px" },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-[542px] h-[494px] rounded-full blur-[75px]"
              style={{
                left: pos.left,
                top: pos.top,
                background: "rgba(80, 0, 181, 0.67)",
                opacity: 0.25,
              }}
            />
          ))}
        </div>
        <div className="max-w-4xl mx-auto px-4 pt-32">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Let's Build Your Project
            </h1>
            <p className="text-white">
              Tell us about your vision and we'll create the perfect plan
            </p>
          </div>

          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={` w-8   h-2 round e d-full  ${step === 1 ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                  />
                ))}
              </div>
              <CardTitle className="text-xl text-slate-900">
                Project Details
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={projectData.client_name}
                      onChange={(e) =>
                        setProjectData((prev) => ({
                          ...prev,
                          client_name: e.target.value,
                        }))
                      }
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={projectData.client_email}
                      onChange={(e) =>
                        setProjectData((prev) => ({
                          ...prev,
                          client_email: e.target.value,
                        }))
                      }
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Name
                    </label>
                    <Input
                      value={projectData.company_name}
                      onChange={(e) =>
                        setProjectData((prev) => ({
                          ...prev,
                          company_name: e.target.value,
                        }))
                      }
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Project Type
                    </label>
                    <Select
                      value={projectData.project_type}
                      onValueChange={(value) =>
                        setProjectData((prev) => ({
                          ...prev,
                          project_type: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="web_app">Web Application</SelectItem>
                        <SelectItem value="ecommerce">
                          E-commerce Store
                        </SelectItem>
                        <SelectItem value="mobile_app">Mobile App</SelectItem>
                        <SelectItem value="redesign">Redesign</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Description
                  </label>
                  <Textarea
                    value={projectData.project_description}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        project_description: e.target.value,
                      }))
                    }
                    placeholder="Describe your project vision, goals, and requirements..."
                    className="h-32"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Budget Range
                    </label>
                    <Select
                      value={projectData.budget_range}
                      onValueChange={(value) =>
                        setProjectData((prev) => ({
                          ...prev,
                          budget_range: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_5k">Under $5,000</SelectItem>
                        <SelectItem value="5k_15k">$5,000 - $15,000</SelectItem>
                        <SelectItem value="15k_50k">
                          $15,000 - $50,000
                        </SelectItem>
                        <SelectItem value="50k_plus">$50,000+</SelectItem>
                        <SelectItem value="not_sure">Not Sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Timeline
                    </label>
                    <Input
                      value={projectData.timeline}
                      onChange={(e) =>
                        setProjectData((prev) => ({
                          ...prev,
                          timeline: e.target.value,
                        }))
                      }
                      placeholder="e.g., 2 months, ASAP, flexible"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Audience
                  </label>
                  <Input
                    value={projectData.target_audience}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        target_audience: e.target.value,
                      }))
                    }
                    placeholder="Who will use this product?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Files (Optional)
                  </label>
                  <div
                    className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      multiple
                      accept="image/*,.pdf,.txt,.docx"
                    />
                    <Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">
                      Drop files here or click to upload
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Images, PDFs, documents welcome
                    </p>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                        >
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-slate-700">
                            {file.name}
                          </span>
                          <Check className="w-4 h-4 text-green-500 ml-auto" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !projectData.project_description}
                  className="w-full flex items-center justify-center bg-gradient-to-r hover:from-indigo-700 hover:to-purple-900 from-indigo-700 to-purple-700 text-white font-bold py-3 text-lg rounded-xl"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      AI is Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate AI Analysis
                    </>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Processing Screen
  if (currentStep === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          {/* Multiple purple gradient blurs throughout the page */}
          {[
            { left: "10%", top: "-350px" },
            { left: "70%", top: "-250px" },
            { left: "-142px", top: "200px" },
            { left: "864px", top: "500px" },
            { left: "191px", top: "100px" },
            { left: "1226px", top: "300px" },
            { left: "-142px", top: "2664px" },
            { left: "864px", top: "3040px" },
            { left: "191px", top: "1992px" },
            { left: "1226px", top: "2183px" },
            { left: "-142px", top: "4774px" },
            { left: "864px", top: "5150px" },
            { left: "191px", top: "4102px" },
            { left: "1226px", top: "4293px" },
            { left: "-142px", top: "6644px" },
            { left: "864px", top: "7020px" },
            { left: "191px", top: "5972px" },
            { left: "1226px", top: "6163px" },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-[542px] h-[494px] rounded-full blur-[75px]"
              style={{
                left: pos.left,
                top: pos.top,
                background: "rgba(80, 0, 181, 0.67)",
                opacity: 0.25,
              }}
            />
          ))}
        </div>

        {/* Updated Card Content */}
        <Card className="max-w-md w-full glass-morphism border border-white/20 rounded-3xl relative overflow-hidden">
          {/* Optional: Add a subtle loading bar at the very top */}
          <div
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700 ease-out"
            style={{ width: `${progressValue}%` }}
          />

          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              {progressValue < 90 ? (
                <Bot className="w-10 h-10 text-white animate-bounce" />
              ) : (
                <Check className="w-10 h-10 text-white animate-in zoom-in" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {progressValue < 100 ? "Processing Project" : "Complete!"}
            </h2>

            {/* Dynamic Status Text */}
            <p className="text-slate-300 mb-8 min-h-[3rem] transition-all duration-300">
              {processingStatus}
            </p>

            <div className="space-y-2">
              <Progress value={progressValue} className="h-2" />
              <div className="flex justify-between text-xs text-slate-400 px-1">
                <span>Analysis</span>
                <span>Report</span>
                <span>Finalize</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Project Report
  if (currentStep === "report" && createdProject) {
    return (
      <div className="min-h-screen py-8">
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          {/* Multiple purple gradient blurs throughout the page */}
          {[
            { left: "10%", top: "-350px" },
            { left: "70%", top: "-250px" },
            { left: "-142px", top: "200px" },
            { left: "864px", top: "500px" },
            { left: "191px", top: "100px" },
            { left: "1226px", top: "300px" },
            { left: "-142px", top: "2664px" },
            { left: "864px", top: "3040px" },
            { left: "191px", top: "1992px" },
            { left: "1226px", top: "2183px" },
            { left: "-142px", top: "4774px" },
            { left: "864px", top: "5150px" },
            { left: "191px", top: "4102px" },
            { left: "1226px", top: "4293px" },
            { left: "-142px", top: "6644px" },
            { left: "864px", top: "7020px" },
            { left: "191px", top: "5972px" },
            { left: "1226px", top: "6163px" },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-[542px] h-[494px] rounded-full blur-[75px]"
              style={{
                left: pos.left,
                top: pos.top,
                background: "rgba(80, 0, 181, 0.67)",
                opacity: 0.25,
              }}
            />
          ))}
        </div>
        <div className="max-w-6xl mx-auto px-4 pt-32">
          {/* Header */}
          <div className="text-center gap-5 flex flex-col py-5">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Your AI-Generated Project Report
            </h1>
            <p className="text-white px-6 md:max-w-lg mx-auto">
              Our AI has analyzed your requirements and created a comprehensive
              project plan
            </p>
          </div>

          {/* Report Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Report */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl flex flex-row justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Analysis & Recommendations
                  </CardTitle>
                  {createdProject.ai_analysis && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() =>
                        handleDownloadReport(
                          createdProject.ai_analysis,
                          createdProject.company_name
                        )
                      }
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  {createdProject.ai_analysis ? (
                    <div className="prose prose-slate max-w-none border rounded-lg p-8 bg-white markdown-report">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {createdProject.ai_analysis}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Bot className="w-12 h-12 mx-auto mb-4" />
                      <p>AI analysis is being generated...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Project Summary */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Project Type
                    </h4>
                    <Badge className="bg-blue-100 text-blue-800">
                      {projectData.project_type
                        ?.replace("_", " ")
                        .toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Budget Range
                    </h4>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-slate-700">
                        {projectData.budget_range?.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Timeline
                    </h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-slate-700">
                        {projectData.timeline || "To be discussed"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Target Audience
                    </h4>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-600" />
                      <span className="text-slate-700">
                        {projectData.target_audience || "General users"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-slate-700">
                        Project analysis completed
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        2
                      </div>
                      <span className="text-sm text-slate-700">
                        Awaiting team review
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        3
                      </div>
                      <span className="text-sm text-slate-500">
                        Proposal delivery (24-48h)
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Link to={createPageUrl("UserDashboard")}>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                        View My Dashboard
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setCurrentStep("welcome");
                        setProjectData({
                          client_name: currentUser.full_name || "",
                          client_email: currentUser.email || "",
                          company_name: "",
                          project_type: "",
                          project_description: "",
                          key_features: [],
                          design_preferences: "",
                          target_audience: "",
                          budget_range: "",
                          timeline: "",
                        });
                        setCreatedProject(null);
                        setUploadedFiles([]);
                      }}
                    >
                      Start New Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
