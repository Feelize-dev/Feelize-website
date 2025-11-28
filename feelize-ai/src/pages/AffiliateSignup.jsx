import React, { useState, useEffect } from "react";
import axios from "axios";
import { Affiliate, User, Referral } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  DollarSign,
  Users,
  TrendingUp,
  Award,
  Copy,
  Check,
  Loader2,
  Sparkles,
  ArrowRight,
  Gift,
  Target,
  Zap,
  CheckCircle,
} from "lucide-react";

export default function AffiliateSignup() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingAffiliate, setExistingAffiliate] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    payment_method: "",
    payment_details: "",
    why_join: "",
  });
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    if (existingAffiliate?._id) {
      const fetchReferrals = async () => {
        try {
          const res = await Referral.filter({ affiliate_id: existingAffiliate._id });
          if (res.success && res.data) {
            setReferrals(res.data);
          }
        } catch (err) {
          console.error("Failed to fetch referrals:", err);
        }
      };
      fetchReferrals();
    }
  }, [existingAffiliate]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      if (user) {
        // Check if already an affiliate
        const response = await Affiliate.filter({ email: user.email });
        if (response.data && response.data.length > 0) {
          setExistingAffiliate(response.data[0]);
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const user = await User.login();
      if (user) {
        setCurrentUser(user);
        checkUser();
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const [customCode, setCustomCode] = useState("");
  const [isCustomCodeAvailable, setIsCustomCodeAvailable] = useState(null);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [useCustomCode, setUseCustomCode] = useState(false);

  // ... existing useEffect ...

  const checkCodeAvailability = async (code) => {
    if (!code || code.length < 4) {
      setIsCustomCodeAvailable(null);
      return;
    }
    setIsCheckingCode(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/affiliates/check-code/${code}`
      );
      setIsCustomCodeAvailable(response.data.available);
    } catch (error) {
      console.error("Error checking code:", error);
      setIsCustomCodeAvailable(false);
    } finally {
      setIsCheckingCode(false);
    }
  };

  const handleCodeChange = (e) => {
    const code = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setCustomCode(code);
    if (code.length >= 4) {
      // Debounce check could be added here, but for now we'll check on blur or after a delay
      // Simple delay for now
      setTimeout(() => checkCodeAvailability(code), 500);
    } else {
      setIsCustomCodeAvailable(null);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use custom code if selected and available, otherwise generate one
      let finalReferralCode = null;
      if (useCustomCode && customCode && isCustomCodeAvailable) {
        finalReferralCode = customCode;
      }

      await Affiliate.create({
        name: currentUser.displayName || currentUser.email.split("@")[0],
        email: currentUser.email,
        referral_code: finalReferralCode, // Backend handles generation if null
        status: "pending", // Changed to pending for approval workflow
        payment_method: formData.payment_method,
        payment_details: formData.payment_details,
        why_join: formData.why_join,
        total_referrals: 0,
        total_earnings: 0,
        pending_earnings: 0,
      });

      // Reload to show new affiliate
      await checkUser();
    } catch (error) {
      console.error("Error creating affiliate:", error);
      const errorMessage =
        error.response?.data?.message || // Changed to message to match backend
        error.message ||
        "Failed to create affiliate account.";

      if (
        errorMessage.includes("E11000") ||
        errorMessage.includes("duplicate key")
      ) {
        alert("You are already an affiliate! Refreshing...");
        await checkUser();
      } else {
        alert(`Error: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}${createPageUrl(
      "StartProject"
    )}?ref=${existingAffiliate.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // DASHBOARD VIEW (For Existing Affiliates)
  // ----------------------------------------------------------------------
  if (existingAffiliate) {
    const referralLink = `${window.location.origin}${createPageUrl(
      "StartProject"
    )}?ref=${existingAffiliate.referral_code}`;

    return (
      <div className="min-h-screen bg-slate-50">
        {/* Dashboard Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge className="bg-green-100 text-green-800 mb-2 hover:bg-green-100">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active Affiliate
                </Badge>
                <h1 className="text-2xl font-bold text-slate-900">
                  Affiliate Dashboard
                </h1>
                <p className="text-slate-600">
                  Welcome back, {existingAffiliate.name || "Partner"}
                </p>
              </div>
              <Link to={createPageUrl("UserDashboard")}>
                <Button variant="outline" size="sm">
                  Back to App
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">
                      Total Earnings
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      $
                      {(existingAffiliate.total_earnings || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">
                      Pending Payout
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      $
                      {(
                        existingAffiliate.pending_earnings || 0
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">
                      Total Referrals
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {existingAffiliate.total_referrals || 0}
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
            {/* Main Content - Link & Resources */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
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
                    >
                      {copied ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <div className="bg-indigo-50 text-indigo-900 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-1">💡 Pro Tip:</p>
                    Share this link on social media, your blog, or directly with
                    clients. You'll earn commission when they start a project.
                  </div>
                </CardContent>
              </Card>

              {/* Recent Referrals List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  {referrals.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                      <div className="text-center text-slate-500">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No referrals yet. Share your link to get started!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {referrals.map((ref) => (
                        <div key={ref._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div>
                            <p className="font-medium text-slate-900">{ref.referred_user_email}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(ref.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={
                            ref.status === 'paid' ? 'bg-green-100 text-green-800' :
                              ref.status === 'converted' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                          }>
                            {ref.status.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                    <div className="text-center text-slate-500">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Chart data will appear here once you have activity</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Quick Actions & Info */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Commission Rate</h3>
                  <div className="text-4xl font-bold mb-1">10%</div>
                  <p className="text-indigo-100 text-sm">
                    On every completed project
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto py-3"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                      <Gift className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-900">
                        Marketing Assets
                      </div>
                      <div className="text-xs text-slate-500">
                        Logos, banners, and copy
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto py-3"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                      <Target className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-900">
                        Guide to Promoting
                      </div>
                      <div className="text-xs text-slate-500">
                        Tips to earn more
                      </div>
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

  // ----------------------------------------------------------------------
  // MARKETING LANDING PAGE (For Non-Affiliates)
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 text-center">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mb-6 hover:bg-indigo-500/30 px-4 py-1.5 text-sm">
            🚀 Join the Feelize Partner Program
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Earn{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              10% Commission
            </span>
            <br />
            On Every Project.
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Partner with Feelize AI and turn your network into revenue. Help
            creators and businesses build amazing AI projects while you earn
            passive income.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-white text-slate-900 hover:bg-slate-100"
              onClick={() =>
                document
                  .getElementById("join-form")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Start Earning Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg border-slate-700 text-white hover:bg-slate-800 hover:text-white"
              onClick={() => window.open("https://feelize.ai", "_blank")}
            >
              Learn about Feelize
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-slate-400 text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> No Cap on
              Earnings
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> Monthly Payouts
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> Real-time
              Tracking
            </div>
          </div>
        </div>
      </div>

      {/* Stats / Social Proof */}
      <div className="border-b border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <p className="text-center text-slate-500 text-sm font-semibold uppercase tracking-wider mb-8">
            Trusted by creators and agencies worldwide
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos */}
            <div className="text-xl font-bold text-slate-400">TechStart</div>
            <div className="text-xl font-bold text-slate-400">CreativeFlow</div>
            <div className="text-xl font-bold text-slate-400">AgencyOne</div>
            <div className="text-xl font-bold text-slate-400">DevStudio</div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Partner with Feelize?
            </h2>
            <p className="text-lg text-slate-600">
              We provide the tools, you bring the network. It's a partnership
              designed for your success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg shadow-slate-200/50">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                  <DollarSign className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Generous Commissions
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Earn a flat 10% commission on every project started through
                  your link. High ticket projects mean high payouts for you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg shadow-slate-200/50">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  High Conversion Rate
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Our AI-powered platform solves real problems, making it an
                  easy sell for agencies, developers, and businesses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg shadow-slate-200/50">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  30-Day Cookie Life
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  We track visitors for 30 days. If they convert anytime within
                  that window, you get the credit.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Three simple steps to start earning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-10"></div>

            <div className="text-center">
              <div className="w-24 h-24 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="text-3xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Join the Program
              </h3>
              <p className="text-slate-600">
                Sign up in seconds. It's free and easy to get started.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="text-3xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Share Your Link
              </h3>
              <p className="text-slate-600">
                Promote Feelize to your audience using your unique referral
                link.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="text-3xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Get Paid
              </h3>
              <p className="text-slate-600">
                Earn 10% commission for every successful project referral.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Signup / Login Section */}
      <div id="join-form" className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to start earning?
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                Join hundreds of other affiliates who are monetizing their
                network with Feelize AI.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span>Instant access to affiliate dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span>Marketing materials included</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span>Dedicated support team</span>
                </li>
              </ul>
            </div>

            <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl">
              {!currentUser ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <img
                      src="../../favicon.svg"
                      alt="Feelize Logo"
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Sign In Required</h3>
                  <p className="text-slate-600 mb-8">
                    Please sign in or create an account to join the affiliate
                    program.
                  </p>
                  <Button
                    onClick={handleLogin}
                    size="lg"
                    className="w-full text-lg h-12"
                  >
                    Sign In / Sign
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold">
                      Complete Your Profile
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Tell us how you'd like to be paid
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Payment Method
                    </label>
                    <Input
                      value={formData.payment_method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_method: e.target.value,
                        })
                      }
                      placeholder="e.g., PayPal, Bank Transfer"
                      required
                      className="bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Payment Details
                    </label>
                    <Input
                      value={formData.payment_details}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_details: e.target.value,
                        })
                      }
                      placeholder="email@example.com"
                      required
                      className="bg-slate-50"
                    />
                  </div>

                  {/* Custom Referral Code Section */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        id="useCustomCode"
                        checked={useCustomCode}
                        onChange={(e) => setUseCustomCode(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <label htmlFor="useCustomCode" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
                        I want a custom referral code
                      </label>
                    </div>

                    {useCustomCode && (
                      <div className="space-y-2">
                        <label className="block text-xs text-slate-500">
                          Choose your code (4-12 characters, letters & numbers only)
                        </label>
                        <div className="relative">
                          <Input
                            value={customCode}
                            onChange={handleCodeChange}
                            placeholder="e.g. JOHNSMITH"
                            maxLength={12}
                            className={`uppercase font-mono ${isCustomCodeAvailable === true ? "border-green-500 focus:ring-green-500" :
                              isCustomCodeAvailable === false ? "border-red-500 focus:ring-red-500" : ""
                              }`}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isCheckingCode ? (
                              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                            ) : isCustomCodeAvailable === true ? (
                              <span className="text-green-600 text-xs font-bold flex items-center">
                                <Check className="w-3 h-3 mr-1" /> Available
                              </span>
                            ) : isCustomCodeAvailable === false ? (
                              <span className="text-red-600 text-xs font-bold">
                                Taken
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      How will you promote us? (Optional)
                    </label>
                    <Textarea
                      value={formData.why_join}
                      onChange={(e) =>
                        setFormData({ ...formData, why_join: e.target.value })
                      }
                      placeholder="I have a blog about AI tools..."
                      className="h-24 bg-slate-50"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      "Join Program"
                    )}
                  </Button>

                  <p className="text-xs text-center text-slate-400 mt-4">
                    By joining, you agree to our Affiliate Terms & Conditions.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
