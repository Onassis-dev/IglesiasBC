import axios from 'axios';
import { showError } from './showFunctions';
import { useUIStore } from '@/lib/store';
import { contract } from '@iglesiasbc/schemas';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { tsRestFetchApi } from '@ts-rest/core';
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
    api: async (args) => {
        const result = await tsRestFetchApi(args);
        if (result.status === 200) return result;

        if (result.status === 401) {
            localStorage.removeItem('userId');
            location.href = '/login?redirect=/';
            showError(result);
        }
        if ((result.body as any).message === 'NOCHURCH') {
            localStorage.removeItem('churchId');
            useUIStore.getState().setRegisterOpen(true);
        }

        return result;
    },
});

interface Result<TResult> {
    status: number;
    body: TResult;
}

interface Mutation<TVariables = any, TResult = any> {
    mutate: (variables: { body: TVariables }) => Promise<Result<TResult>>;
}

export const api2 = async <TVariables, TResult>(mutation: Mutation<TVariables, TResult>, variables: TVariables): Promise<Result<TResult>['body']> => {
    const result = await mutation.mutate({ body: variables });
    if (result.status === 200) return result.body;

    if (result.status === 401) {
        localStorage.removeItem('userId');
        location.href = '/login?redirect=/';
        showError(result);
    }

    if ((result.body as any).message === 'NOCHURCH') {
        localStorage.removeItem('churchId');
        useUIStore.getState().setRegisterOpen(true);
    }

    throw new Error((result.body as any)?.message);
};
