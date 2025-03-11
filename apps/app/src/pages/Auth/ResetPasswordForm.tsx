import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { z } from 'zod';
import { showPromise } from '@/lib/showFunctions.tsx';
import { sendPasswordResetEmail, type Auth } from 'firebase/auth';
import { resetPasswordSchema, useResetPasswordSchema } from './auth.models';

interface props {
    open: boolean;
    setOpen: any;
    auth: Auth;
}

const ResetPasswordForm = ({ open, setOpen, auth }: props) => {
    const resetPasswordForm = useResetPasswordSchema();

    const handleSubmit: any = async (values: z.infer<typeof resetPasswordSchema>) => {
        await sendPasswordResetEmail(auth, values.email);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Restablecer contraseña</DialogTitle>
                    <DialogDescription>Se te enviara un mensaje a tu correo electrónico para restablecer tu contraseña</DialogDescription>
                </DialogHeader>

                <Form {...resetPasswordForm}>
                    <form onSubmit={resetPasswordForm.handleSubmit((v) => showPromise(handleSubmit(v), 'Correo enviado'))}>
                        <FormField
                            control={resetPasswordForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Correo electrónico" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit" onClick={() => {}}>
                                    Enviar correo
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ResetPasswordForm;
