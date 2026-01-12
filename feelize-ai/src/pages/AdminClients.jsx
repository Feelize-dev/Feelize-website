import React, { useState, useEffect } from "react";
import axios from "axios";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import {
    Search,
    MoreHorizontal,
    Loader2,
    ArrowLeft,
    CircleX,
    User,
    Shield,
    LoaderCircle,
    Asterisk,
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

export default function AdminClients() {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [edit, setEdit] = useState(false);
    const [banUser, setBanUser] = useState(false);
    const [clientDetails, setClientDetails] = useState({});
    const accessLevel = ["junior", "lead"];
    const [access_level, setAccess_level] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const ban = ["Spamming", "Inappropriate Behavior", "Violation of Terms"];
    const [banReason, setBanReason] = useState("");
    const [banReport, setBanReport] = useState(null);
    const [isBanning, setIsBanning] = useState(false);
    const [checked, setChecked] = useState(clientDetails?.isBanned);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/clients`,
                { withCredentials: true }
            );
            console.log(response.data.data);

            setClients(response.data.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredClients = clients.filter((client) => {
        return (
            client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleSubmit = async (id) => {

        try {

            const resp = await axios.patch(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/clients/${id}`,
                {
                    access_level: access_level,
                    name: name,
                    isBanned: checked
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (resp.data.success === true) {

                setIsSaving(false);
                setEdit(false);
            }
            setIsEdit(!isEdit)
            window.location.reload();

        } catch (error) {

            console.log(error);
        }
    }

    const handleClose = () => {

        if (isSaving === true) {
            setIsSaving(false);
        }
        setChecked(clientDetails.isBanned);
        setIsEdit(false)
    };

    const handleBanUser = async (id) => {

        const isBanned = true;
        console.log(id);


        if (banReason === "") {
            alert("Please select a reason for banning the user.");
            setIsBanning(false);
            return;
        }
        try {

            const resp = await axios.patch(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/clients/ban/${id}`,
                {
                    isBanned: isBanned,
                    banReason: banReason,
                    banTime: new Date(),
                    banReport: banReport
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (resp.data.success === true) {
                handleCloseBanModal();
                setIsBanning(false);
                window.location.reload();
            }
        } catch (error) {

            console.log(error);
        }
    }

    const handleCloseBanModal = () => {
        setIsBanning(false);
        setBanUser(false);
        setBanReason("");
    };

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
                        <h1 className="text-3xl font-bold">Clients Management</h1>
                        <p className="text-slate-400">Manage user accounts</p>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search users..."
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
                                <TableHead className="text-slate-400">Name</TableHead>
                                <TableHead className="text-slate-400">Email</TableHead>
                                <TableHead className="text-slate-400">Role</TableHead>
                                <TableHead className="text-slate-400">Joined</TableHead>
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
                            ) : filteredClients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        No clients found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredClients.map((client) => (
                                    <TableRow key={client._id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell className="font-medium">{client.name}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-slate-700 text-slate-300">
                                                {client.access_level || "User"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            {new Date(client.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                                                    {
                                                        client.isBanned ? (
                                                            <DropdownMenuItem className="text-green-400 cursor-not-allowed">User Banned</DropdownMenuItem>
                                                        ) : <DropdownMenuItem
                                                            onClick={() => {
                                                                setBanUser(!banUser)
                                                                setClientDetails(client)
                                                            }}
                                                            className="text-red-400">Ban User</DropdownMenuItem>
                                                    }
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setEdit(!edit);
                                                            setClientDetails(client)
                                                        }}

                                                    >View / Edit Details</DropdownMenuItem>
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
                banUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-slate-900 p-6 rounded-lg w-64 md:w-96">
                            <h2 className="text-2xl font-bold mb-4 text-red-500">Ban User</h2>
                            <p className="mb-4">Are you sure you want to ban this user -<span className="text-blue-300 underline cursor-pointer">{clientDetails?.name}.</span></p>
                            <div className="flex flex-col gap-4 mb-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="banReason" className="flex items-center">Ban Reason <Asterisk size={15} className="text-red-500" /></label>
                                    <p className="italic text-xs text-gray-500">select one of the reasons for banning this user</p>
                                    <select
                                        id="banReason"
                                        value={banReason}
                                        onChange={(e) => setBanReason(e.target.value)}
                                        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required={true}
                                    >
                                        <option value="" disabled hidden>
                                            Select One
                                        </option>
                                        {ban.map((level) => (
                                            <option key={level} value={level}>
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="upload">Comprehensive - Ban Report</label>
                                    <textarea name="" id="" cols={50} rows={4} className="rounded-sm bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                                    <input
                                        type="file"
                                        id="upload"
                                        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => setBanReport(e.target.files[0])} />
                                </div>
                            </div>
                            <div className="flex justify-center gap-4">
                                <Button className="bg-blue-500 hover:bg-blue-700" onClick={() => handleCloseBanModal()}>Cancel</Button>
                                {
                                    isBanning === true ? (
                                        <button className="flex gap-2 items-center bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg">Banning<LoaderCircle size={28} className="animate-spin" /></button>
                                    )
                                        : isBanning === false ? (
                                            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                                                setIsBanning(true);
                                                handleBanUser(clientDetails?._id);
                                            }}>Confirm Ban</Button>
                                        ) : null
                                }
                            </div>
                        </div>
                    </div>
                )
            }

            {
                edit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-5 md:px-0 pt-24 md:pt-0">
                        <div className="bg-slate-900 p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
                            <div className="flex flex-row justify-between items-center gap-5 md:gap-20">
                                <h2 className="text-2xl font-bold mb-4">Edit Client Details</h2>
                            </div>
                            <div className="flex flex-col gap-4">

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="Name">Name</label>
                                    <input
                                        type="text"
                                        placeholder={clientDetails?.name}
                                        id="Name"
                                        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => {
                                            setName(e.target.value)
                                        }} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="Email">Email-ID</label>
                                    <input type="text" placeholder={clientDetails?.email} id="Email" className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-not-allowed" disabled={true} />
                                </div>

                                <div className="flex flex-col gap-2">

                                    <label htmlFor="AccessLevel">Access Level</label>
                                    <div className="flex flex-row gap-3">

                                        <span className="flex flex-row gap-3 items-center p-2 bg-slate-500/60 rounded w-max">
                                            {
                                                clientDetails.access_level === "lead" ? (
                                                    <div className="flex flex-row items-center gap-2">
                                                        <Shield className="w-4 h-4 text-yellow-400" />
                                                        <p>{clientDetails?.access_level}</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-row items-center gap-2">
                                                        <User className="w-4 h-4 text-green-400" />
                                                        <p>{clientDetails?.access_level}</p>
                                                    </div>
                                                )
                                            }
                                        </span>

                                        {
                                            !isEdit ? (
                                                <button className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded" onClick={() => setIsEdit(!isEdit)}>Change</button>
                                            ) : (
                                                <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white" onClick={() => {
                                                    setAccess_level("")
                                                    setIsEdit(!isEdit)
                                                }}>Cancel</button>
                                            )
                                        }
                                    </div>

                                    {
                                        isEdit && (
                                            <select
                                                id="AccessLevel"
                                                value={access_level}
                                                onChange={(e) => setAccess_level(e.target.value)}
                                                className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="" disabled hidden>
                                                    Select One
                                                </option>
                                                {accessLevel.map((level) => (
                                                    <option key={level} value={level}>
                                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        )
                                    }

                                </div>

                                {
                                    clientDetails.isBanned ? (
                                        <div className="grid justify-start gap-3 items-center">
                                            <p>
                                                User was banned on{" "}
                                                <span>{clientDetails?.banTime.replace("T", " ").split(".")[0]}</span>
                                            </p>

                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={checked}
                                                    onChange={() => {
                                                        setChecked(!checked);
                                                        console.log(checked);
                                                    }}
                                                />

                                                <div className="relative w-9 h-5 bg-gray-400 peer-focus:outline-none peer-focus:ring-40 rounded-full peer
                                                                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                                                after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                                                                peer-checked:after:translate-x-full
                                                                peer-checked:bg-green-500">
                                                </div>

                                                <span className="ml-3 text-sm font-medium text-slate-300">
                                                    Admit User
                                                </span>
                                            </label>
                                        </div>

                                    ) : null
                                }

                            </div>
                            <div className="border-b border-slate-700/50 py-4"></div>
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
                                                setAccess_level("")
                                                handleSubmit(clientDetails._id);
                                            }}>Save Changes</Button> : null
                                }
                                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                                    setEdit(false)
                                    setAccess_level("")
                                    handleClose();
                                }}>Close</Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
