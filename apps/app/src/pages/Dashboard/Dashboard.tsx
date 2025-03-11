import '@/lib/boilerplate';
import { AppWindow, Box, DollarSign, Inbox, MessageSquareQuote, Users2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/boilerplate';
import { saveUserData } from '@/lib/accountFunctions';
import InfoCard from '@/components/common/InfoCard';

const Dashboard = () => {
    const [stats, setStats] = useState<Record<string, any>>([]);
    const [userName, setUserName] = useState('');
    const [greeting, setGreeting] = useState('Buenas tardes');

    useEffect(() => {
        fetchData();
        updateGreeting();
    }, []);

    const fetchData = async () => {
        const result = (await api.get('/dashboard/user')).data;
        saveUserData(result.userData);
        setStats(result.stats || []);
        setUserName(result.userData.username || '');
    };

    const updateGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setGreeting('Buenos días');
        } else {
            setGreeting('Buenas tardes');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 pl-0.5">
                {greeting} {userName}
            </h2>
            <div className="grid grid-cols-1 gap-6">
                {stats.members && (
                    <a href="/members">
                        <InfoCard color="purple" title="Miembros activos" data={stats.members}>
                            <Users2 />
                        </InfoCard>
                    </a>
                )}
                {/* {stats.certificates && (
                    <a href="/certificates">
                        <InfoCard color="cyan" title="Total de certificados" data={stats.certificates}>
                            <FileBadge />
                        </InfoCard>
                    </a>
                )}
                {stats.students && (
                    <a href="/classes">
                        <InfoCard color="blue" title="Total de alumnos" data={stats.students}>
                            <GraduationCap />
                        </InfoCard>
                    </a>
                )} */}
                {stats.balance && (
                    <a href="/finances">
                        <InfoCard color="green" title="Balance general" data={stats.balance}>
                            <DollarSign />
                        </InfoCard>
                    </a>
                )}
                {stats.inventory && (
                    <a href="/inventory">
                        <InfoCard color="yellow" title="Total en inventario" data={stats.inventory}>
                            <Box />
                        </InfoCard>
                    </a>
                )}
                {stats.blog && (
                    <a href="/blog">
                        <InfoCard color="orange" title="Total de visitas al blog" data={stats.blog}>
                            <MessageSquareQuote />
                        </InfoCard>
                    </a>
                )}
                {stats.website && (
                    <a href="/website">
                        <InfoCard color="gray" title="Total de visitas a la pagina" data={stats.website}>
                            <AppWindow />
                        </InfoCard>
                    </a>
                )}
                {Object.keys(stats).length === 0 && (
                    <div className="w-full justify-center flex flex-col items-center text-muted-foreground mt-48">
                        <Inbox strokeWidth={1} className="size-20 mb-4" />
                        <span className="font-medium max-w-md text-center">
                            No tienes acceso a ningún módulo de tu iglesia, pide a tu pastor que actualice tus accesos
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
