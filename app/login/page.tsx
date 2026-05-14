'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase.config';
import Link from 'next/link';
import Navbar from '../components/layouts/Navbar';

export default function Login() {
  const router = useRouter();
  const [signInUserWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user] = useAuthState(auth);
  const [errorLogin, setErrorLogin] = useState<Boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signInUserWithEmailAndPassword(email, password);
    if (result) {
      router.push('/home');
    } else {
      setErrorLogin(true);
    }
  };

  return (
    <>
    <Navbar />
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

              <button className="btn btn-primary mt-4">Iniciar sesión</button>
              {user?.emailVerified === false && (
                <p className="text-red-500 mt-2">
                  Por favor, verifica tu correo electrónico antes de iniciar sesión.
                </p>
              )}
              {errorLogin && (
                <p className="text-red-500 mt-2">
                  Error al iniciar sesión. Por favor, verifica tus credenciales.
                </p>
              )}
              <div className="card-actions mt-3 justify-center">
                <Link href="/register" className="link link-secondary font-bold text-lg">
                  Registrarse
                </Link>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}
