import axios from 'axios';
import { showError } from './showFunctions';
import { useUIStore } from '@/lib/store';
import { contract } from '@iglesiasbc/schemas';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem('userId');
            location.href = '/login?redirect=/';
            return showError(error);
        }
        if (error.response.data.message === 'NOCHURCH') {
            localStorage.removeItem('churchId');
            useUIStore.getState().setRegisterOpen(true);
            return;
        }
        return Promise.reject(error);
    }
);

api.defaults.withCredentials = true;

export const tsr = initTsrReactQuery(contract, {
    baseUrl: import.meta.env.VITE_API_BASE,
    credentials: 'include',
});
