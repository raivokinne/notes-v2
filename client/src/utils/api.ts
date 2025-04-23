import axios from "axios";
import { storage } from "./storage";

export const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + storage.get<string>("token")
    },
    withCredentials: true
})

