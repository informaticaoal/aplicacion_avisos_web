'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SignedIn } from '../components/signed-in';
import { SignedOut } from '../components/signed-out';
import { auth } from '@/firebase/firebase.config';
import Link from 'next/link';
import Navbar from '../components/layouts/Navbar';
import List from '../avisos/list';
import { useEffect } from 'react';

export default function Home() {
  const [user] = useAuthState(auth);

  return (
    <>
      <Navbar />
      <main className="container mx-auto mt-10">
        <SignedIn>
          <div className='grid grid-cols-[30%_auto] gap-28 align-top sm-justify-center lg-justify-start'>
            <div>
              <h1 className="text-3xl font-bold mb-4">Bienvenid@ a la Aplicación de Avisos de OAL Huétor Tájar</h1>
              <p className="text-lg">
                ¡Hola, {user?.email}!</p>
              <p className='text-lg'>
                {new Date().getHours() >= 12
                  ? '¿Cómo te está yendo la tarde?'
                  : '¡Con buena energía por la mañana!'}{' '}
              </p>
              <Link href="/avisos/nuevo" className="btn btn-primary text-white mt-5">
                Añadir aviso
              </Link>
            </div>
            <div>
              <List />
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <h1 className="text-3xl font-bold mb-4">Bienvenido a la Aplicación de Avisos</h1>
          <p className="text-lg">
            Para tener acceso a la aplicación, por favor, inicia sesión con tu cuenta registrada.
          </p>
        </SignedOut>
      </main>
    </>
  );
}
