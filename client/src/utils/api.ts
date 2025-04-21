import axios from "axios";
import { storage } from "./storage";

export const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + storage.get<string>("token")
    },
    withCredentials: true
})

