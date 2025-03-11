import { api } from '@/lib/boilerplate';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { BadgeCheck, BriefcaseBusiness, Cake, DoorOpen, Heart, MailIcon, Phone, UsersRound } from 'lucide-react';
import { displayDate } from '@/lib/timeFunctions';
import { useQuery } from '@tanstack/react-query';
import { calculateAge } from './members.lib';

interface props {
    id?: number | string;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const MembersCard = ({ id, open, setOpen }: props) => {
    const { data: positions } = useQuery({
        queryKey: ['positionsObj'],
        queryFn: async () =>
            Object.fromEntries((await api.get('/options/positions')).data.map(({ id, value }: { id: any; value: any }) => [id, value])),
    });

    const { data: member } = useQuery({
        queryKey: ['member', id],
        queryFn: async () => (await api.get(`/members/${id}`)).data,
        initialData: {},
        enabled: !!id,
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-xl">
                <DialogHeader>
                    <DialogTitle>{member?.name}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <UsersRound className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Género</p>
                            <p className="text-muted-foreground text-sm">{member?.genre === 'M' ? 'Hombre' : 'Mujer'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <BriefcaseBusiness className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Cargo</p>
                            <p className="text-muted-foreground text-sm">{positions ? positions[member?.positionId] : ''}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Teléfono</p>
                            <p className="text-muted-foreground text-sm">{member?.cellphone}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Estado civil</p>
                            <p className="text-muted-foreground text-sm">{member?.civilStatus}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Cake className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Nacimiento</p>
                            <p className="text-muted-foreground text-sm">{displayDate(member?.birthday)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Cake className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Edad</p>
                            <p className="text-muted-foreground text-sm">{calculateAge(member?.birthday)} años</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <DoorOpen className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Membresia</p>
                            <p className="text-muted-foreground text-sm">{displayDate(member?.joinDate)} </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <DoorOpen className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Antiguedad</p>
                            <p className="text-muted-foreground text-sm">{calculateAge(member?.joinDate)} años</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <BadgeCheck className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Estado de bautizo</p>
                            <p className="text-muted-foreground text-sm">{member?.baptized ? 'Bautizado(a)' : 'No bautizado(a)'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <MailIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium">Correo electrónico</p>
                            <p className="text-muted-foreground text-sm w-full overflow-ellipsis">{member?.email}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MembersCard;
