import Link from 'next/link';
import { SignedIn } from '../signed-in';
import { SignedOut } from '../signed-out';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase.config';

export default function Navbar() {
  const [signOut] = useSignOut(auth);

  return (
    <nav className="navbar bg-blue-50 shadow-sm">
      <div className="flex-1">
        <h2 className="text-xl ml-10 font-bold text-primary">
          Aplicación de Avisos <span className="text-neutral">O</span>
          <span className="text-secondary">A</span>
          <span className="text-black">L</span>
        </h2>
      </div>
      <SignedIn>
        <div className="mr-10">
          <button className="btn btn-ghost px-4 py-2" onClick={signOut}>
            Cerrar sesión
          </button>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="mr-10">
          <Link href="/login" className="btn btn-ghost px-4 py-2">
            Iniciar sesión
          </Link>
        </div>
      </SignedOut>
    </nav>
  );
}
