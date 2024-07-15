import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
})

export const getData = async () => {
    try {
        const response = await api.get('/your-endpoint')
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// 其他API
