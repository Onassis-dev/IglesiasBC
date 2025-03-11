import { usePathStore, useUIStore } from '@/lib/store';
import { PanelLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import UserButton from '../layout/UserButton';
import { traductions } from '@/lib/traductions';
import { useLocation } from 'react-router';

const DashboardHeader = () => {
    const { menuOpen, setMenuOpen } = useUIStore((state) => state);
    const location = useLocation();

    const { path, setPath } = usePathStore((state) => state);

    useEffect(() => {
        setPath((traductions as any)[location.pathname.split('/').filter((e) => e)[0] || '']);
        setMenuOpen(false);
    }, [location.pathname]);

    return (
        <header className="h-14 bg-background border-b border-[#d7d7d7] fixed top-0 z-50 w-full xl:w-[calc(100%-14rem)]">
            <div className="mx-2 xs:mx-3 md:mx-6 xl:mx-12 flex items-center justify-between h-full">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        className="p-0 aspect-square xl:hidden"
                        onClick={() => {
                            setMenuOpen(true);
                        }}
                    >
                        <PanelLeft className="size-4" />
                    </Button>
                    <h2 className="font-medium text-lg pl-1.5">{path}</h2>
                    {menuOpen}
                </div>

                <UserButton />
            </div>
        </header>
    );
};

export default DashboardHeader;
