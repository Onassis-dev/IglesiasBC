import { Modal, ModalContent, ModalTitle } from '@/components/ui/auto-modal';
import { ModalHeader } from '@/components/ui/auto-modal';
import { Badge } from 'lucide-react';

interface props {
    item?: Record<string, any>;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const InventoryCard = ({ item, open, setOpen }: props) => {
    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalContent className="w-xl">
                <ModalHeader>
                    <ModalTitle>{item?.name}</ModalTitle>
                </ModalHeader>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="h-10">
                            <p className="text-sm font-medium">Marca</p>
                            <p className="text-muted-foreground text-sm">{item?.brand}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="h-10">
                            <p className="text-sm font-medium">Modelo</p>
                            <p className="text-muted-foreground text-sm">{item?.model}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="h-10">
                            <p className="text-sm font-medium">Factura</p>
                            <p className="text-muted-foreground text-sm">{item?.bill}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="h-10">
                            <p className="text-sm font-medium">Serie</p>
                            <p className="text-muted-foreground text-sm">{item?.serie}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="h-10">
                            <p className="text-sm font-medium">Cantidad</p>
                            <p className="text-muted-foreground text-sm">{item?.amount}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="h-10">
                            <p className="text-sm font-medium">Precio unitario</p>
                            <p className="text-muted-foreground text-sm">${item?.price}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="h-10">
                            <p className="text-sm font-medium">Precio total</p>
                            <p className="text-muted-foreground text-sm">${item?.price * item?.amount}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="h-10">
                            <p className="text-sm font-medium">Observaciones</p>
                            <p className="text-muted-foreground text-sm">{item?.observations}</p>
                        </div>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    );
};

export default InventoryCard;
