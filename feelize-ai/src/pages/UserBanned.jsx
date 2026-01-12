import { useUser } from '@/hooks/useUser';
import { Ban } from 'lucide-react';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function UserBanned() {

    const navigate = useNavigate();
    const { state } = useLocation();

    const { data: user, isLoading, refetch } = useUser();

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div
                className="fixed inset-0 pointer-events-none overflow-hidden"
                style={{ zIndex: 0 }}
            >
                {/* Multiple purple gradient blurs throughout the page */}
                {[
                    { left: "10%", top: "-350px" },
                    { left: "70%", top: "-250px" },
                    { left: "-142px", top: "200px" },
                    { left: "864px", top: "500px" },
                    { left: "191px", top: "100px" },
                    { left: "1226px", top: "300px" },
                    { left: "-142px", top: "2664px" },
                    { left: "864px", top: "3040px" },
                    { left: "191px", top: "1992px" },
                    { left: "1226px", top: "2183px" },
                    { left: "-142px", top: "4774px" },
                    { left: "864px", top: "5150px" },
                    { left: "191px", top: "4102px" },
                    { left: "1226px", top: "4293px" },
                    { left: "-142px", top: "6644px" },
                    { left: "864px", top: "7020px" },
                    { left: "191px", top: "5972px" },
                    { left: "1226px", top: "6163px" },
                ].map((pos, i) => (
                    <div
                        key={i}
                        className="absolute w-[542px] h-[494px] rounded-full blur-[75px]"
                        style={{
                            left: pos.left,
                            top: pos.top,
                            background: "rgba(80, 0, 181, 0.67)",
                            opacity: 0.25,
                        }}
                    />
                ))}
            </div>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">

                {/* Icon */}
                <div className="flex justify-center mb-4 text-red-600">
                    <Ban size={48} />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Account Restricted
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-4">
                    Your account has been temporarily or permanently restricted from accessing this platform.
                </p>

                {/* Reason */}
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium">Reason</p>
                    <p className="text-sm mt-1">{user?.banReason}</p>
                </div>

                {/* Support */}
                <p className="text-sm text-gray-500 mb-6">
                    If you believe this is a mistake, please contact support.
                </p>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={() => {
                            localStorage.clear();
                            navigate("/login");
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition"
                    >
                        Logout
                    </button>

                    <a
                        href="mailto:support@yourapp.com"
                        className="block text-sm text-gray-500 hover:text-gray-700"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    )
}

export default UserBanned