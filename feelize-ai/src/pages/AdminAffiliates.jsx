import React, { useState, useEffect } from "react";
import axios from "axios";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import {
    Search,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Loader2,
    ArrowLeft,
    Shield
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminAffiliates() {
    const [affiliates, setAffiliates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchAffiliates();
    }, []);

    const fetchAffiliates = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/affiliates`,
                { withCredentials: true }
            );
            setAffiliates(response.data.data);
        } catch (error) {
            console.error("Error fetching affiliates:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/affiliates/${id}/approve`,
                {},
                { withCredentials: true }
            );
            fetchAffiliates(); // Refresh list
        } catch (error) {
            console.error("Error approving affiliate:", error);
            alert("Failed to approve affiliate");
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/affiliates/${id}`,
                { status: newStatus },
                { withCredentials: true }
            );
            fetchAffiliates();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    const filteredAffiliates = affiliates.filter((affiliate) => {
        const matchesSearch =
            affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affiliate.referral_code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "all" || affiliate.status === filterStatus;

        return matchesSearch && matchesStatus;
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
                        <h1 className="text-3xl font-bold">Affiliates Management</h1>
                        <p className="text-slate-400">Approve and manage partner accounts</p>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <div className="flex gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search name, email, code..."
                                className="pl-9 bg-slate-900 border-slate-800 text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-slate-900 border border-slate-800 rounded-md px-3 text-sm"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-slate-900">
                                <TableHead className="text-slate-400">Name / Email</TableHead>
                                <TableHead className="text-slate-400">Referral Code</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400">Referrals</TableHead>
                                <TableHead className="text-slate-400">Joined</TableHead>
                                <TableHead className="text-right text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredAffiliates.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                        No affiliates found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAffiliates.map((affiliate) => (
                                    <TableRow key={affiliate._id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell>
                                            <div className="font-medium">{affiliate.name}</div>
                                            <div className="text-xs text-slate-400">{affiliate.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="bg-slate-800 px-2 py-1 rounded text-xs font-mono text-indigo-300">
                                                {affiliate.referral_code}
                                            </code>
                                            {affiliate.is_custom_code && (
                                                <Badge variant="outline" className="ml-2 text-[10px] border-indigo-500/30 text-indigo-400">
                                                    Custom
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`
                                        ${affiliate.status === 'active' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : ''}
                                        ${affiliate.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : ''}
                                        ${affiliate.status === 'suspended' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : ''}
                                    `}>
                                                {affiliate.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{affiliate.total_referrals}</TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            {new Date(affiliate.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    {affiliate.status === 'pending' && (
                                                        <DropdownMenuItem
                                                            className="text-green-400 focus:text-green-400 focus:bg-green-400/10 cursor-pointer"
                                                            onClick={() => handleApprove(affiliate._id)}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                                        </DropdownMenuItem>
                                                    )}
                                                    {affiliate.status === 'active' && (
                                                        <DropdownMenuItem
                                                            className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
                                                            onClick={() => handleStatusChange(affiliate._id, 'suspended')}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-2" /> Suspend
                                                        </DropdownMenuItem>
                                                    )}
                                                    {affiliate.status === 'suspended' && (
                                                        <DropdownMenuItem
                                                            className="text-green-400 focus:text-green-400 focus:bg-green-400/10 cursor-pointer"
                                                            onClick={() => handleStatusChange(affiliate._id, 'active')}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Reactivate
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator className="bg-slate-800" />
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        Edit Details
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
