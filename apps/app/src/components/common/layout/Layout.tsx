import { Outlet, useNavigate } from 'react-router';
import DashboardHeader from './DashboardHeader';
import SideBar from './SideBar';
import { useEffect, useState } from 'react';
import WelcomeDialog from '../WelcomeDialog';
import { api } from '@/lib/boilerplate';
import { saveUserData } from '@/lib/accountFunctions';

export const Layout = () => {
    const [isChecking, setIsChecking] = useState(false);
    const [openChurchMessage, setOpenChurchMessage] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(0);
    const navigate = useNavigate();

    async function checkUserData() {
        const newData = (await api.get('/users/data')).data;

        let changed = false;
        for (const key in newData) {
            if (newData[key]?.toString() !== localStorage.getItem(key)) changed = true;
        }

        saveUserData(newData);
        if (changed) setForceRefresh(1);
    }

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const churchId = localStorage.getItem('churchId');
        if (!userId) navigate('/login');
        if (!churchId && userId) setOpenChurchMessage(true);
        setIsChecking(false);

        checkUserData();
    }, []);

    if (isChecking) return null;

    return (
        <>
            <WelcomeDialog open={openChurchMessage} />
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
