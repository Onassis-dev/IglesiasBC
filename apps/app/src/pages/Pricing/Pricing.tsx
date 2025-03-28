import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import PricingCards from './PricingCards';

const Pricing = () => {
    const [plan, setPlan] = useState('0');

    useEffect(() => {
        setPlan(localStorage?.getItem('plan') || '');
    }, []);

    return (
        <Tabs defaultValue="anual">
            <TabsList className="w-72 grid grid-cols-2 mx-auto mb-10 border">
                <TabsTrigger className="trigger" value="mensual">
                    Mensual
                </TabsTrigger>
                <TabsTrigger className="trigger" value="anual">
                    Anual <span className="ml-2 text-cyan">-16%</span>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="mensual">
                {PricingCards(plan, ['', 'base-monthly', 'pro-monthly'], [0, 199, 399], 'mes', [null, null, null])}
            </TabsContent>
            <TabsContent value="anual">{PricingCards(plan, ['', 'base-yearly', 'pro-yearly'], [0, 1990, 3990], 'año', [null, 390, 790])}</TabsContent>
        </Tabs>
    );
};

export default Pricing;
