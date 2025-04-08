import { api, tsr } from '@/lib/boilerplate';
import { Modal, ModalContent, ModalDescription, ModalTitle, ModalTrigger } from '@/components/ui/auto-modal';
import { ModalHeader } from '@/components/ui/auto-modal';
import { ActionButton, Button } from '@/components/ui/button';
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

        await api(tsr.members.import, formData);

        client.refetchQueries({ queryKey: ['members'] });
        setOpen(false);
    };

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger>
                <ActionButton text="Importar">
                    <FileUp className="size-3.5" />
                </ActionButton>
            </ModalTrigger>
            <ModalContent className="w-xl">
                <ModalHeader>
                    <ModalTitle>Importar miembros</ModalTitle>
                    <ModalDescription>Llena nuestra plantilla de excel e importa todos tus miembros en un solo movimiento!</ModalDescription>
                </ModalHeader>

                <Button asChild className="max-w-48" variant={'outline'}>
                    <a href="https://cdn.iglesiasbc.com/plantilla_miembros.xlsx">Descargar plantilla</a>
                </Button>
                <Label>Archivo</Label>
                <Input type="file" accept=".xlsx .xls" id="username" onChange={(e) => handleFile(e)} />

                <Button onClick={() => showPromise(handleSubmit(), 'Miembros importados')}>Importar</Button>
            </ModalContent>
        </Modal>
    );
};

export default ImportMembers;
