import { Outlet, useNavigate } from 'react-router';
import DashboardHeader from './DashboardHeader';
import SideBar from './SideBar';
import { useEffect, useState } from 'react';
import WelcomeDialog from '../WelcomeDialog';
import { tsr } from '@/lib/boilerplate';
import { saveUserData } from '@/lib/accountFunctions';
import { useUIStore, useUserStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

export const Layout = () => {
    const navigate = useNavigate();
    const { setRegisterOpen } = useUIStore((state) => state);
    const { user, userLoading } = useUserStore((state) => state);
    const [loading, setLoading] = useState(true);

    async function checkUserData() {
        const { body }: any = await tsr.users.getData.query();

        saveUserData(body);
        if (!body.churchId) setRegisterOpen(true);
        setLoading(false);
    }

    useEffect(() => {
        if (userLoading) return;
        if (!user) {
            localStorage.clear();
            navigate('/login');
            return;
        }
        checkUserData();
    }, [user, userLoading]);

    if (loading)
        return (
            <div className="flex justify-center items-center bg-dashboardbg w-full h-screen">
                <Loader2 className="size-16 animate-spin" strokeWidth={1.2} />
            </div>
        );

    return (
        <>
            <WelcomeDialog />
            <SideBar />

            <div className="flex flex-col flex-1 relative w-1 bg-dashboardbg min-h-[100lvh] h-screen">
                <DashboardHeader />
                <main className="mt-14 w-full p-2 xs:p-3 md:p-6 lg:p-10 mx-auto overflow-y-scroll">
                    <Outlet />
                </main>
            </div>
        </>
    );
};
