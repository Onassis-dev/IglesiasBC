import '@/lib/boilerplate';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { tsr } from '@/lib/boilerplate';
import { CalendarPlus, EditIcon, Eye, EyeIcon, Inbox, MessageSquarePlus, Trash } from 'lucide-react';
import DeleteDialog from '@/components/common/DeleteDialog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/input';
import PaginationMenu from '@/components/common/PaginationMenu';
import BlogForm from './BlogForm';
import { OptionsGrid, StatsGrid } from '@/components/ui/grids';
import { displayDate } from '@/lib/timeFunctions';
import BlogAlert from './BlogAlert';
import InfoCard from '@/components/common/InfoCard';

export function Blog() {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>({});
    const [filters, setFilters] = useState<any>({ title: '' });
    const [page, setPage] = useState(1);

    const { data: { body: posts } = {} } = tsr.posts.get.useQuery({
        queryKey: ['posts', page, filters],
        queryData: {
            query: {
                page,
                ...filters,
            },
        },
    });

    const { data: { body: stats } = {} } = tsr.posts.getStats.useQuery({
        queryKey: ['posts', 'stats'],
    });

    const { data: { body: [websiteData] = [] } = {} } = tsr.builder.getWebsite.useQuery({
        queryKey: ['websiteData'],
    });

    useEffect(() => {
        if (!open && !open1) setSelectedPost({});
    }, [open, open1]);

    return (
        <div className="space-y-3 bg-dashboardbg">
            <StatsGrid>
                <InfoCard color="orange" title="Vistas en el ultimo mes" data={stats?.views}>
                    <Eye />
                </InfoCard>
                <InfoCard color="orange" title="Numero de publicaciones" data={stats?.posts}>
                    <MessageSquarePlus />
                </InfoCard>
                <InfoCard color="orange" title="Publicaciones en el ultimo mes" data={stats?.postsMonthly}>
                    <CalendarPlus />
                </InfoCard>
            </StatsGrid>

            <OptionsGrid>
                <SearchInput placeholder="Buscar..." value={filters.title} onChange={(e) => setFilters({ ...filters, title: e.target.value })} />

                {websiteData ? <BlogForm open={open} setOpen={setOpen} id={selectedPost?.id} /> : <BlogAlert open={open2} setOpen={setOpen2} />}
                <DeleteDialog
                    text="¿Estás seguro de eliminar este post?"
                    open={open1}
                    setOpen={setOpen1}
                    path="posts"
                    id={selectedPost.id}
                    successMessage="Post eliminado"
                />
            </OptionsGrid>

            <div className="grid md:grid-cols-2 gap-3 md:gap-6">
                {posts && posts?.rows[0] ? (
                    posts.rows.map((post: any, i: any) => (
                        <Card>
                            <CardHeader>
                                <p>{displayDate(post.publication, 'dd/MM/yyyy')}</p>
                                <CardTitle>{post.title}</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p>{post.description}</p>
                            </CardContent>
                            <CardFooter className="gap-2">
                                <a
                                    href={`${import.meta.env.VITE_WEBSITES_URL}/${encodeURIComponent(posts.websiteTitle)}/blog/${encodeURIComponent(post.title)}`}
                                    target="_blank"
                                >
                                    <Button className="h-8 px-2" variant="outline">
                                        <EyeIcon className="size-4 mr-2" />
                                        Ver
                                    </Button>
                                </a>
                                <Button
                                    className="h-8 px-2"
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedPost(posts.rows[i]);
                                        setOpen(true);
                                    }}
                                >
                                    <EditIcon className="size-4 mr-2" />
                                    Editar
                                </Button>
                                <Button
                                    className="h-8 px-2"
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedPost(posts.rows[i]);
                                        setOpen1(true);
                                    }}
                                >
                                    <Trash className="size-4 mr-2" />
                                    Eliminar
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="w-full justify-center flex flex-col items-center text-muted-foreground h-40 col-span-2">
                        <Inbox strokeWidth={1} className="size-12 mb-4" />
                        <span className="font-medium">No se encontraron resultados</span>
                    </div>
                )}
            </div>
            <PaginationMenu page={page} setPage={setPage} count={posts?.count} rowsDisplayed={6} />
        </div>
    );
}

export default Blog;
