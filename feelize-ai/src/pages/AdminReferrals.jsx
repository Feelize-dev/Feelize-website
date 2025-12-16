import React, { useState, useEffect } from "react";
import axios from "axios";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import {
    Search,
    MoreHorizontal,
    Loader2,
    ArrowLeft,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminReferrals() {
    const [referrals, setReferrals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/referrals`,
                { withCredentials: true }
            );
            setReferrals(response.data.data);
        } catch (error) {
            console.error("Error fetching referrals:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/referrals/${id}`,
                { status: newStatus },
                { withCredentials: true }
            );
            fetchReferrals();
        } catch (error) {
            console.error("Error updating referral status:", error);
        }
    }

    const filteredReferrals = referrals.filter((referral) => {
        const affiliateName = referral.affiliate_id?.name || "";
        const clientName = referral.project_id?.client_name || "";

        return (
            affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clientName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8 pt-28">
                    <Link to={createPageUrl("AdminPanel")}>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Referrals Management</h1>
                        <p className="text-slate-400">Track and manage project referrals</p>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search affiliate or client..."
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
                                <TableHead className="text-slate-400">Affiliate</TableHead>
                                <TableHead className="text-slate-400">Project / Client</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400">Date</TableHead>
                                <TableHead className="text-right text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredReferrals.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        No referrals found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredReferrals.map((referral) => (
                                    <TableRow key={referral._id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell>
                                            <div className="font-medium">{referral.affiliate_id?.name || "Unknown"}</div>
                                            <div className="text-xs text-slate-400">{referral.affiliate_id?.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{referral.project_id?.project_type || "Project"}</div>
                                            <div className="text-xs text-slate-400">Client: {referral.project_id?.client_name || "Unknown"}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`
                                        ${referral.status === 'converted' ? 'bg-green-500/20 text-green-400' : ''}
                                        ${referral.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                        ${referral.status === 'paid' ? 'bg-blue-500/20 text-blue-400' : ''}
                                        ${referral.status === 'rejected' ? 'bg-red-500/20 text-red-400' : ''}
                                    `}>
                                                {referral.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            {new Date(referral.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                                                    <DropdownMenuItem onClick={() => handleStatusChange(referral._id, 'pending')}>
                                                        Mark as Pending
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(referral._id, 'converted')}>
                                                        Mark as Converted
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(referral._id, 'paid')}>
                                                        Mark as Paid
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(referral._id, 'rejected')} className="text-red-400">
                                                        Reject
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
