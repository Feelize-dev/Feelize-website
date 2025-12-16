import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { createPageUrl } from "@/utils";
import {
    Users,
    Briefcase,
    DollarSign,
    TrendingUp,
    Shield,
    Activity,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPanel() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/admin/dashboard-stats`,
                { withCredentials: true }
            );
            setStats(response.data.data);
        } catch (error) {
            console.error("Error fetching admin stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const menuItems = [
        {
            title: "Affiliates",
            description: "Manage partners, approvals, and payouts",
            icon: Users,
            link: "AdminAffiliates",
            color: "text-green-400",
            bgColor: "bg-green-400/10",
            stat: stats?.totalAffiliates || 0,
            statLabel: "Total Affiliates"
        },
        {
            title: "Referrals",
            description: "Track conversions and commissions",
            icon: TrendingUp,
            link: "AdminReferrals",
            color: "text-blue-400",
            bgColor: "bg-blue-400/10",
            stat: stats?.totalReferrals || 0,
            statLabel: "Total Referrals"
        },
        {
            title: "Projects",
            description: "Oversee all client projects",
            icon: Briefcase,
            link: "AdminProjects",
            color: "text-purple-400",
            bgColor: "bg-purple-400/10",
            stat: stats?.totalProjects || 0,
            statLabel: "Total Projects"
        },
        {
            title: "Clients",
            description: "Manage user accounts and history",
            icon: Shield,
            link: "AdminClients",
            color: "text-orange-400",
            bgColor: "bg-orange-400/10",
            stat: stats?.totalClients || 0,
            statLabel: "Total Clients"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white px-20 py-32">

            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col-reverse md:flex-row md:items-center justify-between py-16 gap-2 md:gap-0">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-slate-400">Overview of platform activity</p>
                    </div>
                    <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">System Operational</span>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    {menuItems.map((item, index) => (
                        <Card key={index} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${item.bgColor}`}>
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <span className="text-2xl font-bold text-white">{item.stat}</span>
                                </div>
                                <h3 className="text-lg font-semibold mb-1 text-white">{item.title}</h3>
                                <p className="text-sm text-slate-400 mb-4">{item.description}</p>
                                <Link to={createPageUrl(item.link)}>
                                    <Button className="w-full border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-200 hover:text-black">
                                        Manage <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activity or Quick Actions could go here */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>Platform Revenue Estimate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-green-400">
                                ${(stats?.totalRevenue || 0).toLocaleString()}
                            </span>
                            <span className="text-slate-400">total project value</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
