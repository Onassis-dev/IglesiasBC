import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {edit ? (
                    <Button>Cambiar</Button>
                ) : (
                    <button className="rounded-xl aspect-square border-input border flex justify-center items-center">
                        <PlusIcon className="w-14 h-14" />
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{text}</DialogTitle>
                </DialogHeader>
                <Input type="file" accept="image/*" onChange={handleFile} />
                <DialogFooter>
                    <Button onClick={() => uploadImage(apiPath)}>Subir</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImageUpload;
