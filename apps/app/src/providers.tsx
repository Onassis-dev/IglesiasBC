import { useQueryStore, useUserStore, useInstallStore } from './lib/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { tsr } from './lib/boilerplate';
import { auth } from './lib/firebase';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { customErrorMap } from '@iglesiasbc/schemas';
import { z } from 'zod';

z.setErrorMap(customErrorMap);

const queryClient = useQueryStore.getState().queryClient;

export function Providers({ children }: { children: React.ReactNode }) {
    const { setUser } = useUserStore();
    const { setDeferredPrompt } = useInstallStore();

    useEffect(() => {
        const handleInstallPrompt = (event: Event) => {
            event.preventDefault();
            if (!/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
            setDeferredPrompt(event);
        };

        window.addEventListener('beforeinstallprompt', handleInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    }, [setDeferredPrompt]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
        return unsubscribe;
    }, [setUser]);

    return (
        <QueryClientProvider client={queryClient}>
            <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
        </QueryClientProvider>
    );
}
