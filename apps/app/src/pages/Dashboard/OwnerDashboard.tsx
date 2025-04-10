import '@/lib/boilerplate';
import { type ChartConfig } from '@/components/ui/chart';
import { AppWindow, Box, DollarSign, FileBadge, MessageSquareQuote, Presentation, Users2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tsr } from '@/lib/boilerplate';
import AreaGraph from '@/components/common/charts/AreaGraph';
import InfoCard2 from '@/components/common/InfoCard2';
import { displayDate } from '@/lib/timeFunctions';

const chartConfig = {
    desktop: {},
} satisfies ChartConfig;

const Dashboard = () => {
    const { data: { body } = {} } = tsr.dashboard.getOwner.useQuery({
        queryKey: ['user-dashboard'],
    });

    const filteredMovements = body?.movements?.map((v: any) => ({ ...v, Ingresos: parseFloat(v.Ingresos), Egresos: parseFloat(v.Egresos) }));

    return (
        <div className="grid lg:grid-cols-[1fr_20rem] gap-6">
            <div className="gap-6 grid order-2 lg:order-1">
                <div className="grid gap-6">
                    <AreaGraph
                        title="Miembros nuevos registrados"
                        data={body?.members || []}
                        config={chartConfig}
                        lines={[{ key: 'Registros', color: 'purple' }]}
                    />
                </div>

                <div className="grid 2xl:grid-cols-2  gap-6">
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
                                    {body?.lastMembers?.map((row: any, i: number) => (
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
                                    {body?.lastCertificates?.map((row: any, i: number) => (
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
                </div>

                <AreaGraph
                    title="Movimientos mensuales"
                    data={filteredMovements || []}
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
                                    {body?.lastMovements?.map((row: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.concept}</TableCell>
                                            <TableCell>
                                                <Badge variant={row.isIncome ? 'green' : 'destructive'}>
                                                    {!row.isIncome && '-'} ${row.amount}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{displayDate(row.date, 'dd/MM/yyyy')}</TableCell>
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
                                    {body?.lastMaterials?.map((row: any, i: number) => (
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
                    <InfoCard2 href="/members" color="purple" title="Miembros activos" data={body?.stats.members} perm="perm_members">
                        <Users2 />
                    </InfoCard2>
                    <InfoCard2 href="/certificates" color="cyan" title="Certificados" data={body?.stats.certificates} perm="perm_certificates">
                        <FileBadge />
                    </InfoCard2>

                    {/* <InfoCard2 href="/classes" color="blue" title=" alumnos" data={stats.students} perm="perm_classes">
                        <GraduationCap />
                    </InfoCard2> */}

                    <InfoCard2 href="/finances" color="green" title="Balance general" data={body?.stats.balance} perm="perm_finances">
                        <DollarSign />
                    </InfoCard2>

                    <InfoCard2 href="/inventory" color="yellow" title="Total en inventario" data={body?.stats.inventory} perm="perm_inventory">
                        <Box />
                    </InfoCard2>

                    <InfoCard2 href="/presentations" color="pink" title="Presentaciones" data={body?.stats.presentations} perm="perm_presentations">
                        <Presentation />
                    </InfoCard2>

                    <InfoCard2 href="/blog" color="orange" title="Visitas al blog" data={body?.stats.blog} perm="perm_blog">
                        <MessageSquareQuote />
                    </InfoCard2>

                    <InfoCard2 href="/website" color="gray" title="Visitas a la pagina" data={body?.stats.website} perm="perm_website">
                        <AppWindow />
                    </InfoCard2>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
