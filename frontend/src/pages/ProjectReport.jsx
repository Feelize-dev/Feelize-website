import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { renderToString } from 'react-dom/server';

export default function ProjectReport() {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateProfessionalReport = useCallback(async (projectData) => {
    setIsGenerating(true);
    try {
      // Call backend to generate the report (backend will call the LLM and save the HTML)
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_API_ENDPOINT}/user/project/${projectData.id}/generate-report`,
        {},
        { withCredentials: true }
      );

      if (res?.data?.success) {
        const htmlReport = res.data.data.professional_report_html;
        setGeneratedHTML(htmlReport);
      } else {
        throw new Error('Backend failed to generate report');
      }
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

        const res = await axios.get(`${import.meta.env.VITE_SERVER_API_ENDPOINT}/user/project/${projectId}`, { withCredentials: true });
        const foundProject = res?.data?.data;

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
    const reportHtml = renderToString(
      <div className="max-w-4xl mx-auto py-8 px-6">
        <style dangerouslySetInnerHTML={{__html: `
          /* Enhanced styling for downloaded report */
          :root {
            --primary-color: #2563eb;
            --background-color: #ffffff;
            --text-color: #334155;
            --heading-color: #0f172a;
            --border-color: #e2e8f0;
            --code-bg: #f8fafc;
          }
          
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.8;
            color: var(--text-color);
            max-width: 900px;
            margin: 0 auto;
            padding: 3rem 2rem;
            background: var(--background-color);
          }

          h1, h2, h3, h4, h5, h6 {
            color: var(--heading-color);
            font-weight: 700;
            line-height: 1.3;
            margin: 2em 0 1em;
          }

          h1 {
            font-size: 2.5em;
            margin-top: 0;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 0.5em;
          }

          h2 { font-size: 1.75em; }
          h3 { font-size: 1.5em; }
          h4 { font-size: 1.25em; }

          p {
            margin: 1.5em 0;
            font-size: 1.125rem;
          }

          ul, ol {
            margin: 1.5em 0;
            padding-left: 2em;
          }

          li {
            margin: 0.75em 0;
            line-height: 1.6;
          }

          code {
            background: var(--code-bg);
            padding: 0.2em 0.4em;
            border-radius: 4px;
            font-size: 0.9em;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            color: var(--primary-color);
          }

          pre {
            background: var(--code-bg);
            padding: 1.5em;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid var(--border-color);
            margin: 1.5em 0;
          }

          pre code {
            background: none;
            padding: 0;
            font-size: 0.95em;
            color: inherit;
          }

          blockquote {
            border-left: 4px solid var(--primary-color);
            margin: 2em 0;
            padding: 1em 2em;
            font-style: italic;
            background: var(--code-bg);
            border-radius: 0 8px 8px 0;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            margin: 2em 0;
            font-size: 0.95em;
          }

          th, td {
            border: 1px solid var(--border-color);
            padding: 1em;
            text-align: left;
          }

          th {
            background: var(--code-bg);
            font-weight: 600;
          }

          img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 2em auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }

          a {
            color: var(--primary-color);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s ease;
          }

          a:hover {
            border-bottom-color: var(--primary-color);
          }

          @media print {
            body {
              max-width: none;
              padding: 2rem;
            }

            pre, code {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          }
        `}} />
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {generatedHTML}
        </ReactMarkdown>
      </div>
    );

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${project?.company_name || project?.client_name || 'Project'} Analysis Report</title>
      </head>
      <body>
        ${reportHtml}
      </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
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
              <div className="report-content bg-white p-8">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-slate lg:prose-lg max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-600 prose-li:text-gray-600 prose-pre:bg-slate-100 prose-pre:rounded-lg prose-code:text-blue-600 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-table:border-collapse prose-td:border prose-td:p-2 prose-th:border prose-th:p-2 prose-th:bg-slate-100"
                  components={{
                    code: ({inline, className, children, ...props}) => {
                      return <code className={`${className} ${inline ? 'bg-slate-100 rounded px-1' : ''}`} {...props}>{children}</code>
                    },
                    a: ({children, ...props}) => {
                      return <a className="text-blue-600 hover:text-blue-800 underline" {...props}>{children}</a>
                    }
                  }}
                >
                  {generatedHTML}
                </ReactMarkdown>
              </div>
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

      {/* Print & report styles */}
      <style>{`
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
          nav, header, .sticky, button {
            display: none !important;
          }
        }

        /* Basic prose styles so Markdown renders nicely without Tailwind typography plugin */
        .report-content {
          line-height: 1.8;
          color: #0f172a;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
        }

        .report-content .prose {
          max-width: none;
        }

        .report-content h1 {
          font-size: 28px;
          margin-top: 0;
          margin-bottom: 0.75rem;
          color: #0b2545;
          font-weight: 700;
        }

        .report-content h2 {
          font-size: 22px;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: #0b3a66;
          font-weight: 700;
        }

        .report-content h3 {
          font-size: 18px;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #0b3a66;
          font-weight: 600;
        }

        .report-content p {
          color: #334155;
          margin-bottom: 0.9rem;
          font-size: 15px;
        }

        .report-content ul,
        .report-content ol {
          margin-left: 1.25rem;
          margin-bottom: 0.9rem;
        }

        .report-content li {
          margin-bottom: 0.4rem;
        }

        .report-content blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 1rem;
          color: #475569;
          margin: 0.75rem 0;
        }

        .report-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0 1.5rem 0;
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

        /* Buttons and header layout fix for small screens */
        @media (max-width: 640px) {
          .report-content h1 { font-size: 22px; }
          .report-content h2 { font-size: 18px; }
        }
      `}</style>
    </div>
  );
}