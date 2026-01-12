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

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [edit, setEdit] = useState(false);
    

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/projects`,
                { withCredentials: true }
            );
            console.log(response.data.data);
            setProjects(response.data.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProjects = projects.filter((project) => {
        return (
            project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.project_type?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <h1 className="text-3xl font-bold">Projects Management</h1>
                        <p className="text-slate-400">Oversee all client projects</p>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search projects..."
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
                                <TableHead className="text-slate-400">Client</TableHead>
                                <TableHead className="text-slate-400">Type</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400">Budget</TableHead>
                                <TableHead className="text-slate-400">Created</TableHead>
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
                            ) : filteredProjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                        No projects found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProjects.map((project) => (
                                    <TableRow key={project._id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell>
                                            <div className="font-medium">{project.client_name}</div>
                                            <div className="text-xs text-slate-400">{project.client_email}</div>
                                        </TableCell>
                                        <TableCell>{project.project_type}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-slate-700 text-slate-300">
                                                {project.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{project.budget_range || "N/A"}</TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                                                    <DropdownMenuItem onClick={() => { 
                                                        setClientEdit(!edit) 
                                                        setClientName(project.client_name);
                                                        setEmail(project.client_email);
                                                        setReferralCode(project.referral_code);
                                                        setTargetAudience(project.target_audience);
                                                        setId(project._id);
                                                        setPaymentDetails({
                                                            method: project.payment_details?.method || "",
                                                            details: project.payment_details?.details || {},
                                                        });
                                                        setTargetAudience(project.target_audience);
                                                        setCommissionRate(project.commission_rate);
                                                        setTotalReferrals(project.total_referrals);
                                                        setTotalEarnings(project.total_earnings);
                                                        }} >Edit Details</DropdownMenuItem>
                                                    <DropdownMenuItem>View Report</DropdownMenuItem>
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

            {
                edit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50 w-full py-32 px-14 md:px-0">

                        <div className="md:max-w-6xl bg-slate-700 px-12 md:px-24 py-10 rounded-md mx-auto max-h-[90vh] overflow-y-auto no-scrollbar">
                            <div className="felx flex-col">

                                <div className="flex flex-col-reverse md:flex-row justify-evenly md:items-center gap-5 md:gap-20">
                                    <h1 className="text-md md:text-2xl font-bold tracking-wide flex items-center gap-2">
                                        Edit Affiliate -
                                        <span className="underline">
                                            {name}
                                        </span>
                                    </h1>
                                    <CircleX onClick={() => { setEdit(!edit) }} className="hover:text-red-400 text-end md:text-center duration-200" />
                                </div>

                                <div>
                                    <form className="mt-8 flex flex-col gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium">Affiliate Name</label>
                                            <Input placeholder={name} className="placeholder:text-neutral-400/60 focus:border-0 text-black/80" onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium">Email Address</label>
                                            <Input placeholder={email} className="placeholder:text-neutral-400/60 focus:border-0 text-black/80" disabled={true} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium">Referral Code</label>
                                            <Input placeholder={referralCode} className="placeholder:text-neutral-400/60 focus:border-0 text-black/80" onChange={(e) => setReferralCode(e.target.value)} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium">Payment Details</label>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-wrap gap-4">
                                                    {paymentChannels.map((method) => (
                                                        <label
                                                            key={method}
                                                            className="flex items-center gap-2 cursor-pointer"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="paymentMethod"
                                                                value={method}
                                                                checked={paymentDetails.method === method}
                                                                onChange={() =>
                                                                    setPaymentDetails({
                                                                        ...paymentDetails,
                                                                        method,
                                                                    })
                                                                }
                                                                className="accent-black cursor-pointer"
                                                            />
                                                            <span className="text-sm font-light tracking-wide">
                                                                {method}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-sm font-medium">Details</label>
                                                    {
                                                        paymentDetails.method === "Bank Transfer" && (
                                                            <div className="flex flex-col gap-2">
                                                                <Input placeholder="Account Number" className="placeholder:text-neutral-400/60 focus:border-0 text-black/80" />
                                                                <Input placeholder="Account Holder Name" className="placeholder:text-neutral-400/60 focus:border-0 text-black/80 mt-2" />
                                                            </div >
                                                        ) ||
                                                        paymentDetails.method === "UPI" && (
                                                            <Input placeholder="UPI ID" className="placeholder:text-neutral-400/60 focus:border-0 text-black/80" />
                                                        ) ||
                                                        paymentDetails.method === "PayPal" && (
                                                            <div className="flex flex-col gap-2">
                                                                <Input placeholder="PayPal Email" className="placeholder:text-neutral-400/60 focus:border-0 text-black/80" />
                                                                <Input placeholder="Account Name / Phone Number" className="placeholder:text-neutral-400/60 focus:border-0 text-black/80 mt-2" />
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium">Target Audience</label>
                                            <Input placeholder={targetAudience} className="placeholder:text-neutral-400/60 focus:border-0 text-black/80" disabled={true} />
                                        </div>
                                        <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-sm py-2" onClick={(e) => {
                                            e.preventDefault();
                                            HandleSaveChanges(id)
                                            setEdit(!edit);
                                        }}>
                                            Save Changes
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div >
                )
            }

        </div>
    );
}
