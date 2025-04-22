import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api, tsr } from '@/lib/boilerplate';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/lib/store';
import { cloneElement, type ReactElement } from 'react';
import { AppWindow, Archive, DollarSign, FileBadge, MessageSquareQuote, Presentation, UserRoundCog, Users2 } from 'lucide-react';

const Line = (icon: ReactElement, text: string) => (
    <li className="flex space-x-2 items-center">
        {cloneElement(icon, { className: 'size-4 text-muted-foreground' })}
        <span className="text-muted-foreground text-base">{text}</span>
    </li>
);

const PricingCards = (plan: string, products: string[], prices: number[], period: string, savings: (number | null)[]) => {
    const navigate = useNavigate();
    const { user } = useUserStore((state) => state);
    const handleCheckout = async (product: string) => {
        const result: any = await api(tsr.payments.checkout, { product, email: user?.email || '' });
        navigate(`/checkout?secret=${result.clientSecret}`);
    };

    const getText = (userPlan: number, plan: number) => {
        if (plan === userPlan) return 'Plan activo';
        if (plan < userPlan) return 'Plan inferior';
        if (plan > userPlan) return 'Suscribirse';
    };

    return (
        <div className="gap-10 justify-center max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 w-[90%]">
            <Card className="min-w-xs w-full">
                <CardContent className="p-6 relative">
                    <div>
                        {savings[0] && (
                            <div className="absolute -top-2 right-6 bg-blue px-2 rounded-sm font-medium text-background fadein1">
                                Ahorra ${savings[0]}
                            </div>
                        )}
                        <h2 className="text-2xl font-medium">Plan Gratuito</h2>
                        <p className="mt-2 text-base text-muted-foreground leading-tight">Ideal para iglesias iniciando su gestión digital</p>

                        <p className="mt-5 mb-5">
                            <span className="text-5xl font-medium">${prices[0]}</span>
                            <span className="text-base font-medium text-muted-foreground">/{period}</span>
                        </p>

                        <Button
                            onClick={() => handleCheckout(products[0])}
                            size="sm"
                            className="w-full mb-4 text-base"
                            disabled={parseInt(plan) >= 0}
                        >
                            {getText(parseInt(plan), 0)}
                        </Button>
                    </div>
                    <h3 className="text-sm font-medium tracking-wide uppercase">Incluye</h3>
                    <ul role="list" className="mt-4 space-y-3">
                        {Line(<Users2 />, 'Registro de 50 miembros')}
                        {Line(<UserRoundCog />, '2 usuarios')}
                        {Line(<Presentation />, 'Presentaciones')}
                    </ul>
                </CardContent>
            </Card>
            <Card className="w-full min-w-xs">
                <CardContent className="p-6 relative">
                    <div>
                        {savings[1] && (
                            <div className="absolute -top-2 right-6 bg-blue px-2 rounded-sm font-medium text-background fadein1">
                                Ahorra ${savings[1]}
                            </div>
                        )}
                        <h2 className="text-2xl font-medium">Plan Base</h2>
                        <p className="mt-2 text-base text-muted-foreground leading-tight">Ideal para iglesias listas para modernizarse</p>
                        <p className="mt-5 mb-5">
                            <span className="text-5xl font-medium">${prices[1]}</span>
                            <span className="text-base font-medium text-muted-foreground">/{period}</span>
                        </p>

                        <Button
                            onClick={() => handleCheckout(products[1])}
                            size="sm"
                            className="w-full text-base py-1 mb-4 font-medium"
                            disabled={parseInt(plan) >= 1}
                        >
                            {getText(parseInt(plan), 1)}
                        </Button>
                    </div>
                    <h3 className="text-sm font-medium tracking-wide uppercase">Incluye</h3>
                    <ul role="list" className="mt-4 space-y-3">
                        {Line(<Users2 />, 'Registro de 150 miembros')}
                        {Line(<UserRoundCog />, '15 usuarios')}
                        {Line(<Presentation />, 'Presentaciones')}
                        {Line(<FileBadge />, 'Certificados')}
                        {Line(<AppWindow />, 'Pagina web')}
                        {Line(<MessageSquareQuote />, 'Blog')}
                        {Line(<DollarSign />, 'Finanzas')}
                    </ul>
                </CardContent>
            </Card>
            <Card className="w-full min-w-xs">
                <CardContent className="p-6 relative">
                    <div>
                        {savings[2] && (
                            <div className="absolute -top-2 right-6 bg-blue px-2 rounded-sm font-medium text-background fadein1">
                                Ahorra ${savings[2]}
                            </div>
                        )}
                        <h2 className="text-2xl font-medium">Plan Avanzado</h2>
                        <p className="mt-2 text-base text-muted-foreground leading-tight">Ideal para iglesias que requieren gestión profesional</p>

                        <p className="mt-5 mb-5">
                            <span className="text-5xl font-medium">${prices[2]}</span>
                            <span className="text-base font-medium text-muted-foreground">/{period}</span>
                        </p>

                        <Button
                            onClick={() => handleCheckout(products[2])}
                            size="sm"
                            className="w-full text-base py-1 mb-4 font-medium"
                            disabled={parseInt(plan) >= 2}
                        >
                            {getText(parseInt(plan), 2)}
                        </Button>
                    </div>
                    <h3 className="text-sm font-medium tracking-wide uppercase">Incluye</h3>
                    <ul role="list" className="mt-4 space-y-3">
                        {Line(<Users2 />, 'Registro de 300 miembros')}
                        {Line(<UserRoundCog />, '30 usuarios')}
                        {Line(<Presentation />, 'Presentaciones')}
                        {Line(<FileBadge />, 'Certificados')}
                        {Line(<AppWindow />, 'Pagina web')}
                        {Line(<MessageSquareQuote />, 'Blog')}
                        {Line(<DollarSign />, 'Finanzas')}
                        {Line(<Archive />, 'Inventario')}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default PricingCards;
