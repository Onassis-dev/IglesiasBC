import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import PricingCards from './PricingCards';

const Pricing = () => {
    const [plan, setPlan] = useState('0');

    useEffect(() => {
        setPlan(localStorage?.getItem('plan') || '');
    }, []);

    return (
        <Tabs defaultValue="mensual">
            <TabsList className="w-72 grid grid-cols-2 mx-auto mb-10">
                <TabsTrigger className="trigger" value="mensual">
                    Mensual
                </TabsTrigger>
                <TabsTrigger className="trigger" value="anual">
                    Anual <span className="ml-2 text-blue">-16%</span>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="mensual">
                {PricingCards(plan, ['', 'base-monthly', 'pro-monthly'], [0, 15, 30], 'mes', [null, null, null])}
            </TabsContent>
            <TabsContent value="anual">{PricingCards(plan, ['', 'base-yearly', 'pro-yearly'], [0, 150, 300], 'año', [null, 30, 60])}</TabsContent>
        </Tabs>
    );
};

export default Pricing;
