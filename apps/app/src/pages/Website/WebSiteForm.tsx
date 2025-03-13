import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { api, tsr } from '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Textarea } from '@/components/ui/textarea';
import { WebsiteSchema, useWebsiteSchema } from './websites.models';
import ColorPicker from '@/components/common/ColorPicker';
import { useQueryStore } from '@/lib/store';

const WebSiteForm = () => {
    const websiteForm = useWebsiteSchema();
    const client = useQueryStore((queryClient) => queryClient.queryClient);
    const [color, setColor] = useState('#000000');

    const { data: { body: [websiteData] = [] } = {}, isLoading } = tsr.builder.getWebsite.useQuery({
        queryKey: ['websiteData'],
    });

    useEffect(() => {
        if (!isLoading && websiteData) {
            websiteForm.setValue('title', websiteData.title);
            websiteForm.setValue('mission', websiteData.mission);
            websiteForm.setValue('style', websiteData.style);
            websiteForm.setValue('language', websiteData.language);
            websiteForm.setValue('structure', websiteData.structure);
            websiteForm.setValue('pastors', websiteData.pastors);
            websiteForm.setValue('servicesDates', websiteData.servicesDates);
            websiteForm.setValue('facebookLink', websiteData.facebookLink);
            websiteForm.setValue('instagramLink', websiteData.instagramLink);
            websiteForm.setValue('whatsappLink', websiteData.whatsappLink);
            websiteForm.setValue('mapsLink', websiteData.mapsLink);
            websiteForm.setValue('youtubeLink', websiteData.youtubeLink);
            websiteForm.setValue('preachLink', websiteData.preachLink);
            websiteForm.setValue('donationLink', websiteData.donationLink);
            websiteForm.setValue('animations', websiteData.animations);
            websiteForm.setValue('description', websiteData.description);
            websiteForm.setValue('ubication', websiteData.ubication);
            websiteForm.setValue('about', websiteData.about);

            setColor(websiteData.color || '#000000');
        }
    }, [isLoading, websiteData]);

    const handleSubmit: any = async (values: z.infer<typeof WebsiteSchema>) => {
        if (websiteData) {
            await api.put('/builder/website', { ...values, color });
        } else {
            await api.post('/builder/website', { ...values, color });
        }
        client.refetchQueries({ queryKey: ['pageInfo'] });
        client.refetchQueries({ queryKey: ['websiteData'] });
    };

    return (
        <div>
            <Card className="max-w-full">
                <CardHeader>
                    <CardTitle>Información de tu pagina</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                    <Form {...websiteForm}>
                        <form onSubmit={websiteForm.handleSubmit((values) => showPromise(handleSubmit(values), 'Datos Actualizados'))}>
                            <FormField
                                control={websiteForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Titulo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Titulo" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="structure"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estructura</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una estructura" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">Sencillo</SelectItem>
                                                    <SelectItem value="2">Impactante</SelectItem>
                                                    <SelectItem value="3">Elegante</SelectItem>
                                                    <SelectItem value="4">Moderno</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="style"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estilo</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un estilo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">Simple</SelectItem>
                                                    <SelectItem value="2">Elegante</SelectItem>
                                                    <SelectItem value="3">Moderno</SelectItem>
                                                    <SelectItem value="4">Creativo</SelectItem>
                                                    <SelectItem value="5">Oscuro</SelectItem>
                                                    <SelectItem value="6">Lujoso</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="animations"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Animaciones</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona un estilo" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0">Sin animaciones</SelectItem>
                                                        <SelectItem value="1">Horizontales</SelectItem>
                                                        <SelectItem value="2">Verticales</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="language"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Idioma</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Select onValueChange={field.onChange} value={field.value} defaultValue="es">
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona un idioma" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="es">Español</SelectItem>
                                                        <SelectItem value="en">Ingles</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>Color principal</FormLabel>
                                <FormControl>
                                    <ColorPicker color={color} setColor={setColor} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <FormField
                                control={websiteForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descripción rápida</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Somos una iglesia..."
                                                className="resize-none"
                                                rows={2}
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="pastors"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pastorado</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="resize-none"
                                                rows={2}
                                                placeholder="Pastor y pastora..."
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="about"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sobre nosotros</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="En nuestra iglesia..."
                                                className="resize-none"
                                                rows={5}
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="servicesDates"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Servicios</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Domingos a las..." value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="mission"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Misión</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Nuestra misión es..."
                                                className="resize-none"
                                                rows={3}
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={websiteForm.control}
                                name="ubication"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ubicación</FormLabel>
                                        <FormControl>
                                            <Input placeholder="calle 64, col..." value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="preachLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enlace a tu última predicación</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://facebook.com/watch" value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="facebookLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Redes</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://facebook.com/tuiglesia" value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="instagramLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="https://instagram.com/tuiglesia"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="whatsappLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="https://wa.me/tuiglesia" value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="youtubeLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="https://www.youtube.com/@tuiglesia"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="mapsLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="https://www.google.com/maps/tuiglesia"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={websiteForm.control}
                                name="donationLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="https://www.paypal.me/tuiglesia"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className="w-full shadow-md" type="submit">
                                Guardar
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default WebSiteForm;
