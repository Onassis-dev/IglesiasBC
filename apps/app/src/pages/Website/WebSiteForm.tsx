import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IconInput, Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { api, tsr } from '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Textarea } from '@/components/ui/textarea';
import { WebsiteSchema } from '@iglesiasbc/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ColorPicker2 from '@/components/common/ColorPicker2';
import { useEffect } from 'react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, MapsIcon, PaypalIcon, WhatsappIcon } from '@/components/ui/icons';
import { Video } from 'lucide-react';

const WebSiteForm = () => {
    const websiteForm = useForm<z.infer<typeof WebsiteSchema>>({
        resolver: zodResolver(WebsiteSchema),
    });
    const client = tsr.useQueryClient();

    const { data: { body: [websiteData] = [] } = {} } = tsr.builder.getWebsite.useQuery({
        queryKey: ['websiteData'],
    });

    useEffect(() => {
        if (websiteData) {
            websiteForm.reset({ ...websiteData, color: websiteData.color || '#000000' });
        }
    }, [websiteData, websiteForm]);

    const handleSubmit: any = async (values: z.infer<typeof WebsiteSchema>) => {
        if (websiteData) {
            await api(tsr.builder.editWebsite, values);
        } else {
            await api(tsr.builder.createWebsite, values);
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
                                        <FormLabel>Portada</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una estructura" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">Sencilla</SelectItem>
                                                    <SelectItem value="2">Completa</SelectItem>
                                                    <SelectItem value="3">Moderna</SelectItem>
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
                                                <Select onValueChange={field.onChange} value={field.value}>
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
                            <FormField
                                control={websiteForm.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color principal</FormLabel>
                                        <FormControl>
                                            <ColorPicker2 value={field.value || ''} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                            <Input placeholder="Pastor y pastora..." value={field.value || ''} onChange={field.onChange} />
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
                                            <IconInput placeholder="https://facebook.com/watch" value={field.value || ''} onChange={field.onChange}>
                                                <Video className="size-3.5" />
                                            </IconInput>
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
                                        <FormLabel>Redes sociales</FormLabel>
                                        <FormControl>
                                            <IconInput
                                                placeholder="https://facebook.com/tuiglesia"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            >
                                                <FacebookIcon />
                                            </IconInput>
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
                                            <IconInput
                                                placeholder="https://instagram.com/tuiglesia"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            >
                                                <InstagramIcon />
                                            </IconInput>
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
                                            <IconInput placeholder="https://wa.me/tuiglesia" value={field.value || ''} onChange={field.onChange}>
                                                <WhatsappIcon />
                                            </IconInput>
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
                                            <IconInput
                                                placeholder="https://www.youtube.com/@tuiglesia"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            >
                                                <YoutubeIcon />
                                            </IconInput>
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
                                            <IconInput
                                                placeholder="https://www.google.com/maps/tuiglesia"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            >
                                                <MapsIcon />
                                            </IconInput>
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
                                            <IconInput
                                                placeholder="https://www.paypal.me/tuiglesia"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            >
                                                <PaypalIcon />
                                            </IconInput>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className="w-full shadow-md sticky bottom-0" type="submit">
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
