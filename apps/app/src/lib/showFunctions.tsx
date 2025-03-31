import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const showError = (err: any) => {
    toast.error(getMessage(err), { icon: <CircleX className="size-5 text-destructive"></CircleX> });
};

export const showPromise = (promise: Promise<any>, success: string, error: any = 'Error', loading: string = 'Cargando...') => {
    error = getMessage(error);
    toast.promise(
        promise,
        {
            success: success,
            loading: loading,
            error: (err) => getMessage(err),
        },
        {
            success: {
                icon: <CircleCheck className="size-5 text-green"></CircleCheck>,
            },
            error: {
                icon: <CircleX className="size-5 text-destructive"></CircleX>,
            },
            loading: {
                icon: <LoaderCircle className="size-5 animate-spin"></LoaderCircle>,
            },
            style: {
                boxShadow: 'none',
                border: '1px solid var(--border)',
                borderRadius: '0.4rem',
            },
        }
    );
};

// extra
function getMessage(obj: any): string {
    if (typeof obj === 'string') return obj;
    if (Object.keys(obj).length === 0) return obj.message || 'Error';
    if (obj.response) return obj.response.data.message;
    return 'Error';
}
