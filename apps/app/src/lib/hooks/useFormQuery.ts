import { useState, useEffect } from 'react';

type Query<TProps, TResult> = (props: TProps) => { data?: { body?: TResult } };

export const useFormQuery = <TProps, TResult>(query: Query<TProps, TResult>, props: TProps & { enabled: boolean }): Record<string, any> | null => {
    const { data } = query(props);
    const [result, setResult] = useState<Record<string, any> | null>(props.enabled ? (data?.body ?? null) : null);

    useEffect(() => {
        if (!props.enabled) {
            setResult(null);
        } else {
            setResult(data?.body ?? null);
        }
    }, [props.enabled, data]);

    return result;
};
