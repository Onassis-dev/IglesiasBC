import { api } from '@/lib/boilerplate';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { showPromise } from '@/lib/showFunctions';
import { useQueryStore } from '@/lib/store';

const ImportMembers = () => {
    const [selectedFile, setSelectedFile] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const client = useQueryStore((queryClient) => queryClient.queryClient);

    const handleFile = async (e: any) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append('file', selectedFile);

        await api.post('/members/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        client.refetchQueries({ queryKey: ['members'] });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="outline">
                    <FileUp className="size-3.5 mr-2" />
                    Importar
                </Button>
            </DialogTrigger>
            <DialogContent className="w-xl">
                <DialogHeader>
                    <DialogTitle>Importar miembros</DialogTitle>
                    <DialogDescription>Llena nuestra plantilla de excel e importa todos tus miembros en un solo movimiento!</DialogDescription>
                </DialogHeader>

                <Button asChild className="max-w-48" variant={'outline'}>
                    <a href="https://cdn.iglesiasbc.com/plantilla_miembros.xlsx">Descargar plantilla</a>
                </Button>
                <Label>Archivo</Label>
                <Input type="file" accept='.xlsx .xls' id="username" onChange={(e) => handleFile(e)} />

                <Button onClick={() => showPromise(handleSubmit(), 'Miembros importados')}>Importar</Button>
            </DialogContent>
        </Dialog>
    );
};

export default ImportMembers;
