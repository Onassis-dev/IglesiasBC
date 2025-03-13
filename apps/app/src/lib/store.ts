import { keepPreviousData, QueryClient } from '@tanstack/react-query';
import { create } from 'zustand';

interface UIState {
    menuOpen: boolean;
    registerOpen: boolean;
    planUpgradeOpen: boolean;
    setMenuOpen: (isOpen: boolean) => void;
    setRegisterOpen: (isOpen: boolean) => void;
    setPlanUpgradeOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    menuOpen: false,
    registerOpen: false,
    planUpgradeOpen: false,
    setMenuOpen: (isOpen) => set({ menuOpen: isOpen }),
    setRegisterOpen: (isOpen) => set({ registerOpen: isOpen }),
    setPlanUpgradeOpen: (isOpen) => set({ planUpgradeOpen: isOpen }),
}));

interface QueryState {
    queryClient: QueryClient;
}

export const useQueryStore = create<QueryState>(() => ({
    queryClient: new QueryClient({
        defaultOptions: {
            queries: {
                placeholderData: keepPreviousData,
            },
        },
    }),
}));

interface PathState {
    path: string;
    setPath: (path: string) => void;
}

export const usePathStore = create<PathState>((set) => ({
    path: '',
    setPath: (path) => set({ path }),
}));
