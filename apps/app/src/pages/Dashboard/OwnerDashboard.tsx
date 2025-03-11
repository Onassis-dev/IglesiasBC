import '@/lib/boilerplate';
import { type ChartConfig } from '@/components/ui/chart';
import { AppWindow, Box, DollarSign, MessageSquareQuote, Users2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { api } from '@/lib/boilerplate';
import { saveUserData } from '@/lib/accountFunctions';
import AreaGraph from '@/components/common/charts/AreaGraph';
import InfoCard2 from '@/components/common/InfoCard2';
import { displayDate } from '@/lib/timeFunctions';

const chartConfig = {
    desktop: {},
} satisfies ChartConfig;

const Dashboard = () => {
    const [members, setMembers] = useState<Record<string, any>[]>([]);
    const [movements, setMovements] = useState<Record<string, any>[]>([]);
    const [stats, setStats] = useState<Record<string, any>>([]);

    const [lastMovements, setLastMovements] = useState<Record<string, any>[]>([]);
    const [lastMembers, setLastMembers] = useState<Record<string, any>[]>([]);
    const [lastMaterials, setLastMaterials] = useState<Record<string, any>[]>([]);
    const [lastCertificates, setLastCertificates] = useState<Record<string, any>[]>([]);
    const [lastSubjects, setLastSubjects] = useState<Record<string, any>[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const result = (await api.get('/dashboard/owner')).data;

        saveUserData(result.userData);

        setStats(result.stats || []);

        setMembers(result.members || []);
        setMovements(result.movements.map((v: any) => ({ ...v, Ingresos: parseFloat(v.Ingresos), Egresos: parseFloat(v.Egresos) })) || []);

        setLastMovements(result.lastMovements || []);
        setLastMembers(result.lastMembers || []);
        setLastMaterials(result.lastMaterials || []);
        setLastCertificates(result.lastCertificates || []);
        setLastSubjects(result.lastSubjects || []);

        document.dispatchEvent(new CustomEvent('astro:after-swap'));
    };

    return (
        <div className="grid lg:grid-cols-[1fr_20rem] gap-6">
            <div className="gap-6 grid order-2 lg:order-1">
                <div className="grid gap-6">
                    <AreaGraph
                        title="Miembros nuevos registrados"
                        data={members}
                        config={chartConfig}
                        lines={[{ key: 'Registros', color: 'purple' }]}
                    />
                </div>

                <div className="grid 2xl:grid-cols-3  gap-6">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl">Últimos miembros registrados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Tipo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lastMembers.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={row.position?.includes('Pastor') ? 'purple' : 'outline'}>{row.position}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl">Últimos certificados emitidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Tipo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lastCertificates.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{row.type}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl">Ultimas materias agregadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lastSubjects.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.title}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <AreaGraph
                    title="Movimientos mensuales"
                    data={movements}
                    config={chartConfig}
                    lines={[
                        { key: 'Egresos', color: 'destructive' },
                        { key: 'Ingresos', color: 'green' },
                    ]}
                />

                <div className="grid 2xl:grid-cols-2  gap-6">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl">Últimos movimientos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Concepto</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead>Fecha</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lastMovements.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.concept}</TableCell>
                                            <TableCell>
                                                <Badge variant={row.isIncome ? 'green' : 'destructive'}>
                                                    {!row.isIncome && '-'} ${row.amount}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{displayDate(row.date ,'dd/MM/yyyy')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl">Últimos materiales agregados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lastMaterials.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>${row.price}</TableCell>
                                            <TableCell>{row.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="h-fit lg:sticky top-6 order-1 lg:order-2">
                <CardHeader>
                    <CardTitle className="text-xl">Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <InfoCard2 href="/members" color="purple" title="Miembros activos" data={stats.members} perm="perm_members">
                        <Users2 />
                    </InfoCard2>
                    {/* <InfoCard2 href="/certificates" color="cyan" title="Total de certificados" data={stats.certificates} perm="perm_certificates">
                        <FileBadge />
                    </InfoCard2>

                    <InfoCard2 href="/classes" color="blue" title="Total de alumnos" data={stats.students} perm="perm_classes">
                        <GraduationCap />
                    </InfoCard2> */}

                    <InfoCard2 href="/finances" color="green" title="Balance general" data={stats.balance} perm="perm_finances">
                        <DollarSign />
                    </InfoCard2>

                    <InfoCard2 href="/inventory" color="yellow" title="Total en inventario" data={stats.inventory} perm="perm_inventory">
                        <Box />
                    </InfoCard2>

                    <InfoCard2 href="/blog" color="orange" title="Total de visitas al blog" data={stats.blog} perm="perm_blog">
                        <MessageSquareQuote />
                    </InfoCard2>

                    <InfoCard2 href="/website" color="gray" title="Total de visitas a la pagina" data={stats.website} perm="perm_website">
                        <AppWindow />
                    </InfoCard2>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
