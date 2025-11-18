import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
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
  CheckCircle
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
    why_join: ""
  });
  // const { data: user, isLoading, refetch } = useUser();


  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);

      // Check if already an affiliate
      const affiliates = await base44.entities.Affiliate.filter({ user_email: user.email });
      if (affiliates.length > 0) {
        setExistingAffiliate(affiliates[0]);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReferralCode = (email) => {
    const prefix = email.split('@')[0].toUpperCase().slice(0, 4);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${random}`;
  };

  // const handleSignup = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     const referralCode = generateReferralCode(currentUser.email);

  //     await base44.entities.Affiliate.create({
  //       user_email: currentUser.email,
  //       referral_code: referralCode,
  //       status: "active",
  //       payment_method: formData.payment_method,
  //       payment_details: formData.payment_details,
  //       total_referrals: 0,
  //       total_earnings: 0,
  //       pending_earnings: 0
  //     });

  //     // Reload to show new affiliate
  //     await checkUser();
  //   } catch (error) {
  //     console.error("Error creating affiliate:", error);
  //     alert("Failed to create affiliate account. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const copyReferralLink = () => {
    const link = `${window.location.origin}${createPageUrl("StartProject")}?ref=${existingAffiliate.referral_code}`;
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Gift className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Sign In Required</h2>
            <p className="text-slate-600 mb-6">Please sign in to join our affiliate program</p>
            <Button onClick={handleLogin} className="w-full">
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (existingAffiliate) {
    const referralLink = `${window.location.origin}${createPageUrl("StartProject")}?ref=${existingAffiliate.referral_code}`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12">
        <div className="max-w-6xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active Affiliate
            </Badge>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Affiliate Dashboard</h1>
            <p className="text-slate-600">Share your link and earn 10% commission on every sale</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${(existingAffiliate.total_earnings || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Pending Earnings</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      ${(existingAffiliate.pending_earnings || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Total Referrals</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {existingAffiliate.total_referrals || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={copyReferralLink} className="flex-shrink-0">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-slate-600 text-sm mt-2">
                Your referral code: <span className="font-bold text-indigo-600">{existingAffiliate.referral_code}</span>
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-indigo-600">1</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Share Your Link</h3>
                  <p className="text-slate-600 text-sm">Share your unique referral link with friends, clients, or on social media</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">They Start a Project</h3>
                  <p className="text-slate-600 text-sm">When someone uses your link and starts a project, you get credited</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Earn 10% Commission</h3>
                  <p className="text-slate-600 text-sm">You earn 10% commission on every project they complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <Link to={createPageUrl("UserDashboard")}>
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Signup Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Join Our Affiliate Program</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Earn 10% commission on every project you refer. It's that simple.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">10% Commission</h3>
              <p className="text-slate-600 text-sm">Earn 10% on every project value</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Quick Payouts</h3>
              <p className="text-slate-600 text-sm">Get paid within 30 days of project completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Easy Tracking</h3>
              <p className="text-slate-600 text-sm">Real-time dashboard to track your referrals</p>
            </CardContent>
          </Card>
        </div>

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle>Become an Affiliate</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Method
                </label>
                <Input
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  placeholder="e.g., PayPal, Bank Transfer, Venmo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Details
                </label>
                <Input
                  value={formData.payment_details}
                  onChange={(e) => setFormData({ ...formData, payment_details: e.target.value })}
                  placeholder="Your PayPal email or account details"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Why do you want to join? (Optional)
                </label>
                <Textarea
                  value={formData.why_join}
                  onChange={(e) => setFormData({ ...formData, why_join: e.target.value })}
                  placeholder="Tell us about your network or how you plan to promote Feelize..."
                  className="h-24"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Terms & Conditions</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• You'll earn 10% commission on all referred projects</li>
                  <li>• Commissions are paid 30 days after project completion</li>
                  <li>• Minimum payout threshold is $100</li>
                  <li>• Fraudulent referrals will result in account termination</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Join Affiliate Program
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}