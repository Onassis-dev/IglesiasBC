import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const UpgradePlanMessage = () => {
    const [plan, setPlan] = useState(0);
    const [userId, setUserId] = useState<null | string>('');
    console.log(userId);

    useEffect(() => {
        setPlan(parseInt(localStorage.getItem('plan') || '0'));
        setUserId(localStorage.getItem('userId'));
    }, []);

    return (
        <Dialog>
            <DialogContent className="p-3 xs:p-6 max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Desbloquea mas funciones</DialogTitle>
                    <DialogDescription>
                        Obtén acceso a características avanzadas que te ayudarán a maximizar tu experiencia. Actualiza ahora para aprovechar todo lo
                        que ofrecemos.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-wrap justify-between gap-4">
                    {plan === 0 && (
                        <div className="grid gap-4 border rounded-lg p-4 w-full md:flex-1">
                            <div className="flex flex-col items-start gap-4">
                                <h3 className="text-lg font-medium">Plan Base</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckIcon className="size-4 text-green-500" />
                                        Registro de 150 personas
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckIcon className="size-4 text-green-500" />
                                        10 usuarios
                                    </li>
                                    <li className="flex items items-center gap-2">
                                        <CheckIcon className="size-4 text-green-500" />
                                        Modulo de pagina web
                                    </li>
                                    <li className="flex items items-center gap-2">
                                        <CheckIcon className="size-4 text-green-500" />
                                        Modulo de inventario
                                    </li>
                                    <li className="flex items items-center gap-2">
                                        <CheckIcon className="size-4 text-green-500" />
                                        Modulo de finanzas básico
                                    </li>
                                </ul>
                                <a className="w-full mt-auto" href="/precios">
                                    <Button size="sm" className="w-full">
                                        Actualizar
                                    </Button>
                                </a>
                            </div>
                        </div>
                    )}
                    <div className="grid gap-4 border rounded-lg p-4 w-full md:flex-1">
                        <div className="flex flex-col items-start gap-4">
                            <h3 className="text-lg font-medium">Plan Avanzado</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="size-4 text-green-500" />
                                    Registro de 300 personas
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="size-4 text-green-500" />
                                    20 usuarios
                                </li>
                                <li className="flex items items-center gap-2">
                                    <CheckIcon className="size-4 text-green-500" />
                                    Modulo de pagina web
                                </li>
                                <li className="flex items items-center gap-2">
                                    <CheckIcon className="size-4 text-green-500" />
                                    Modulo de inventario
                                </li>
                                <li className="flex items items-center gap-2">
                                    <CheckIcon className="size-4 text-green-500" />
                                    Modulo de finanzas avanzado
                                </li>
                                <li className="flex items items-center gap-2">
                                    <CheckIcon className="size-4 text-green-500" />
                                    Modulo de blog
                                </li>
                                <li className="flex items items-center gap-2">
                                    <CheckIcon className="size-4 text-green-500" />
                                    Modulo de clases
                                </li>
                            </ul>
                            <a className="w-full mt-auto" href="/precios">
                                <Button size="sm" className="w-full">
                                    Actualizar
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpgradePlanMessage;
