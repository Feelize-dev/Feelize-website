import React, { useState, useEffect } from "react";
import { ProjectBrief } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TeamReportPage() {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReport = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        
        if (!projectId) {
          setError("No project ID provided.");
          setIsLoading(false);
          return;
        }

        const projectData = await ProjectBrief.get(projectId);
        
        if (!projectData) {
          setError("Project not found.");
          setIsLoading(false);
          return;
        }
        
        setProject(projectData);
      } catch (error) {
        console.error("Error loading team report:", error);
        setError("Failed to load the report. You may not have permission to view it.");
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {error || !project || !project.internal_team_report ? (
          <Card>
            <CardHeader>
              <CardTitle>Report Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">{error || "The requested team report does not exist or could not be loaded."}</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                  <div>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                          <BookOpen className="w-6 h-6 text-indigo-600" />
                          Internal Team Report
                      </CardTitle>
                      <p className="text-slate-500 mt-1">For project: {project.company_name || project.client_name}</p>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-h-[70vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-slate-800 font-sans leading-relaxed">
                  {project.internal_team_report}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}