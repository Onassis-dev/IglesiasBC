import { saveUserData } from '@/lib/accountFunctions';
import { api, tsr } from '@/lib/boilerplate';
import { LoginSchema, RegisterSchema } from './auth.models';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { z } from 'zod';

export async function login(values: z.infer<typeof LoginSchema>, cb: () => void) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        const refreshToken = user.refreshToken;

        const userData: any = await api(tsr.auth.login, { email: values.email, token, refreshToken });

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

        if (!user?.email || !user?.displayName) throw new Error('Error al iniciar sesión con Google');
        const userData: any = await api(tsr.auth.google, { email: user.email, token, refreshToken, username: user.displayName });

        localStorage.setItem('photo', user.photoURL || '');
        saveUserData(userData);

        cb();
    } catch (err: any) {
        if (err.code === 'auth/too-many-requests') throw new Error('Demasiados intentos fallidos');
        if (err.code === 'auth/invalid-action-code') throw new Error('El link de acceso es inválido');
        if (err) throw err;
    }
}

export async function signup(values: z.infer<typeof RegisterSchema>, cb: () => void) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        const refreshToken = user.refreshToken;
        const userData: any = await api(tsr.auth.signup, { username: values.username, email: values.email, token, refreshToken });

        saveUserData(userData);

        cb();
    } catch (err: any) {
        // Como ventana emergente
        if (err.code === 'auth/email-already-in-use') throw new Error('El correo ya fue registrado, inicia sesión en su lugar');
        if (err.code === 'auth/too-many-requests') throw new Error('Demasiados intentos fallidos');
        throw err;
    }
}
