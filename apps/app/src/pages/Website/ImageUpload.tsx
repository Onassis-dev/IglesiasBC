import { Button } from '@/components/ui/button';
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/auto-modal';
import { Input } from '@/components/ui/input';
import { PlusIcon } from 'lucide-react';

interface Props<TApiPath> {
    uploadImage: (apiPath: TApiPath) => void;
    setSelectedFile: Function;
    text: string;
    apiPath: TApiPath;
    edit?: boolean;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageUpload = <TApiPath,>({ uploadImage, setSelectedFile, text, apiPath, edit = false, open, setOpen }: Props<TApiPath>) => {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
                {edit ? (
                    <Button>Cambiar</Button>
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
                <ModalFooter>
                    <Button onClick={() => uploadImage(apiPath)}>Subir</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ImageUpload;
