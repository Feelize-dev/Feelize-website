import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, FileText, Download } from 'lucide-react';

export default function ReportViewer({ project, userRole }) {
  const isInternal = userRole === 'admin' || userRole === 'engineer';

  const reportHTML = project.professional_report_html;
  const analysisText = project.ai_analysis;

  const handleDownloadReport = (htmlContent, projectName) => {
    if (!htmlContent) return;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(projectName || 'Project').replace(/\s+/g, '-')}-Proposal.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
             <div className="border bg-white p-4 rounded-md" dangerouslySetInnerHTML={{ __html: reportHTML }} />
          ) : (
            <p className="text-slate-600 italic p-4">{contentToDisplay}</p>
          )
        )}
      </CardContent>
    </Card>
  );
}