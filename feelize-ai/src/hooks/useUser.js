import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUser = async () => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_SERVER_API_ENDPOINT}/api/users/verify`,
            { withCredentials: true }
        );
        return res.data.data;
    } catch (error) {

        console.log(error);
        return null; // no user session
    }
};

export function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        retry: false, // don’t retry on 401
    });
}
