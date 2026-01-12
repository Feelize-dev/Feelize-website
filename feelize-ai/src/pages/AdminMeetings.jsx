import React, { useState, useEffect } from "react";
import axios from "axios";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import {
    Search,
    Loader2,
    ArrowLeft,
    Calendar,
    Mail,
    User as UserIcon,
    Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function AdminMeetings() {
    const [meetings, setMeetings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/meetings`,
                { withCredentials: true }
            );
            setMeetings(response.data.data);
        } catch (error) {
            console.error("Error fetching meetings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredMeetings = meetings.filter((meeting) => {
        const clientName = meeting.client_name || "";
        const clientEmail = meeting.client_email || "";
        const affiliateName = meeting.affiliate_id?.name || "";

        return (
            clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affiliateName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 mt-[120px]">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8 pt-28">
                    <Link to={createPageUrl("AdminPanel")}>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Meetings Management</h1>
                        <p className="text-slate-400">View and track usage of booked meetings</p>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search client, email, or affiliate..."
                            className="pl-9 bg-slate-900 border-slate-800 text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-slate-900">
                                <TableHead className="text-slate-400">Client Info</TableHead>
                                <TableHead className="text-slate-400">Meeting Time</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400">Affiliate / Referral Status</TableHead>
                                <TableHead className="text-slate-400">Responses</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredMeetings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        No meetings found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredMeetings.map((meeting) => (
                                    <TableRow key={meeting._id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell>
                                            <div className="flex items-center gap-2 mb-1">
                                                <UserIcon className="w-3 h-3 text-slate-500" />
                                                <span className="font-medium">{meeting.client_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Mail className="w-3 h-3" />
                                                {meeting.client_email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-slate-500" />
                                                <span>{new Date(meeting.meeting_time).toLocaleString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`
                                                ${meeting.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : ''}
                                                ${meeting.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
                                                ${meeting.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : ''}
                                                ${meeting.status === 'rescheduled' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                            `}>
                                                {meeting.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {meeting.affiliate_id ? (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1 text-green-400 text-sm">
                                                        <Gift className="w-3 h-3" />
                                                        <span>{meeting.affiliate_id.name}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Code: {meeting.referral_code}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-600 text-xs">Direct / No Code</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs text-slate-400 max-w-[200px] truncate">
                                                {meeting.form_responses ? JSON.stringify(meeting.form_responses) : '-'}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
