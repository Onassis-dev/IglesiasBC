import { tsr } from '@/lib/boilerplate';
import { Modal, ModalContent, ModalTitle } from '@/components/ui/auto-modal';
import { ModalHeader } from '@/components/ui/auto-modal';
import { BadgeCheck, BriefcaseBusiness, Cake, DoorOpen, Edit, Heart, MailIcon, MessageCircle, Phone, Trash, UsersRound } from 'lucide-react';
import { displayDate } from '@/lib/timeFunctions';
import { calculateAge } from './members.lib';
import { Button } from '@/components/ui/button';

interface props {
    id?: number | string;
    open: boolean;
    setOpen: (open: boolean) => void;
    setDelete: (open: boolean) => void;
    setEdit: (open: boolean) => void;
}

const MembersCard = ({ id, open, setOpen, setDelete, setEdit }: props) => {
    const { data: { body: positionsList } = {} } = tsr.options.getPositions.useQuery({
        queryKey: ['positionsObj'],
    });

    const positions = positionsList ? Object.fromEntries(positionsList.map(({ id, value }: { id: any; value: any }) => [id, value])) : {};

    const { data: { body: member } = {} } = tsr.members.getOne.useQuery({
        queryKey: ['member', id],
        enabled: !!id && open,
        queryData: {
            params: {
                id: String(id),
            },
        },
    });

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalContent className="w-xl">
                <ModalHeader>
                    <ModalTitle>{member?.name}</ModalTitle>
                </ModalHeader>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <UsersRound className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Género</p>
                            <p className="text-muted-foreground text-sm">{member?.genre === 'M' ? 'Hombre' : 'Mujer'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <BriefcaseBusiness className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Cargo</p>
                            <p className="text-muted-foreground text-sm">{positions ? positions[member?.positionId] : ''}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Teléfono</p>
                            <p className="text-muted-foreground text-sm">
                                {member?.countryCode} {member?.cellphone}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Estado civil</p>
                            <p className="text-muted-foreground text-sm">{member?.civilStatus}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Cake className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Nacimiento</p>
                            <p className="text-muted-foreground text-sm">{displayDate(member?.birthday)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Cake className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Edad</p>
                            <p className="text-muted-foreground text-sm">{calculateAge(member?.birthday)} años</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <DoorOpen className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Membresia</p>
                            <p className="text-muted-foreground text-sm">{displayDate(member?.joinDate)} </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <DoorOpen className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Antiguedad</p>
                            <p className="text-muted-foreground text-sm">{calculateAge(member?.joinDate)} años</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <BadgeCheck className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Bautizo</p>
                            <p className="text-muted-foreground text-sm">{member?.baptized ? 'Bautizado(a)' : 'No bautizado(a)'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <MailIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="overflow-hidden h-10">
                            <p className="text-sm font-medium">Correo electrónico</p>
                            <p className="text-muted-foreground text-sm w-full overflow-ellipsis">{member?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 gap-2 grid grid-cols-4 border-t pt-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setOpen(false);
                            setDelete(true);
                        }}
                    >
                        <Trash className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setOpen(false);
                            setEdit(true);
                        }}
                    >
                        <Edit className="size-4" />
                    </Button>
                    <Button
                        disabled={!member?.cellphone}
                        variant="outline"
                        onClick={() => window.open(`https://wa.me/${member?.countryCode}${member?.cellphone}`.replace('+', ''), '_blank')}
                    >
                        <MessageCircle className="size-4" />
                    </Button>
                    <Button
                        disabled={!member?.cellphone}
                        variant="outline"
                        onClick={() => window.open(`tel:${member?.countryCode}${member?.cellphone}`)}
                    >
                        <Phone className="size-4" />
                    </Button>
                </div>
            </ModalContent>
        </Modal>
    );
};

export default MembersCard;
