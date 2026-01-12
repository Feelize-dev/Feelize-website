 import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { createPageUrl } from "@/utils";
import {
  Users,
  Briefcase,
  TrendingUp,
  Shield,
  Activity,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* 🎨 Accent Color Map (IMPORTANT – fixes Tailwind dynamic class issue) */
const accentMap = {
  emerald: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/40",
    glow: "hover:shadow-emerald-500/30",
  },
  cyan: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/40",
    glow: "hover:shadow-cyan-500/30",
  },
  indigo: {
    bg: "bg-indigo-500/20",
    text: "text-indigo-400",
    border: "border-indigo-500/40",
    glow: "hover:shadow-indigo-500/30",
  },
  orange: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/40",
    glow: "hover:shadow-orange-500/30",
  },
};

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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const menuItems = [
    {
      title: "Affiliates",
      description: "Manage partners, approvals, and payouts",
      icon: Users,
      link: "AdminAffiliates",
      accent: "emerald",
    },
    {
      title: "Referrals",
      description: "Track conversions and commissions",
      icon: TrendingUp,
      link: "AdminReferrals",
      accent: "cyan",
    },
    {
      title: "Projects",
      description: "Oversee all client projects",
      icon: Briefcase,
      link: "AdminProjects",
      accent: "indigo",
    },
    {
      title: "Clients",
      description: "Manage user accounts and history",
      icon: Shield,
      link: "AdminClients",
      accent: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 mt-[130px]">
      <div className="max-w-7xl mx-auto">

        {/* 🔥 Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Overview of platform performance & activity
            </p>
          </div>

          <div className="bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30 flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">
              System Operational
            </span>
          </div>
        </div>

        {/* 🚀 Dashboard Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const styles = accentMap[item.accent];

            return (
              <Card
                key={index}
                className={`
                  relative
                  bg-slate-900/70
                  backdrop-blur-xl
                  border border-white/10
                  rounded-2xl
                  hover:scale-[1.03]
                  hover:shadow-2xl
                  ${styles.glow}
                  transition-all duration-300
                `}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`p-3 rounded-xl ${styles.bg} ring-1 ring-white/10`}
                    >
                      <Icon className={`w-6 h-6 ${styles.text}`} />
                    </div>

                    <span className="text-3xl font-bold text-white">
                      {stats?.[`total${item.title}`] || 0}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-1 text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-6">
                    {item.description}
                  </p>

                  <Link to={createPageUrl(item.link)}>
                    <Button
                      className="
                        w-full
                        bg-gradient-to-r from-indigo-500 to-cyan-500
                        text-white
                        rounded-xl
                        shadow-lg
                        shadow-indigo-500/30
                        hover:shadow-cyan-500/40
                        hover:scale-[1.03]
                        transition-all
                      "
                    >
                      Manage
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 💰 Revenue Card */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-white/10 rounded-2xl shadow-xl shadow-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              Platform Revenue Estimate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold text-emerald-400 drop-shadow-lg">
                ${(stats?.totalRevenue || 0).toLocaleString()}
              </span>
              <span className="text-slate-400">
                total project value
              </span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
