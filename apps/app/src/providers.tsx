import { useQueryStore } from './lib/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { tsr } from './lib/boilerplate';

const queryClient = useQueryStore.getState().queryClient;

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
        </QueryClientProvider>
    );
}
