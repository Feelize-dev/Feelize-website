import React, { useState, useEffect } from "react";
import axios from "axios";
import { Affiliate, Referral } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
    DollarSign,
    Users,
    TrendingUp,
    Copy,
    Check,
    Loader2,
    CheckCircle,
    Gift,
    Target,
    ExternalLink,
    Briefcase,
    Calendar,
    Clock
} from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function AffiliateDashboard() {
    const [currentUser, setCurrentUser] = useState(null);
    const [affiliateData, setAffiliateData] = useState(null);
    const [referrals, setReferrals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const { data: user } = useUser();

    useEffect(() => {
        fetchAffiliateData();
    }, []);

    const fetchAffiliateData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/affiliates/me`, { withCredentials: true });
            if (res.data.success) {
                setAffiliateData(res.data.data.affiliate);
                setReferrals(res.data.data.referrals);
                setCurrentUser(res.data.data.affiliate); // Use affiliate profile as current user context for this page
            } else {
                // Not an affiliate or error, redirect to signup
                navigate('/AffiliateSignup');
            }
        } catch (error) {
            console.error("Error fetching affiliate data:", error);
            // If 404 or auth error, redirect to signup
            navigate('/AffiliateSignup');
        } finally {
            setIsLoading(false);
        }
    };

    const copyReferralLink = () => {
        if (!affiliateData) return;
        const link = `${window.location.origin}/${affiliateData.referral_code}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!affiliateData) {
        return null; // or redirecting...
    }

    const referralLink = `${window.location.origin}/${affiliateData.referral_code}`;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 pt-32 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Active Partner
                                </Badge>
                                <span className="text-slate-500 text-sm">Code: <span className="font-mono font-medium text-slate-900">{affiliateData.referral_code}</span></span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Affiliate Dashboard
                            </h1>
                            <p className="text-slate-600 mt-1">
                                Track your referrals, earnings, and performance.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link to={createPageUrl("UserDashboard")}>
                                <Button variant="outline">
                                    User Dashboard
                                </Button>
                            </Link>
                            <Button onClick={() => window.open("mailto:support@feelize.ai")}>
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white shadow-sm border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 text-sm font-medium mb-1">Total Earnings</p>
                                    <p className="text-3xl font-bold text-slate-900">
                                        ${(affiliateData.total_earnings || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 text-sm font-medium mb-1">Pending Payout</p>
                                    <p className="text-3xl font-bold text-slate-900">
                                        ${(affiliateData.pending_earnings || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 text-sm font-medium mb-1">Total Referrals</p>
                                    <p className="text-3xl font-bold text-slate-900">
                                        {affiliateData.total_referrals || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Main Content: Referral Table */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-slate-500" />
                                    Your Referrals & Projects
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {referrals.length === 0 ? (
                                    <div className="p-12 text-center text-slate-500">
                                        <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p className="text-lg font-medium mb-2">No referrals yet</p>
                                        <p className="text-sm">Share your link to start earning commissions!</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
                                                <tr>
                                                    <th className="p-4 pl-6">Client / Project Details</th>
                                                    <th className="p-4">Timeline & Budget</th>
                                                    <th className="p-4">Status</th>
                                                    <th className="p-4 pr-6 text-right">Commission</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {referrals.map((ref) => (
                                                    <tr key={ref._id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="p-4 pl-6 align-top">
                                                            <div className="font-bold text-slate-900 mb-1">
                                                                {ref.project_id?.company_name || ref.project_id?.client_name || 'No Project Started'}
                                                            </div>
                                                            <div className="text-xs text-slate-500 mb-2">
                                                                {ref.referred_user_email}
                                                            </div>
                                                            {ref.project_id?.project_description && (
                                                                <p className="text-slate-600 text-xs line-clamp-2 max-w-xs">
                                                                    {ref.project_id.project_description}
                                                                </p>
                                                            )}
                                                            {ref.project_id?.project_type && (
                                                                <Badge variant="outline" className="mt-2 text-[10px] capitalize">
                                                                    {ref.project_id.project_type.replace(/_/g, ' ')}
                                                                </Badge>
                                                            )}
                                                        </td>
                                                        <td className="p-4 align-top">
                                                            <div className="flex flex-col gap-1 text-xs text-slate-600">
                                                                {ref.project_id?.budget_range && (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <DollarSign className="w-3 h-3 text-slate-400" />
                                                                        <span>{ref.project_id.budget_range.replace(/_/g, ' ')}</span>
                                                                    </div>
                                                                )}
                                                                {ref.project_id?.timeline && (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Clock className="w-3 h-3 text-slate-400" />
                                                                        <span>{ref.project_id.timeline}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1.5">
                                                                    <Calendar className="w-3 h-3 text-slate-400" />
                                                                    <span>{new Date(ref.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-top">
                                                            <Badge className={`
                                ${ref.status === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                                                                    ref.status === 'converted' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                                        'bg-yellow-100 text-yellow-800 border-yellow-200'}
                              `}>
                                                                {ref.status.toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 pr-6 text-right align-top">
                                                            <div className="font-bold text-slate-900">
                                                                {ref.commission_amount ? `$${ref.commission_amount.toLocaleString()}` : '-'}
                                                            </div>
                                                            <div className="text-xs text-slate-500 mt-1">
                                                                {ref.status === 'paid' ? 'Paid' : 'Estimated'}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar: Link & Resources */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Your Referral Link</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 mb-4">
                                    <Input
                                        value={referralLink}
                                        readOnly
                                        className="font-mono text-sm bg-slate-50"
                                    />
                                    <Button
                                        onClick={copyReferralLink}
                                        className="flex-shrink-0"
                                        size="icon"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-sm text-slate-500">
                                    Share this link with potential clients. You'll earn 10% on their project.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-md">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-2">Commission Structure</h3>
                                <div className="text-4xl font-bold mb-1">10%</div>
                                <p className="text-indigo-100 text-sm mb-4">
                                    On every completed project you refer.
                                </p>
                                <div className="space-y-2 text-sm text-indigo-100">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        <span>No cap on earnings</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        <span>Monthly payouts</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">
                                    Resources
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-auto py-3 px-3 hover:bg-slate-50"
                                >
                                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mr-3 text-indigo-600">
                                        <Gift className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-slate-900">Marketing Assets</div>
                                        <div className="text-xs text-slate-500">Download logos & banners</div>
                                    </div>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-auto py-3 px-3 hover:bg-slate-50"
                                >
                                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mr-3 text-indigo-600">
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-slate-900">Promotion Guide</div>
                                        <div className="text-xs text-slate-500">Tips to earn more</div>
                                    </div>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
