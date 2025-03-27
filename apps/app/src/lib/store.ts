import { keepPreviousData, QueryClient } from '@tanstack/react-query';
import { User } from 'firebase/auth';
import { create } from 'zustand';

interface UIState {
    menuOpen: boolean;
    registerOpen: boolean;
    planUpgradeOpen: boolean;
    accountDialogOpen: boolean;
    setMenuOpen: (isOpen: boolean) => void;
    setRegisterOpen: (isOpen: boolean) => void;
    setPlanUpgradeOpen: (isOpen: boolean) => void;
    setAccountDialogOpen: (isOpen: boolean) => void;
}

interface userState {
    user: User | null;
    userLoading: boolean;
    setUser: (user: User | null) => void;
}
export const useUserStore = create<userState>((set) => ({
    user: null,
    userLoading: true,
    setUser: (user) => {
        set({ user, userLoading: false });
    },
}));

export const useUIStore = create<UIState>((set) => ({
    menuOpen: false,
    registerOpen: false,
    planUpgradeOpen: false,
    accountDialogOpen: false,
    setMenuOpen: (isOpen) => set({ menuOpen: isOpen }),
    setRegisterOpen: (isOpen) => set({ registerOpen: isOpen }),
    setPlanUpgradeOpen: (isOpen) => set({ planUpgradeOpen: isOpen }),
    setAccountDialogOpen: (isOpen) => set({ accountDialogOpen: isOpen }),
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
