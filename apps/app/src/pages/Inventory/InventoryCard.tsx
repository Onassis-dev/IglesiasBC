import { api } from '@/lib/boilerplate';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { Badge } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface props {
    id?: string | number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const InventoryCard = ({ id, open, setOpen }: props) => {
    const { data: item } = useQuery({
        queryKey: ['item', id],
        queryFn: async () => (await api.get(`/inventory/${id}`)).data,
        initialData: {},
        enabled: !!id,
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-xl">
                <DialogHeader>
                    <DialogTitle>{item.name}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Marca</p>
                            <p className="text-muted-foreground text-sm">{item.brand}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Modelo</p>
                            <p className="text-muted-foreground text-sm">{item.model}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Factura</p>
                            <p className="text-muted-foreground text-sm">{item.bill}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Serie</p>
                            <p className="text-muted-foreground text-sm">{item.serie}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Cantidad</p>
                            <p className="text-muted-foreground text-sm">{item.amount}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Precio unitario</p>
                            <p className="text-muted-foreground text-sm">${item.price}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Precio total</p>
                            <p className="text-muted-foreground text-sm">${item.price * item.amount}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                            <Badge className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Observaciones</p>
                            <p className="text-muted-foreground text-sm">{item.observations}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InventoryCard;
