import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function ReferralRedirect() {
    const { referralCode } = useParams();
    const navigate = useNavigate();
    const [isValidating, setIsValidating] = useState(true);

    useEffect(() => {
        const checkReferralCode = async () => {
            if (!referralCode) {
                navigate(createPageUrl("Home"));
                return;
            }

            try {
                // Check if this code exists as an affiliate code
                // We can reuse the check-code endpoint. If available=false, it means the code IS taken (exists), which is what we want here.
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/affiliates/check-code/${referralCode}`
                );

                // available: false means the code exists in the system (is taken by an affiliate)
                if (response.data.available === false) {
                    // Store referral code
                    sessionStorage.setItem("referral_code", referralCode);
                    console.log("Custom referral code captured:", referralCode);

                    // Redirect to Start Project
                    navigate(createPageUrl("StartProject"));
                } else {
                    // Code doesn't exist, treat as 404 or redirect home
                    console.log("Invalid referral code");
                    navigate(createPageUrl("Home"));
                }
            } catch (error) {
                console.error("Error validating referral code:", error);
                navigate(createPageUrl("Home"));
            } finally {
                setIsValidating(false);
            }
        };

        checkReferralCode();
    }, [referralCode, navigate]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <h2 className="text-xl font-semibold">Redirecting...</h2>
            <p className="text-slate-400 mt-2">Checking referral link</p>
        </div>
    );
}
