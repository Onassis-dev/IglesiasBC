import '@/lib/boilerplate';
import { AppWindow, Box, DollarSign, FileBadge, Inbox, MessageSquareQuote, Presentation, Users2 } from 'lucide-react';
import { tsr } from '@/lib/boilerplate';
import InfoCard from '@/components/common/InfoCard';
import { Link } from 'react-router';

const Dashboard = () => {
    const { data: { body: data } = {} } = tsr.dashboard.getUser.useQuery({
        queryKey: ['user-dashboard'],
    });

    const greeting = new Date().getHours() < 12 ? 'Buenos días' : 'Buenas tardes';

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 pl-0.5">
                {greeting} {data?.userData?.username}
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:gap-4">
                {data?.stats?.members && (
                    <Link to="/members">
                        <InfoCard color="purple" title="Miembros activos" data={data?.stats?.members}>
                            <Users2 />
                        </InfoCard>
                    </Link>
                )}
                {data?.stats?.certificates && (
                    <Link to="/certificates">
                        <InfoCard color="cyan" title="Certificados" data={data?.stats?.certificates}>
                            <FileBadge />
                        </InfoCard>
                    </Link>
                )}
                {/* {data?.stats?.students && (
                    <Link to="/classes">
                        <InfoCard color="blue" title="alumnos" data={data?.stats?.students}>
                            <GraduationCap />
                        </InfoCard>
                    </Link>
                )} */}
                {data?.stats?.balance && (
                    <Link to="/finances">
                        <InfoCard color="green" title="Balance general" data={data?.stats?.balance}>
                            <DollarSign />
                        </InfoCard>
                    </Link>
                )}
                {data?.stats?.inventory && (
                    <Link to="/inventory">
                        <InfoCard color="yellow" title="Total en inventario" data={data?.stats?.inventory}>
                            <Box />
                        </InfoCard>
                    </Link>
                )}
                {data?.stats?.presentations && (
                    <Link to="/presentations">
                        <InfoCard color="pink" title="Presentaciones" data={data?.stats?.presentations}>
                            <Presentation />
                        </InfoCard>
                    </Link>
                )}
                {data?.stats?.blog && (
                    <Link to="/blog">
                        <InfoCard color="orange" title="Visitas al blog" data={data?.stats?.blog}>
                            <MessageSquareQuote />
                        </InfoCard>
                    </Link>
                )}
                {data?.stats?.website && (
                    <Link to="/website">
                        <InfoCard color="gray" title="Visitas a la pagina" data={data?.stats?.website}>
                            <AppWindow />
                        </InfoCard>
                    </Link>
                )}
                {data?.stats && Object.keys(data?.stats).length === 0 && (
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
