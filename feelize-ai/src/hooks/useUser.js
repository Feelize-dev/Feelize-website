import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUser = async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_API_ENDPOINT}/user/verifySession`, {
        withCredentials: true
    });
    return res.data.data
};

export function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        retry: false, // don’t retry on 401
    });
}
