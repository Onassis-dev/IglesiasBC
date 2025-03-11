import { useNavigate } from 'react-router';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RegisterButton } from '@/components/ui/button';

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const BlogAlert = ({ open, setOpen }: props) => {
    let navigate = useNavigate();

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <RegisterButton>Publicar post</RegisterButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Necesitas crear una página primero</AlertDialogTitle>
                    <AlertDialogDescription>
                        Debes tener una página creada antes de poder escribir en tu blog. Por favor, crea una página para continuar.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>navigate('/website')}>Crear pagina</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default BlogAlert;
