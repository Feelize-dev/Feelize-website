import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export default function ProjectTeam({ team }) {
  if (!team || team.length === 0) {
    return (
        <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-500" />
            <span className="text-sm text-slate-600">No team assigned</span>
        </div>
    );
  }

  return (
    <div className="flex items-center">
      <span className="text-sm font-medium mr-3 text-slate-700">Team:</span>
      <div className="flex -space-x-2">
        <TooltipProvider>
          {team.map((member) => (
            <Tooltip key={member.id}>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 border-2 border-white cursor-pointer">
                  <AvatarImage src={`https://avatar.vercel.sh/${member.user_email}.png`} alt={member.full_name} />
                  <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{member.full_name}</p>
                <Badge variant="secondary" className="mt-1">{member.access_level}</Badge>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}