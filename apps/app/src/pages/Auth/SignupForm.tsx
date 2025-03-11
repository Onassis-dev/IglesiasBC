import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/common/PasswordInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import '@/lib/boilerplate';
import { showPromise } from '@/lib/showFunctions.tsx';
import { useEffect, useState } from 'react';
import { useRegisterSchema } from './auth.models';
import { useNavigate } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { signInWithGoogle, signup } from './auth.lib';

const SignupForm = () => {
    const registerForm = useRegisterSchema();
    const [redirect, setRedirect] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const redirectUrl = queryParams.get('redirect') || '/';

        setRedirect(redirectUrl);
    }, []);

    return (
        <>
            <Card className="w-full border-0 shadow-none sm:shadow-sm sm:border max-w-sm">
                <CardHeader className="pb-0">
                    <CardTitle className="text-xl text-center">Registrarse</CardTitle>
                    <CardDescription className="text-center">Regístrate con tu cuenta de google</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <Button variant={'outline'} className="w-full flex gap-3" onClick={() => signInWithGoogle(() => navigate(redirect))}>
                        <img src="/google.svg" alt="google" className="w-5 h-5" />
                        Continuar con Google
                    </Button>

                    <Separator className="my-4">O usa tu correo</Separator>

                    <Form {...registerForm}>
                        <form
                            onSubmit={registerForm.handleSubmit((v: any) =>
                                showPromise(
                                    signup(v, () => navigate(redirect)),
                                    'Ingreso'
                                )
                            )}
                        >
                            <FormField
                                control={registerForm.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre de usuario</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correo electrónico</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <PasswordInput field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className="w-full" type="submit">
                                Registrarse
                            </Button>
                        </form>

                        <p className="text-sm text-center mt-6">
                            Ya tienes una cuenta?{' '}
                            <a href="/login" className="text-blue">
                                Iniciar sesión
                            </a>
                        </p>
                    </Form>
                </CardContent>
            </Card>

            <p className="mt-2 text-[13px] opacity-60 text-center max-w-xs w-full">
                Al registrarte, aceptas los{' '}
                <a target="_blank" className="underline" href="/terminos-y-condiciones">
                    términos y condiciones
                </a>{' '}
                y{' '}
                <a target="_blank" className="underline" href="/politica-de-privacidad">
                    la política de privacidad
                </a>
                .
            </p>
        </>
    );
};

export default SignupForm;
