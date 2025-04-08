import { ActionButton, Button } from '@/components/ui/button';
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/auto-modal';
import { Input } from '@/components/ui/input';
import { api, tsr } from '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Image } from 'lucide-react';
import { useState } from 'react';

const LogoUpload = () => {
    const [selectedFile, setSelectedFile] = useState<any>([]);
    const [open, setOpen] = useState(false);

    const handleFile = async (e: any) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append('file', selectedFile);

        await api(tsr.certificates.uploadLogo, formData);

        setOpen(false);
    };

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
                <ActionButton text="Subir logo">
                    <Image className="size-3.5" />
                </ActionButton>
            </ModalTrigger>
            <ModalContent className="sm:max-w-[425px]">
                <ModalHeader>
                    <ModalTitle>Subir logo de tu iglesia</ModalTitle>
                </ModalHeader>
                <Input type="file" accept="image/*" id="username" onChange={(e) => handleFile(e)} />
                <ModalFooter>
                    <Button type="submit" onClick={() => showPromise(handleSubmit(), 'Logo Subido')} size="sm">
                        Subir
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default LogoUpload;
