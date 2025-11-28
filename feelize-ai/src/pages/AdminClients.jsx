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

export default function AdminClients() {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/clients`,
                { withCredentials: true }
            );
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

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
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
                                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-400">Ban User</DropdownMenuItem>
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
