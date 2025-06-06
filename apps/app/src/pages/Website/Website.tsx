import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLinkIcon, RefreshCcwIcon, Rocket, Share2Icon } from 'lucide-react';
import { useEffect } from 'react';
import '@/lib/boilerplate';
import { tsr } from '@/lib/boilerplate';
import WebSiteForm from './WebSiteForm';
import EventsForm from './EventsForm';
import ActivitiesForm from './ActivitiesForm';
import ImagesForm from './ImagesForm';
import { keepPreviousData } from '@tanstack/react-query';
import { useQueryStore } from '@/lib/store';
import Share from '@/components/common/Share';

const Website = () => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);

    const { data: { body: [pageInfo] = [] } = {}, isFetching } = tsr.builder.getWebsiteInfo.useQuery({
        queryKey: ['pageInfo'],
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (isFetching) return;
        const iframe: any = document.querySelector('iframe');
        iframe.src = import.meta.env.VITE_WEBSITES_URL + '/' + pageInfo?.title;
    }, [isFetching, pageInfo?.title]);

    return (
        <>
            <div className="flex flex-wrap lg:flex-nowrap gap-6">
                <Tabs defaultValue="general" className="w-full h-full lg:max-w-lg">
                    <TabsList className="grid w-full grid-rows-2 sm:grid-rows-1 grid-cols-2 sm:grid-cols-4 h-24 sm:h-10 border bg-dashboardbg rounded-xl">
                        <TabsTrigger className="rounded-lg shadow-none" value="general">
                            General
                        </TabsTrigger>
                        <TabsTrigger className="rounded-lg shadow-none" value="events">
                            Eventos
                        </TabsTrigger>
                        <TabsTrigger className="rounded-lg shadow-none" value="activities">
                            Actividades
                        </TabsTrigger>
                        <TabsTrigger className="rounded-lg shadow-none" value="gallery">
                            Imágenes
                        </TabsTrigger>
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
                    <div className="w-full h-11 rounded-t-lg flex justify-between items-center px-3 border border-b-0 border-input bg-background ">
                        <div className="space-x-2">
                            <div className="inline-block w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="inline-block w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="inline-block w-3 h-3 rounded-full bg-green-400"></div>
                        </div>

                        <div className="gap-4 flex">
                            {pageInfo && (
                                <>
                                    <a href={import.meta.env.VITE_WEBSITES_URL + '/' + pageInfo?.title} target="_blank">
                                        <ExternalLinkIcon className="size-4"></ExternalLinkIcon>
                                    </a>

                                    <Share url={`${import.meta.env.VITE_WEBSITES_URL}/${pageInfo?.title}`} title={pageInfo?.title}>
                                        <Share2Icon className="size-4 cursor-pointer" />
                                    </Share>

                                    <RefreshCcwIcon
                                        className="size-4 cursor-pointer"
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
