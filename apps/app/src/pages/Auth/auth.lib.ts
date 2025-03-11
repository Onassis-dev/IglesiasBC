import { saveUserData } from '@/lib/accountFunctions';
import { api } from '@/lib/boilerplate';
import { LoginSchema } from './auth.models';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { z } from 'zod';

export async function login(values: z.infer<typeof LoginSchema>, cb: () => void) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        const refreshToken = user.refreshToken;

        const userData = (
            await api.post('/auth/login', {
                email: values.email,
                token,
                refreshToken,
            })
        ).data;

        saveUserData(userData);

        cb();
    } catch (err: any) {
        if (err.code === 'auth/invalid-login-credentials') throw new Error('Correo o contraseña inválidos');
        if (err.code === 'auth/invalid-credential') throw new Error('Correo o contraseña inválidos');
        if (err.code === 'auth/too-many-requests') throw new Error('Demasiados intentos fallidos');
        throw err;
    }
}

export async function signInWithGoogle(cb: () => void) {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const user = result.user;
        const token = await user.getIdToken();
        const refreshToken = user.refreshToken;

        const userData = (
            await api.post('/auth/google', {
                email: user.email,
                token,
                refreshToken,
                username: user.displayName,
            })
        ).data;

        localStorage.setItem('photo', user.photoURL || '');
        saveUserData(userData);

        cb();
    } catch (err: any) {
        if (err.code === 'auth/invalid-login-credentials') throw new Error('Correo o contraseña inválidos');
        if (err.code === 'auth/invalid-credential') throw new Error('Correo o contraseña inválidos');
        if (err.code === 'auth/too-many-requests') throw new Error('Demasiados intentos fallidos');
        throw err;
    }
}

export async function signup(values: z.infer<typeof LoginSchema>, cb: () => void) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        const refreshToken = user.refreshToken;
        const userData = (await api.post('/auth/signup', { ...values, token, refreshToken })).data;
        userData;

        saveUserData(userData);

        cb();
    } catch (err: any) {
        // Como ventana emergente
        if (err.code === 'auth/email-already-in-use') throw new Error('El correo ya fue registrado, inicia sesión en su lugar');
        if (err.code === 'auth/too-many-requests') throw new Error('Demasiados intentos fallidos');
        throw err;
    }
}
