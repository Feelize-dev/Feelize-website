import React, { useState, useEffect, useCallback } from "react";
import { ProjectBrief } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Printer, 
  ArrowLeft, 
  Loader2, 
  FileText,
  Sparkles,
  BrainCircuit,
  Share2
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ProjectReport() {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateProfessionalReport = useCallback(async (projectData) => {
    setIsGenerating(true);
    try {
      const htmlReport = await InvokeLLM({
        prompt: `
          You are a world-class UI/UX designer and report analyst from a top-tier consulting firm. Create a stunning, professional HTML report with perfect 2025 design standards.

          **Project Data:**
          - Client: ${projectData.client_name}
          - Company: ${projectData.company_name || 'N/A'}
          - Project Type: ${projectData.project_type}
          - Budget: ${projectData.budget_range}
          - Timeline: ${projectData.timeline}
          - Description: ${projectData.project_description}

          **AI Analysis Content:**
          ${projectData.ai_analysis}

          **CRITICAL DESIGN REQUIREMENTS:**

          1. **Perfect Typography & Sizing:**
             - Use system fonts: font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif
             - Headers: h1 (32px), h2 (24px), h3 (20px), h4 (18px)
             - Body text: 16px with 1.6 line height
             - Numbers in charts: font-size: 36px, font-weight: bold

          2. **Working Progress Circles:**
             Create functional SVG progress circles that show actual percentages (80% feasibility, 65% complexity, 90% success probability).
             Use this exact SVG code structure for each metric:

             <div style="text-align: center; margin: 20px;">
               <svg width="120" height="120" style="transform: rotate(-90deg);">
                 <circle cx="60" cy="60" r="50" stroke="#e5e7eb" stroke-width="10" fill="none"/>
                 <circle cx="60" cy="60" r="50" stroke="#00d4ff" stroke-width="10" fill="none" 
                         stroke-dasharray="314" stroke-dashoffset="63" stroke-linecap="round"/>
               </svg>
               <div style="margin-top: -75px; font-size: 28px; font-weight: bold; color: #1e293b;">80%</div>
               <div style="font-size: 14px; color: #64748b; margin-top: 5px;">Feasibility Score</div>
             </div>

          3. **Modern Color Palette:**
             - Primary: #0A2A4E (dark blue)
             - Accent: #00D4FF (cyan)
             - Success: #10B981 (green)
             - Warning: #F59E0B (amber)
             - Danger: #EF4444 (red)
             - Background: #F8FAFC (light gray)
             - Text: #1E293B (dark gray)

          4. **Professional Layout Structure:**
             - Header with gradient background
             - Executive summary with key metrics (use the SVG circles)
             - Technical Blueprint section with icons
             - Timeline with visual milestones
             - Risk assessment with color-coded tags
             - Budget breakdown table
             - Recommendations in callout boxes

          5. **Responsive Design:**
             - Use CSS Grid and Flexbox
             - Mobile-first approach with media queries
             - Max-width: 1200px for main content

          6. **Visual Enhancements:**
             - Box shadows for depth
             - Subtle gradients
             - Proper spacing (16px, 24px, 32px increments)
             - Icons using Unicode symbols
             - Tables with alternating row colors

          **IMPORTANT:** Return ONLY the complete HTML document with all CSS inline in the head section. No markdown, no explanations, just pure HTML that renders perfectly.

          Make this look like a premium consulting report worth thousands of dollars.
        `,
        response_json_schema: null
      });

      // Save the generated report to the project entity
      await ProjectBrief.update(projectData.id, { professional_report_html: htmlReport });

      setGeneratedHTML(htmlReport);
    } catch (error) {
      console.error("Error generating report:", error);
      setError("Failed to generate professional report");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        
        if (!projectId) {
          setError("No project ID provided");
          return;
        }

        const projects = await ProjectBrief.list();
        const foundProject = projects.find(p => p.id === projectId);
        
        if (!foundProject) {
          setError("Project not found");
          return;
        }

        setProject(foundProject);
        
        if (foundProject.professional_report_html) {
          // If report already exists, just display it
          setGeneratedHTML(foundProject.professional_report_html);
        } else if (foundProject.ai_analysis) {
          // If no report, but analysis exists, generate it in the background
          generateProfessionalReport(foundProject);
        } else {
          // No analysis to generate a report from
          setError("No AI analysis is available for this project to generate a report.");
        }

      } catch (error) {
        console.error("Error loading project:", error);
        setError("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [generateProfessionalReport]);


  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatedHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.company_name || project?.client_name || 'Project'}_Analysis_Report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading project report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Error</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link to={createPageUrl("UserDashboard")}>
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Controls */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-y-3">
            <div className="flex items-center gap-4 flex-wrap">
              <Link to={createPageUrl("UserDashboard")}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Project Analysis Report</h1>
                  <p className="text-sm text-slate-600">
                    {project?.company_name || project?.client_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:justify-end">
              <Badge className="bg-green-100 text-green-800">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="flex items-center gap-2"
                disabled={isGenerating || !generatedHTML}
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="flex items-center gap-2"
                disabled={isGenerating || !generatedHTML}
              >
                <Download className="w-4 h-4" />
                Download HTML
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isGenerating ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <BrainCircuit className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Generating Professional Report
                </h2>
                <p className="text-slate-600 mb-6">
                  Our AI is crafting a beautiful, state-of-the-art analysis for you...
                </p>
                <div className="max-w-md mx-auto">
                  <div className="bg-slate-200 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }} />
                  </div>
                  <p className="text-sm text-slate-500">This may take 30-60 seconds...</p>
                </div>
              </CardContent>
            </Card>
          ) : generatedHTML ? (
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div 
                className="report-content bg-white"
                dangerouslySetInnerHTML={{ __html: generatedHTML }}
                style={{
                  minHeight: '100vh',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              />
            </Card>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Report Available</h2>
                <p className="text-slate-600 mb-6">
                  An AI analysis report could not be found or generated for this project.
                </p>
                <Link to={createPageUrl("UserDashboard")}>
                  <Button>Return to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .report-content, .report-content * {
            visibility: visible;
          }
          .report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          
          /* Hide non-report elements when printing */
          nav, header, .sticky, button {
            display: none !important;
          }
        }
        
        /* Enhanced report styling fallback */
        .report-content {
          line-height: 1.6;
        }
        
        .report-content h1,
        .report-content h2,
        .report-content h3,
        .report-content h4 {
          color: #1e293b;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .report-content p {
          color: #475569;
          margin-bottom: 1rem;
        }
        
        .report-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5rem 0;
        }
        
        .report-content th,
        .report-content td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          text-align: left;
        }
        
        .report-content th {
          background-color: #f8fafc;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}