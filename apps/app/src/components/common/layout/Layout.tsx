import { Outlet, useNavigate } from 'react-router';
import DashboardHeader from './DashboardHeader';
import SideBar from './SideBar';
import { useEffect, useState } from 'react';
import WelcomeDialog from '../WelcomeDialog';
import { tsr } from '@/lib/boilerplate';
import { saveUserData } from '@/lib/accountFunctions';
import { useUIStore, useUserStore } from '@/lib/store';
import { Loader, Loader2 } from 'lucide-react';

export const Layout = () => {
    const [forceRefresh, setForceRefresh] = useState(0);
    const navigate = useNavigate();
    const { registerOpen, setRegisterOpen } = useUIStore((state) => state);
    const { user, userLoading } = useUserStore((state) => state);

    async function checkUserData() {
        const { body }: any = await tsr.users.getData.query();

        let changed = false;
        for (const key in body) {
            if (body[key]?.toString() !== localStorage.getItem(key)) changed = true;
        }

        saveUserData(body);
        if (changed) setForceRefresh(1);
    }

    useEffect(() => {
        if (userLoading) return;
        const churchId = localStorage.getItem('churchId');

        if (!user) navigate('/login');
        if (!churchId && user) setRegisterOpen(true);

        checkUserData();
    }, [user]);

    useEffect(() => {
        if (!user && !userLoading) navigate('/login');
    }, [user, userLoading]);

    if (userLoading)
        return (
            <div className="flex justify-center bg-dashboardbg items-center w-full h-screen">
                <Loader className="size-16 animate-spin" strokeWidth={1.2} />
            </div>
        );

    return (
        <>
            <WelcomeDialog open={registerOpen} />
            <SideBar key={forceRefresh} />

            <div className="flex flex-col flex-1 relative w-1 bg-dashboardbg min-h-[100lvh] h-screen">
                <DashboardHeader />
                <main className="mt-14 w-full p-2 xs:p-3 md:p-6 lg:p-10 mx-auto overflow-y-scroll" data-force-refresh={forceRefresh}>
                    <Outlet key={forceRefresh} />
                </main>
            </div>
        </>
    );
};
