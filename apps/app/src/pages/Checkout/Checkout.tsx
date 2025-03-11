import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from 'react-router';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
    const [searchParams] = useSearchParams();

    const secret = searchParams.get('secret');

    return (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret: secret }}>
            <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
    );
};

export default Checkout;
