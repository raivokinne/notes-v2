import axios from "axios";
import toast from "react-hot-toast";

export const csrf = async() => {
    try {
        await axios.get("http://localhost:8000/sanctum/csrf-cookie");
    } catch (error) {
        toast.error("Failed to get csrf token")
        console.error(error)
    }
}