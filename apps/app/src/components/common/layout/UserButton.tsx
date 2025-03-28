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
import { LogOutIcon, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { auth } from '@/lib/firebase';
import { useUserStore } from '@/lib/store';

const UserButton = () => {
    const { user } = useUserStore((state) => state);
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full">
                <Avatar className="size-8">
                    <AvatarImage src={user?.photoURL || ''} alt="avatar" className="w-full h-full" />
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
                    onClick={() => {
                        auth.signOut().then(() => {
                            navigate('/login');
                            localStorage.clear();
                        });
                    }}
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
