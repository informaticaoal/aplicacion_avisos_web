'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import Home from './home/page';
import Login from './login/page';
import { auth } from '@/firebase/firebase.config';

export default function Index() {
  const [user] = useAuthState(auth); // Simulación de estado de autenticación

  return (
    <>
      {user && !user.isAnonymous ? <Home /> : <Login />}
    </>
  );
}
