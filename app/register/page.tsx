"use client";
import Form from 'next/form';
import { handleSubmit } from './actions';
import { useActionState } from 'react';

export default function Register() {

    const [error, action, state] = useActionState(handleSubmit, "");
    
    return (
    <>
        <div className="hero bg-base-200 min-h-screen">
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <Form className="card-body" action={action}>
                        <fieldset className="fieldset">
                            <label className="label">Nombre y apellidos</label>
                            <input type="text" className="input" placeholder="Nombre y apellidos" id='fullname' name='fullname'/>
                            <label className="label">Correo electrónico</label>
                            <input type="email" className="input" placeholder="Email" id='email' name='email'/>
                            <label className="label">Contraseña</label>
                            <input type="password" className="input" placeholder="Contraseña" id='password' name='password'/>
                            {state == true ? (
                                <button className="btn btn-neutral mt-4" disabled>
                                    Registrando...
                                </button>
                            ) : (
                                <button className="btn btn-primary mt-4">
                                    Registrarse
                                </button>
                            )}
                        </fieldset>
                    </Form>
                </div>
            </div>
    </>
    );
}