import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const showError = (err: any) => {
    toast.error(getMessage(err), { icon: <CircleX className="size-5 text-destructive"></CircleX> });
};

export const showSuccess = (message: string) => {
    toast.success(message, { icon: <CircleCheck className="size-5 text-green"></CircleCheck> });
};

export const showPromise = (promise: Promise<any>, success: string, loading: string = 'Cargando...') => {
    return toast.promise(
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
