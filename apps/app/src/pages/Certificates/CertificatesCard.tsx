import { Modal, ModalContent, ModalTitle } from '@/components/ui/auto-modal';
import { ModalHeader } from '@/components/ui/auto-modal';
import { Badge, CalendarIcon, Download, Share2, Trash, UsersRound } from 'lucide-react';
import { displayDate } from '@/lib/timeFunctions';
import { Button } from '@/components/ui/button';
import Share from '@/components/common/Share';
import { tsr } from '@/lib/boilerplate';

interface props {
    certificate?: Record<string, any>;
    open: boolean;
    setOpen: (open: boolean) => void;
    setDelete: (open: boolean) => void;
}

const CertificatesCard = ({ certificate, open, setOpen, setDelete }: props) => {
    const { data: { body: typesList } = {} } = tsr.options.getCertificateTypes.useQuery({
        queryKey: ['certificateTypes'],
        refetchOnMount: false,
    });
    const types = typesList ? Object.fromEntries(typesList.map(({ id, value }: { id: any; value: any }) => [id, value])) : {};

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalContent className="w-xl">
                <ModalHeader>
                    <ModalTitle>Certificado</ModalTitle>
                </ModalHeader>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <UsersRound className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Miembro(s)</p>
                            <p className="text-muted-foreground text-sm">
                                {certificate?.member} {certificate?.member2 ? `y ${certificate?.member2}` : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <UsersRound className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Pastor(es)</p>
                            <p className="text-muted-foreground text-sm">
                                {certificate?.pastor} {certificate?.pastor2 ? `y ${certificate?.pastor2}` : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Tipo de certificado</p>
                            <p className="text-muted-foreground text-sm">{types[certificate?.certificateTypeId]}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-h-10">
                            <p className="text-sm font-medium">Fecha de expedición</p>
                            <p className="text-muted-foreground text-sm">{displayDate(certificate?.expeditionDate)}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 gap-2 grid grid-cols-3 border-t pt-2">
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
                            window.open(certificate?.url, '_blank');
                            setOpen(false);
                        }}
                    >
                        <Download className="size-4" />
                    </Button>

                    <Share url={certificate?.url} title={'Certificado'}>
                        <Button variant="outline" onClick={() => {}}>
                            <Share2 className="size-4" />
                        </Button>
                    </Share>
                </div>
            </ModalContent>
        </Modal>
    );
};

export default CertificatesCard;
