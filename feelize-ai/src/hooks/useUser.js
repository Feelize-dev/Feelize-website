import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUser = async () => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/users/verify`,
            { withCredentials: true }
        );
        // Ensure we always return a value, even if data is undefined
        return res.data?.data ?? null;
    } catch (error) {
        console.log("Error fetching user:", error);
        // Explicitly return null for no user session
        return null;
    }
};

export function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        retry: false, // don’t retry on 401
    });
}
