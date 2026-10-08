import axios from 'axios';

const API_URL = 'https://localhost:44326';

const apiUrl = axios.create(
    {
        baseURL: API_URL,
    }
)

const APIMethods = {

    async getData(url) {
        try {
            const response = await apiUrl.get(url);
            return response.data;
        }
        catch (error) {
            console.error("GET Error:", error);
            throw error;
        }
    },

    async postData(url, data) {
        try {
            const response = await apiUrl.post(url, data);
            return response.data;
        }
        catch (error) {
            console.error("POST Error:", error);
            throw error;
        }
    },

    async updateData(url, data) {
        try {
            const response = await apiUrl.put(url, data);
            return response.data;
        }
        catch (error) {
            console.error("PUT Error:", error);
            throw error;
        }
    },

    async deleteData(url) {
        try {
            const response = await apiUrl.delete(url);
            return response.data;
        }
        catch (error) {
            console.error("DELETE Error:", error);
            throw error;
        }
    }
};

export default APIMethods;