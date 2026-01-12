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
    Shield,
    CircleX,
    LoaderCircle
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
    const [edit, setEdit] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [id, setId] = useState("");
    const [paymentDetails, setPaymentDetails] = useState({});
    const [targetAudience, setTargetAudience] = useState("");
    const paymentChannels = ["Bank Transfer", "UPI", "PayPal"];
    const [noOfReferrals, setNoOfReferrals] = useState(0);
    const [affiliateDetails, setAffiliateDetails] = useState({});

    useEffect(() => {
        fetchAffiliates();
    }, []);

    const fetchAffiliates = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/affiliates`,
                { withCredentials: true }
            );
            console.log(response.data.data);
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

    const HandleSaveChanges = async (id) => {

        // console.log(affiliatePaymentDetails);
        const resp = await axios.patch(
            `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/affiliates/${id}`,
            {
                name,
                email,
                referralCode,
                paymentDetails,
                targetAudience
            },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        if (resp.data.success === true) {

            setIsSaving(false);
        }
        window.location.reload();
    }

    const handleClose = () => {

        if (isSaving === true) {
            setIsSaving(false);
        }
    };

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
                                                    <DropdownMenuItem className="cursor-pointer" onClick={() => {
                                                        setEdit(!edit);
                                                        const parsedPaymentDetails =
                                                            typeof affiliate.payment_details === "string"
                                                                ? JSON.parse(affiliate.payment_details)
                                                                : affiliate.payment_details;

                                                        setPaymentDetails({
                                                            ...parsedPaymentDetails,
                                                            method: parsedPaymentDetails.method?.trim(), // ✅ FIX
                                                        });
                                                        setAffiliateDetails(affiliate);
                                                    }}>
                                                        View/Edit Details
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

            {
                edit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50 w-full py-28 px-14 md:px-0">

                        <div className="bg-slate-900 p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto no-scrollbar">
                            <div className="flex flex-col">

                                <div className="flex flex-row justify-between items-center gap-5 md:gap-20">
                                    <h1 className="text-md md:text-2xl font-bold tracking-wide flex items-center gap-2">
                                        Edit Affiliate
                                    </h1>
                                    <CircleX onClick={() => {
                                        setEdit(!edit)
                                        handleClose();
                                    }} className="hover:text-red-400 text-end md:text-center duration-200" />
                                </div>

                                <div>
                                    <form className="mt-8 flex flex-col gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium tracking-wider">Affiliate Name</label>
                                            <input placeholder={affiliateDetails?.name} className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium">Email Address</label>
                                            <input placeholder={affiliateDetails?.email} className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-not-allowed" disabled={true} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium">Referral Code</label>
                                            <input placeholder={affiliateDetails?.referral_code} className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setReferralCode(e.target.value)} />
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
                                                                readOnly={true}
                                                                type="radio"
                                                                name="paymentMethod"
                                                                value={method}
                                                                checked={paymentDetails?.method === method}
                                                                className="accent-black hover:cursor-not-allowed"
                                                            />
                                                            <span className="text-sm font-light tracking-wide">
                                                                {method}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {
                                                        paymentDetails?.method === "Bank Transfer" &&
                                                        paymentDetails?.details?.trim() !== "" && (
                                                            <div className="flex flex-col gap-2 cursor-not-allowed">
                                                                <label className="text-sm font-medium">Details</label>
                                                                <p className="p-2 border rounded-lg text-sm bg-slate-800 border-slate-700">{paymentDetails.details}</p>
                                                            </div >
                                                        ) ||
                                                        paymentDetails?.method === "UPI" && (
                                                            <input placeholder="UPI ID" className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                        ) ||
                                                        paymentDetails?.method === "PayPal" && (
                                                            <div className="flex flex-col gap-2">
                                                                <input placeholder="PayPal Email" className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                                <input placeholder="Account Name / Phone Number" className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2" />
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium">Target Audience</label>
                                            <p className="p-2 border rounded-lg text-sm bg-slate-800 border-slate-700" disabled={true} >{affiliateDetails?.target_audience}</p>
                                        </div>
                                        <div className="flex flex-row gap-2 items-baseline">
                                            <label className="text-sm font-medium w-[120px]">No.of Refferels</label>
                                            <p className="py-1 px-5 border rounded-lg text-sm bg-slate-800 border-slate-700 max-w-[100px]" disabled={true}>{affiliateDetails.total_referrals}</p>
                                        </div>
                                        <div className="flex flex-row gap-2 items-baseline">
                                            <label className="text-sm font-medium w-[120px]">Total Earnings</label>
                                            <p className="py-1 px-5 border rounded-lg text-sm bg-slate-800 border-slate-700 max-w-[150px]" disabled={true}>{affiliateDetails.total_earnings} $</p>
                                        </div>

                                        <div className="border-b border-slate-700/50"></div>
                                        <div className="flex flex-row justify-center gap-4 items-center pt-9">
                                            {
                                                isSaving === true ? (
                                                    <button className="flex gap-2 items-center bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded-lg">Saving<LoaderCircle size={28} className="animate-spin" /></button>
                                                )
                                                    : isSaving === false ? <Button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setIsSaving(true);
                                                            HandleSaveChanges(affiliateDetails._id);
                                                        }}>Save Changes</Button> : null
                                            }
                                            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                                                setEdit(false)
                                                handleClose();
                                            }}>Close</Button>
                                        </div>
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
