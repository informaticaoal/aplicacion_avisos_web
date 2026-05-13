'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase.config';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

export default function Register() {
  const db = getFirestore();

  const router = useRouter();

  const [createUser] = useCreateUserWithEmailAndPassword(auth);

  const [sendEmailVerification] = useSendEmailVerification(auth);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [sendingData, setSendingData] = useState(false);

  async function addData(dataEmail: string | null) {
    try {
      const docRef = await addDoc(collection(db, 'usuarios'), {
        email: dataEmail,
        role: 'user',
      });
      console.log("Usuario agregado con ID: ", docRef.id);
    } catch (error) {
      console.error("Error al agregar el usuario en la base de datos: ", error);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSendingData(true);
        const userCredential = await createUser(email, password);
        if (userCredential) {
            const userEmail = userCredential.user.email;
            addData(userEmail);
        }
    } catch (error) {
        console.error('Error al crear el usuario:', error);
    } finally {
      await sendEmailVerification();
      setSendingData(false);
      router.push('/login');
    }
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

              {sendingData ? (
                <button className="btn btn-primary text-white mt-5" disabled>
                  Registrando...
                </button>
              ) : (
                <button type="submit" className="btn btn-primary text-white mt-5">
                  Registrarse
                </button>
              )}
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}
