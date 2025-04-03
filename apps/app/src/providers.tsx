import { useQueryStore, useUserStore, useInstallStore } from './lib/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { tsr } from './lib/boilerplate';
import { auth } from './lib/firebase';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

const queryClient = useQueryStore.getState().queryClient;

export function Providers({ children }: { children: React.ReactNode }) {
    const { setUser } = useUserStore();
    const { setDeferredPrompt } = useInstallStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
        return unsubscribe;
    }, []);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
        });
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
        </QueryClientProvider>
    );
}
