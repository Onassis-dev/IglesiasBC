import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api, tsr } from '@/lib/boilerplate';
import { Modal, ModalContent, ModalDescription, ModalTitle, ModalTrigger } from '@/components/ui/auto-modal';
import { ModalHeader } from '@/components/ui/auto-modal';
import { ActionButton, Button } from '@/components/ui/button';
import { Download, FileUp, ExternalLink, FileSpreadsheet, LinkIcon, Share2Icon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { showPromise } from '@/lib/showFunctions';
import { useQueryStore } from '@/lib/store';
import UpdateUrl from './UpdateUrl';
import FormResults from './FormResults';
import Share from '@/components/common/Share';

const ImportMembers = () => {
    const [selectedFile, setSelectedFile] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [openResults, setOpenResults] = useState(false);
    const [openUpdateUrl, setOpenUpdateUrl] = useState(false);
    const client = useQueryStore((queryClient) => queryClient.queryClient);

    const { data: { body: formUrl } = {} } = tsr.forms.getUrl.useQuery({
        queryKey: ['formUrl'],
    });

    const handleFile = async (e: any) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append('file', selectedFile);

        await api(tsr.members.import, formData);

        client.refetchQueries({ queryKey: ['members'] });
        setOpen(false);
    };

    const getFormUrl = (id?: string) => {
        if (!id) return '';
        return import.meta.env.VITE_WEBSITES_URL + '/form?id=' + id;
    };

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger>
                <ActionButton text="Importar">
                    <FileUp className="size-3.5" />
                </ActionButton>
            </ModalTrigger>
            <ModalContent className="max-w-2xl">
                <ModalHeader>
                    <ModalTitle>Importar miembros</ModalTitle>
                    <ModalDescription>Elige como quieres importar a tus miembros</ModalDescription>
                </ModalHeader>

                <Tabs defaultValue="formulario" className="w-full">
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="formulario">Formulario</TabsTrigger>
                        <TabsTrigger value="plantilla">Plantilla</TabsTrigger>
                    </TabsList>
                    <TabsContent value="formulario">
                        <Card className="border-0 shadow-none sm:border">
                            <CardHeader className="px-0 sm:px-6">
                                <CardTitle className="text-base">Formulario de registro</CardTitle>
                                <CardDescription>
                                    Comparte este enlace con los miembros para que completen su información directamente.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 px-0 sm:px-6">
                                <div className="flex justify-between rounded-lg border p-4 flex-col sm:flex-row gap-2">
                                    <div className="flex items-center space-x-3 ">
                                        <LinkIcon className="h-8 w-8 text-blue" />
                                        <div>
                                            <p className="font-medium">Link al formulario</p>
                                            <p className="text-sm text-muted-foreground">Permite que los miembros llenen sus datos</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                                        <a href={getFormUrl(formUrl)} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-2 size-4" />
                                            Abrir Formulario
                                        </a>
                                    </Button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input value={getFormUrl(formUrl)} readOnly className="font-mono text-sm" />

                                    <Share url={getFormUrl(formUrl)} title="Formulario de registro">
                                        <Button variant="outline" size="icon" className="shrink-0">
                                            <Share2Icon className="size-4 cursor-pointer" />
                                        </Button>
                                    </Share>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 flex-wrap px-0 sm:px-6">
                                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setOpenUpdateUrl(true)}>
                                    Actualizar url
                                </Button>
                                <Button
                                    className="w-full sm:w-auto"
                                    onClick={() => {
                                        setOpenResults(true);
                                        setOpen(false);
                                    }}
                                >
                                    Ver respuestas
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="plantilla">
                        <Card className="border-0 shadow-none sm:border">
                            <CardHeader className="px-0 sm:px-6">
                                <CardTitle className="text-base">Plantilla de Excel</CardTitle>
                                <CardDescription>
                                    Descarga nuestra plantilla, complétala con información de miembros y subela de nuevo.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 px-0 sm:px-6">
                                <div className="flex justify-between rounded-lg border p-4 gap-2 flex-col sm:flex-row">
                                    <div className="flex items-center space-x-3">
                                        <FileSpreadsheet className="h-8 w-8 text-green" />
                                        <div>
                                            <p className="font-medium">plantilla_miembros.xlsx</p>
                                            <p className="text-sm text-muted-foreground">Plantilla Excel con campos requeridos</p>
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                                        <a href="https://cdn.iglesiasbc.com/plantilla_miembros.xlsx">
                                            <Download className="mr-2 size-4" />
                                            Descargar
                                        </a>
                                    </Button>
                                </div>

                                <div className="grid w-full items-center gap-1.5">
                                    <label htmlFor="file-upload" className="text-sm font-medium">
                                        Subir plantilla completada
                                    </label>
                                    <Input type="file" accept=".xlsx .xls" onChange={(e) => handleFile(e)} />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 flex-wrap px-0 sm:px-6">
                                <Button onClick={() => showPromise(handleSubmit(), 'Miembros importados')} className="w-full sm:w-auto">
                                    Importar miembros
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </ModalContent>
            <UpdateUrl open={openUpdateUrl} onOpenChange={setOpenUpdateUrl} />
            <FormResults open={openResults} setOpen={setOpenResults} />
        </Modal>
    );
};

export default ImportMembers;
