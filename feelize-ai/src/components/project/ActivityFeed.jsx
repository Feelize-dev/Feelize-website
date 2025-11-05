import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ActivityItem = ({ activity }) => {
  return (
    <div className="flex items-start gap-4 py-4">
      <Avatar className="h-9 w-9">
        <AvatarImage src={`https://avatar.vercel.sh/${activity.user_email}.png`} alt={activity.user_name} />
        <AvatarFallback>{activity.user_name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold">{activity.user_name}</span> {activity.description}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {formatDistanceToNow(new Date(activity.created_date), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default function ActivityFeed({ activities, currentUser, onComment }) {
  const [newComment, setNewComment] = useState('');

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    onComment({
      activity_type: "COMMENT",
      description: `commented: "${newComment}"`,
      details: { text: newComment }
    });
    setNewComment('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          Activity & Communication
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Comment Box */}
        <div className="flex items-start gap-3 border-b pb-6">
            <Avatar className="h-10 w-10">
                <AvatarImage src={`https://avatar.vercel.sh/${currentUser.email}.png`} alt={currentUser.full_name} />
                <AvatarFallback>{currentUser.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
                <Textarea
                    placeholder="Ask a question or post an update..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end">
                    <Button onClick={handlePostComment} size="sm" disabled={!newComment.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Post
                    </Button>
                </div>
            </div>
        </div>

        {/* Activity List */}
        <div className="divide-y max-h-96 overflow-y-auto pr-2">
          {activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}