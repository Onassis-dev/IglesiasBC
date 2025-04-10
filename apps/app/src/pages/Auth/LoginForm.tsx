import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import ResetPasswordForm from './ResetPasswordForm';
import { showPromise } from '@/lib/showFunctions.tsx';
import { auth } from '@/lib/firebase';
import { useLoginSchema } from './auth.models';
import PasswordInput from '@/components/common/PasswordInput';
import { useNavigate } from 'react-router';
import { login, signInWithGoogle } from './auth.lib';
import { Separator } from '@/components/ui/separator';

const LoginForm = () => {
    const loginForm = useLoginSchema();
    const [open2, setOpen2] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) navigate('/');
    }, [navigate]);

    return (
        <Card className="w-full border-0 shadow-none sm:shadow-sm sm:border max-w-sm">
            <CardHeader className="pb-0">
                <CardTitle className="text-xl text-center">Bienvenido</CardTitle>
                <CardDescription className="text-center">Inicia sesion con tu cuenta de google</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <Button variant={'outline'} className="w-full flex gap-3" onClick={() => signInWithGoogle(() => navigate('/'))}>
                    <img src="/google.svg" alt="google" className="w-5 h-5" />
                    Continuar con Google
                </Button>

                <Separator className="my-4">O usa tu correo</Separator>

                <Form {...loginForm}>
                    <form
                        onSubmit={loginForm.handleSubmit((v) =>
                            showPromise(
                                login(v, () => navigate('/')),
                                'Ingreso'
                            )
                        )}
                    >
                        <FormField
                            control={loginForm.control}
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
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="w-full flex justify-between">
                                        Contraseña
                                        <p onClick={() => setOpen2(true)} className=" cursor-pointer text-sm font-normal text-right">
                                            Olvide mi contraseña
                                        </p>
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit">
                            Iniciar sesión
                        </Button>
                    </form>
                    <p className="text-sm text-center mt-6">
                        Aun no tienes una cuenta?{' '}
                        <a href="/signup" className="text-blue">
                            Regístrate
                        </a>
                    </p>
                </Form>
            </CardContent>
            <ResetPasswordForm open={open2} setOpen={setOpen2} auth={auth} />
        </Card>
    );
};

export default LoginForm;
