import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { api, tsr } from '@/lib/boilerplate';
import { useNavigate } from 'react-router';

const Line = (text: string) => (
    <li className="flex space-x-3 items-center">
        <Check className="h-4 w-5 text-primary " />
        <span className="text-base text-muted-foreground">{text}</span>
    </li>
);

const pricingCards = (plan: string, products: string[], prices: number[], period: string, savings: (number | null)[]) => {
    const navigate = useNavigate();
    const handleCheckout = async (product: string) => {
        const result: any = await api(tsr.payments.checkout, { product });
        navigate(`/checkout?secret=${result.clientSecret}`);
    };

    const getText = (userPlan: number, plan: number) => {
        if (plan === userPlan) return 'Plan activo';
        if (plan < userPlan) return 'Plan inferior';
        if (plan > userPlan) return 'Suscribirse';
    };

    return (
        <div className="flex gap-5 px-4 md:px-8 justify-center flex-wrap">
            <Card className="w-full min-w-xs max-w-sm">
                <CardContent className="p-6 relative">
                    <div>
                        {savings[0] && (
                            <div className="absolute -top-2 right-6 bg-cyan px-2 rounded-sm font-medium text-background fadein1">
                                Ahorra ${savings[0]}
                            </div>
                        )}
                        <h2 className="text-2xl font-medium ">Plan Gratuito</h2>
                        <p className="mt-2 text-base text-muted-foreground leading-tight">Disfruta de funciones básicas</p>

                        <p className="mt-5 mb-5">
                            <span className=" text-5xl font-medium ">${prices[0]}</span>

                            <span className="text-base font-medium text-muted-foreground">/{period}</span>
                        </p>
                        <Button
                            onClick={() => handleCheckout(products[0])}
                            className=" w-full text-lg py-1 mb-4 font-medium"
                            disabled={parseInt(plan) >= 0}
                        >
                            {getText(parseInt(plan), 0)}
                        </Button>
                    </div>
                    <h3 className=" mt-4 text-sm font-medium tracking-wide uppercase">Incluye</h3>
                    <ul role="list" className="mt-4 space-y-2.5">
                        {Line('Registro de 30 personas')}
                        {Line('2 usuarios')}
                        {Line('Miembros')}
                        {/* {Line('Certificados')} */}
                    </ul>
                </CardContent>
            </Card>
            <Card className="w-full min-w-xs max-w-96">
                <CardContent className="p-6 relative">
                    <div>
                        {savings[1] && (
                            <div className="absolute -top-2 right-6 bg-cyan px-2 rounded-sm font-medium text-background fadein1">
                                Ahorra ${savings[1]}
                            </div>
                        )}
                        <h2 className="text-2xl font-medium ">Plan Base</h2>
                        <p className="mt-2 text-base text-muted-foreground leading-tight">¡Crea tu página web hoy mismo!</p>
                        <p className="mt-5 mb-5">
                            <span className=" text-5xl font-medium">${prices[1]}</span>

                            <span className="text-base font-medium text-muted-foreground">/{period}</span>
                        </p>
                        <Button
                            onClick={() => handleCheckout(products[1])}
                            className=" w-full text-lg py-1 mb-4 font-medium"
                            disabled={parseInt(plan) >= 1}
                        >
                            {getText(parseInt(plan), 1)}
                        </Button>
                    </div>
                    <h3 className=" mt-4 text-sm font-medium tracking-wide uppercase">Incluye</h3>
                    <ul role="list" className="mt-4 space-y-2.5">
                        {Line('Registro de 100 personas')}
                        {Line('10 usuarios')}
                        {Line('Miembros')}
                        {/* {Line('Certificados')} */}
                        {Line('Página web')}
                        {Line('Blog')}
                    </ul>
                </CardContent>
            </Card>
            <Card className="w-full min-w-xs max-w-sm">
                <CardContent className="p-6 relative">
                    <div>
                        {savings[2] && (
                            <div className="absolute -top-2 right-6 bg-cyan px-2 rounded-sm font-medium text-background fadein1">
                                Ahorra ${savings[2]}
                            </div>
                        )}
                        <h2 className="text-2xl font-medium ">Plan Avanzado</h2>
                        <p className="mt-2 text-base text-muted-foreground leading-tight">Obtén beneficios y servicios extra</p>

                        <p className="mt-5 mb-5">
                            <span className=" text-5xl font-medium ">${prices[2]}</span>

                            <span className="text-base font-medium text-muted-foreground">/{period}</span>
                        </p>
                        <Button
                            onClick={() => handleCheckout(products[2])}
                            className=" w-full text-lg py-1 mb-4 font-medium"
                            disabled={parseInt(plan) >= 2}
                        >
                            {getText(parseInt(plan), 2)}
                        </Button>
                    </div>
                    <h3 className=" mt-4 text-sm font-medium tracking-wide uppercase">Incluye</h3>
                    <ul role="list" className="mt-4 space-y-2.5">
                        {Line('Registro de 300 personas')}
                        {Line('20 usuarios')}
                        {Line('Miembros')}
                        {/* {Line('Certificados')} */}
                        {Line('Página web')}
                        {Line('Blog')}
                        {Line('Finanzas')}
                        {Line('Inventario')}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default pricingCards;
