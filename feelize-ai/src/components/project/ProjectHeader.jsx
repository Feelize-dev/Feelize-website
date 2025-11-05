import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Share2, Settings } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function ProjectHeader({ project, userRole }) {
  const getStatusInfo = (status) => {
    const statuses = {
      draft: { label: 'Draft', color: 'bg-slate-500/20 text-slate-600' },
      completed: { label: 'Under Review', color: 'bg-blue-500/20 text-blue-600' },
      contacted: { label: 'Proposal Sent', color: 'bg-purple-500/20 text-purple-600' },
      in_progress: { label: 'In Development', color: 'bg-green-500/20 text-green-600' },
      delivered: { label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-600' },
      cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-600' },
    };
    return statuses[status] || { label: 'Unknown', color: 'bg-gray-500/20 text-gray-600' };
  };

  const statusInfo = getStatusInfo(project.status);

  const getDashboardUrl = () => {
    if (userRole === 'admin') return createPageUrl('AdminDashboard');
    if (userRole === 'engineer') return createPageUrl('DeveloperDashboard');
    return createPageUrl('UserDashboard');
  };

  return (
    <header>
      <div className="mb-4">
        <Link to={getDashboardUrl()}>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{project.company_name || 'My Project'}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge className={`${statusInfo.color} text-sm`}>{statusInfo.label}</Badge>
            <p className="text-sm text-slate-500">
              Created on {new Date(project.created_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {userRole === 'admin' && (
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Project Settings
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}