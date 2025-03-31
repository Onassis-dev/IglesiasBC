import {
    AppWindow,
    Archive,
    Award,
    Church,
    CircleDollarSign,
    FileBadge,
    Home,
    MessageSquareQuote,
    Presentation,
    Settings,
    Users2,
} from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router';
import { traductions } from '@/lib/traductions';

const SideBar = () => {
    const [userData, setUserData] = useState<Record<string, string | null>>({
        owner: 'true',
        perm_classes: 'true',
        perm_members: 'true',
        perm_finances: 'true',
        perm_blog: 'true',
        perm_inventory: 'true',
        perm_website: 'true',
        perm_certificates: 'true',
        perm_presentations: 'true',
        plan: '0',
    });
    const { menuOpen, setMenuOpen } = useUIStore((state) => state);

    useEffect(() => {
        document.querySelector('#asidebg')?.addEventListener('click', () => {
            setMenuOpen(false);
        });
        updateData();
    }, []);

    const updateData = () => {
        setMenuOpen(false);
        setUserData({
            owner: localStorage.getItem('owner'),
            perm_classes: localStorage.getItem('perm_classes'),
            perm_members: localStorage.getItem('perm_members'),
            perm_finances: localStorage.getItem('perm_finances'),
            perm_blog: localStorage.getItem('perm_blog'),
            perm_inventory: localStorage.getItem('perm_inventory'),
            perm_website: localStorage.getItem('perm_website'),
            perm_certificates: localStorage.getItem('perm_certificates'),
            perm_presentations: localStorage.getItem('perm_presentations'),
            plan: localStorage.getItem('plan'),
        });
    };

    useEffect(() => {
        const aside = document.querySelector('aside');
        const asidebg = document.querySelector('#asidebg');
        if (aside) aside.id = menuOpen ? 'open' : '';
        if (asidebg && menuOpen) asidebg.classList.add('openbg');
        if (asidebg && !menuOpen) asidebg.classList.remove('openbg');
    }, [menuOpen]);

    return (
        <>
            <div id="asidebg" className="absolute cursor-pointer "></div>
            <div id="asidespan" className="w-0 xl:w-56 bg-dashboardbg"></div>
            <aside id="aside" className="fixed top-0 bottom-0 border-r border-[#d7d7d7] -left-56 xl:left-0 z-20 w-56 flex flex-col bg-background">
                <div className="h-14 flex  items-center gap-2 border-b border-[#d7d7d7]">
                    <div className=" ml-3 p-1.5 bg-foreground rounded-md text-background">
                        <Church className="size-4" />
                    </div>

                    <h2 className="text-lg font-medium">IglesiasBC</h2>
                </div>

                <nav className="flex flex-col items-center gap-3 mt-3 px-3">
                    <SideBarButton permRequired={'true'} href="">
                        <Home className="size-4" />
                    </SideBarButton>
                    <SideBarButton permRequired={userData.perm_members} href="members">
                        <Users2 className="size-4" />
                    </SideBarButton>
                    <SideBarButton permRequired={userData.perm_finances} href="finances">
                        <CircleDollarSign className="size-4" />
                    </SideBarButton>
                    <SideBarButton permRequired={userData.perm_inventory} href="inventory">
                        <Archive className="size-4" />
                    </SideBarButton>
                    <SideBarButton permRequired={userData.perm_certificates} href="certificates">
                        <FileBadge className="size-4" />
                    </SideBarButton>
                    <SideBarButton permRequired={userData.perm_presentations} href="presentations">
                        <Presentation className="size-4" />
                    </SideBarButton>
                    {/* <SideBarButton permRequired={userData.perm_classes} href="classes">
            <GraduationCap className="size-4" />
          </SideBarButton> */}
                    <SideBarButton permRequired={userData.perm_website} href="website">
                        <AppWindow className="size-4" />
                    </SideBarButton>
                    <SideBarButton permRequired={userData.perm_blog} href="blog">
                        <MessageSquareQuote className="size-4" />
                    </SideBarButton>
                </nav>

                <nav className="mt-auto flex flex-col items-center gap-3 mb-3 px-3">
                    {parseInt(userData.plan || '0') === 0 && (
                        <SideBarButton permRequired={userData.owner} href="pricing">
                            <Award className="size-4 text-yellow" />
                        </SideBarButton>
                    )}
                    <SideBarButton permRequired={userData.owner} href="settings">
                        <Settings className="size-4" />
                    </SideBarButton>
                </nav>
            </aside>
        </>
    );
};

const SideBarButton = ({ children, href, permRequired }: { children: any; href: string; permRequired: string | null }) => {
    const aClass = 'flex w-full items-center rounded-md text-muted-foreground transition-colors hover:text-foreground px-2 py-1.5 gap-2 text-sm';
    const selectedClass = 'bg-accent text-foreground';

    return (
        <>
            {permRequired === 'true' && (
                <Link to={'/' + href} className={cn(aClass, (location.pathname.split('/').filter((e) => e)[0] || '') === href ? selectedClass : '')}>
                    {children}
                    <span>{(traductions as any)[href || '']}</span>
                </Link>
            )}
        </>
    );
};

export default SideBar;
