import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLinkIcon, RefreshCcwIcon, Rocket, Share2Icon } from 'lucide-react';
import { api } from '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions.tsx';
import { useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import '@/lib/boilerplate';
import WebSiteForm from './WebSiteForm';
import EventsForm from './EventsForm';
import ActivitiesForm from './ActivitiesForm';
import ImagesForm from './ImagesForm';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useQueryStore } from '@/lib/store';

const Website = () => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);

    const { data: [pageInfo] = [], isFetching } = useQuery({
        queryKey: ['pageInfo'],
        queryFn: async () => (await api.get('/builder/website/info')).data,
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (isFetching) return;
        const iframe: any = document.querySelector('iframe');
        iframe.src = import.meta.env.VITE_WEBSITES_URL + '/' + pageInfo?.title;
    }, [isFetching]);

    const copyLink = async (text: string) => {
        await navigator.clipboard.writeText(text);
    };

    return (
        <>
            <div className="flex flex-wrap lg:flex-nowrap gap-6">
                <Tabs defaultValue="general" className="w-full h-full lg:max-w-lg">
                    <TabsList className="grid w-full grid-rows-2 sm:grid-rows-1 grid-cols-2 sm:grid-cols-4 h-20 sm:h-9">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="events">Eventos</TabsTrigger>
                        <TabsTrigger value="activities">Actividades</TabsTrigger>
                        <TabsTrigger value="gallery">Imágenes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general">
                        <WebSiteForm />
                    </TabsContent>
                    <TabsContent value="events">
                        <EventsForm />
                    </TabsContent>
                    <TabsContent value="activities">
                        <ActivitiesForm />
                    </TabsContent>
                    <TabsContent value="gallery">
                        <ImagesForm />
                    </TabsContent>
                </Tabs>

                <div className="w-full h-[calc(100lvh-7rem)] sticky top-0 grid grid-rows-[auto_1fr]">
                    <div className="w-full h-11 rounded-t-lg flex justify-between items-center px-3 border border-input bg-background ">
                        <div className="space-x-2">
                            <div className="inline-block w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="inline-block w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="inline-block w-3 h-3 rounded-full bg-green-400"></div>
                        </div>

                        <div className="gap-6 flex">
                            {pageInfo && (
                                <>
                                    <a href={import.meta.env.VITE_WEBSITES_URL + '/' + pageInfo?.title} target="_blank">
                                        <ExternalLinkIcon className="h-5 w-5"></ExternalLinkIcon>
                                    </a>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Share2Icon className="h-5 w-5" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Tus links</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    showPromise(
                                                        copyLink(`${import.meta.env.VITE_WEBSITES_URL}/${pageInfo?.title?.replaceAll(' ', '-')}`),
                                                        'Enlace copiado'
                                                    )
                                                }
                                            >
                                                https://iglesiasbc.com/
                                                {pageInfo?.title?.replaceAll(' ', '-')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <RefreshCcwIcon
                                        className="h-5 w-5 cursor-pointer"
                                        onClick={() => client.refetchQueries({ queryKey: ['pageInfo'] })}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="w-full h-full">
                        <iframe src={'about:blank'} className={`border border-input rounded-b-lg w-full h-full ${pageInfo ? '' : 'hidden'}`}></iframe>
                        <div
                            className={`border border-input rounded-b-lg w-full h-full bg-background items-center justify-center flex-col gap-4 ${
                                pageInfo ? 'hidden' : 'flex'
                            }`}
                        >
                            <Rocket className="text-gray size-12" />
                            <p className="text-2xl font-semibold px-5 text-center">¡Aún no has creado tu página web!</p>
                            <p className="px-5 text-center text-secondary-foreground max-w-md">
                                Introduce tus datos, elige tu diseño, sube las imágenes y guarda tus cambios para comenzar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Website;
