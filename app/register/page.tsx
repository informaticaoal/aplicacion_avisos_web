'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    useAuthState,
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase.config';

export default function Register() {
    const router = useRouter();
    const [createUser] = useCreateUserWithEmailAndPassword(auth);
    const [sendEmailVerification] = useSendEmailVerification(auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const userCredential = await createUser(email, password);
        if (userCredential) {
            const userEmail = userCredential.user.email;
            console.log('Usuario creado con UID:', userEmail);
        }
    } catch (error) {
        console.error('Error al crear el usuario:', error);
    }
    await sendEmailVerification();
    // router.push('/login');
  };

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <label className="label">Correo electrónico</label>
              <input
                type="email"
                className="input"
                placeholder="Email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="label">Contraseña</label>
              <input
                type="password"
                className="input"
                placeholder="Contraseña"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="btn btn-primary mt-4">Registrarse</button>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}
