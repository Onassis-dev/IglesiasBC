import { Button } from '@/components/ui/button';
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/auto-modal';
import { Input } from '@/components/ui/input';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props<TApiPath> {
    uploadImage: (apiPath: TApiPath) => void;
    setSelectedFile: (file: File) => void;
    text: string;
    apiPath: TApiPath;
    edit?: boolean;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    aspectRatio?: string;
}

const ImageUpload = <TApiPath,>({ uploadImage, setSelectedFile, text, apiPath, edit = false, open, setOpen, aspectRatio = '' }: Props<TApiPath>) => {
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const image = new Image();
            const url = URL.createObjectURL(file);
            image.src = url;
            image.onload = () => {
                setPreviewUrl(url);
            };
            setSelectedFile(file);
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                if (open) return;
                setTimeout(() => {
                    setPreviewUrl('');
                    setSelectedFile(null as any);
                }, 200);
            }}
        >
            <ModalTrigger asChild>
                {edit ? (
                    <Button>Actualizar</Button>
                ) : (
                    <button className="rounded-xl aspect-square border-input border flex justify-center items-center">
                        <PlusIcon className="w-14 h-14" />
                    </button>
                )}
            </ModalTrigger>
            <ModalContent className="sm:max-w-[425px]">
                <ModalHeader>
                    <ModalTitle>{text}</ModalTitle>
                </ModalHeader>
                <Input type="file" accept="image/*" onChange={handleFile} />
                {previewUrl && (
                    <img src={previewUrl} alt="Preview" className={cn('w-full h-full object-cover rounded-md border object-center', aspectRatio)} />
                )}
                <ModalFooter>
                    <Button onClick={() => uploadImage(apiPath)}>Subir</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ImageUpload;
