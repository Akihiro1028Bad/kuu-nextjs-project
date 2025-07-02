import axios from 'axios';

// Next.js API用のaxiosインスタンス
const createApiInstance = () => {
    return axios.create({
        baseURL: '/api',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true, // Cookie送信を有効化
    });
};

export async function postJsonLogin(endPoint: string, body: any) {
    const api = createApiInstance();
    try {
        const response = await api.post(endPoint, body);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function postJson(endPoint: string, body: any) {
    const api = createApiInstance();
    try {
        const response = await api.post(endPoint, body);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function getJson(endPoint: string) {
    const api = createApiInstance();
    try {
        const response = await api.get(endPoint);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function putJson(endPoint: string, body: any) {
    const api = createApiInstance();
    try {
        const response = await api.put(endPoint, body);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteJson(endPoint: string) {
    const api = createApiInstance();
    try {
        const response = await api.delete(endPoint);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }
        throw error;
    }
}