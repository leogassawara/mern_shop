import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/";

// Instance of axios
export const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000
});




// Custom axios instance
export const APIConnector = async ({ method, url, data, headers = {}, token}) => {
  try {
    const response = await apiInstance({
        method,
        url,
        data,
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
    });

    return response
  }
  catch (error) {
    console.log(error)
  }
}