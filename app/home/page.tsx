'use client';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { SignedIn } from '../components/signed-in';
import { SignedOut } from '../components/signed-out';
import { auth } from '@/firebase/firebase.config';

export default function Home() {
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <h2 className="text-xl ml-10 font-bold text-primary">
            Aplicación de Avisos <span>O</span>
            <span>A</span>L
          </h2>
        </div>
        <SignedIn>
          <div className="flex-none">
            <button className="btn btn-square btn-ghost"></button>
          </div>
        </SignedIn>
      </div>
    </>
  );
}
