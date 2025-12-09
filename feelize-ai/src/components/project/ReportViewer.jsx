import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, FileText, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';

export default function ReportViewer({ project, userRole }) {
  const isInternal = userRole === 'admin' || userRole === 'engineer';

  const reportHTML = project.professional_report_html;
  const analysisText = project.ai_analysis;

  const handleDownloadReport = (markdownContent, projectName) => {
    if (!markdownContent) return;

    // Create a temporary container with the rendered markdown
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <div class="markdown-content">${markdownContent.replace(/\n/g, '<br>')}</div>
      </div>
    `;

    // PDF options
    const opt = {
      margin: 1,
      filename: `${(projectName || "Project").replace(/\s+/g, "-")}-Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().set(opt).from(tempDiv).save();
  };

  const contentToDisplay = isInternal ? analysisText : (reportHTML || "The full project report is being prepared by our team and will be available here shortly.");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {isInternal ? <FileText className="w-5 h-5 text-slate-600" /> : <Sparkles className="w-5 h-5 text-indigo-600" />}
          {isInternal ? 'Internal AI Analysis' : 'Project Analysis & Proposal'}
        </CardTitle>
        {!isInternal && reportHTML && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport(reportHTML, project.company_name)}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isInternal ? (
          <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-md">
            {contentToDisplay}
          </div>
        ) : (
          reportHTML ? (
            <div className="prose prose-slate max-w-none border bg-white p-6 rounded-md markdown-report">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {reportHTML}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-slate-600 italic p-4">{contentToDisplay}</p>
          )
        )}
      </CardContent>
    </Card>
  );
}