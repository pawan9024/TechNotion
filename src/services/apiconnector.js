import axios from "axios"

export const axiosInstance = axios.create({});
export const apiConnector = async (method, url , bodyData, headers, params)=>{
    try{
        const response = await axiosInstance({
            method: `${method}`,
            url: `${url}`,
            data: bodyData ? bodyData : null,
            headers : headers ? headers : null,
            params : params ? params : null,
            withCredentials:true,
        });
        return response;
        console.log("response aa rha hai",response);
    }
    catch(error){
        // log the error to understand what's going wrong
        console.error("API ERROR in apiConnector");
        console.log("Message aa tha hai",error.message);
        console.log("Status",error.response?.status);
        console.log("Data",error.response?.data);

        // Forward the error so your calling function 
        throw error
        
    }
}