import axios from "axios";


const apiClient = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL ??
    "http://192.168.0.10:3168/api",

  timeout:10000,

});


export default apiClient;