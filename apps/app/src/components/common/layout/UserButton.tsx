import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { showPromise } from '@/lib/showFunctions.tsx';
import { LogOutIcon, User2 } from 'lucide-react';
import { logout } from '@/lib/accountFunctions';
import { Link, useNavigate } from 'react-router';

const UserButton = () => {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full">
                <Avatar className="size-8">
                    <AvatarImage src={localStorage.getItem('photo') || ''} alt="avatar" className="w-full h-full" />
                    <AvatarFallback className="text-foreground border">
                        <User2 className="size-5" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/account">
                    <DropdownMenuItem>Configuración</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        showPromise(
                            logout(() => navigate('/login')),
                            'Sesión cerrada'
                        )
                    }
                >
                    Cerrar sesión
                    <DropdownMenuShortcut>
                        <LogOutIcon className="w-3 ml-3" />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserButton;
