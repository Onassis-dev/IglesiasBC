import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import './index.css';
import Members from './pages/Members/Members';
import { QueryClientProvider } from '@tanstack/react-query';
import Finances from './pages/Finances/Finances';
import Blog from './pages/Blog/Blog';
import Website from './pages/Website/Website';
// import Classes from "./pages/Classes/Classes";
// import Certificates from "./pages/Certificates/Certificates";
import Inventory from './pages/Inventory/Inventory';
import LoginForm from './pages/Auth/LoginForm';
import Account from './pages/Account/Account';
import { useQueryStore } from './lib/store';
import SignupForm from './pages/Auth/SignupForm';
import SelectDashboard from './pages/Dashboard/SelectDashboard';
import { Layout } from './components/common/layout/Layout';
import Settings from './pages/Settings/Settings';
import { Error404 } from './pages/404/404';
import { Toaster } from 'react-hot-toast';
import { AuthLayout } from './components/common/layout/AuthLayout';
import Treasury from './pages/Treasury/Treasury';
import Pricing from './pages/Pricing/Pricing';
import Checkout from './pages/Checkout/Checkout';

const queryClient = useQueryStore.getState().queryClient;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<SelectDashboard />} />
                        <Route path="/members" element={<Members />} />
                        <Route path="/finances" element={<Finances />} />
                        <Route path="/inventory" element={<Inventory />} />
                        {/* <Route path="/certificates" element={<Certificates />} /> */}
                        {/* <Route path="/classes" element={<Classes />} /> */}
                        <Route path="/website" element={<Website />} />
                        <Route path="/finances" element={<Finances />} />
                        <Route path="/finances/treasury" element={<Treasury />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/checkout" element={<Checkout />} />
                    </Route>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/signup" element={<SignupForm />} />
                    </Route>
                    <Route element={<Layout />}>
                        <Route path="*" element={<Error404 />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
        <Toaster />
    </StrictMode>
);
