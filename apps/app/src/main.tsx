import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import { Layout } from './components/common/layout/Layout';
import { AuthLayout } from './components/common/layout/AuthLayout';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';

const SelectDashboard = lazy(() => import('./pages/Dashboard/SelectDashboard'));
const Members = lazy(() => import('./pages/Members/Members'));
const Finances = lazy(() => import('./pages/Finances/Finances'));
const Blog = lazy(() => import('./pages/Blog/Blog'));
const Website = lazy(() => import('./pages/Website/Website'));
const Certificates = lazy(() => import('./pages/Certificates/Certificates'));
const Inventory = lazy(() => import('./pages/Inventory/Inventory'));
const Account = lazy(() => import('./pages/Account/Account'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Treasury = lazy(() => import('./pages/Treasury/Treasury'));
const Pricing = lazy(() => import('./pages/Pricing/Pricing'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const Presentations = lazy(() => import('./pages/Presentations/Presentations'));
const Slides = lazy(() => import('./pages/Slides/Slides'));
const Projection = lazy(() => import('./pages/Projection/Projection'));
const Error404 = lazy(() => import('./pages/404/404'));

import LoginForm from './pages/Auth/LoginForm';
import SignupForm from './pages/Auth/SignupForm';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Providers>
            <BrowserRouter>
                <Suspense fallback={<div className="flex justify-center items-center w-full h-screen bg-dashboardbg">Cargando...</div>}>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<SelectDashboard />} />
                            <Route path="/members" element={<Members />} />
                            <Route path="/finances" element={<Finances />} />
                            <Route path="/inventory" element={<Inventory />} />
                            <Route path="/certificates" element={<Certificates />} />
                            <Route path="/presentations" element={<Presentations />} />
                            <Route path="/website" element={<Website />} />
                            <Route path="/finances/treasury" element={<Treasury />} />
                            <Route path="/presentations/slides" element={<Slides />} />
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

                        <Route path="/projection" element={<Projection />} />
                        <Route path="*" element={<Error404 />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </Providers>
        <Toaster
            position="top-right"
            containerClassName="toaster"
            toastOptions={{
                duration: 3000,
                className: 'toast',
            }}
        />
    </StrictMode>
);
