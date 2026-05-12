import Link from "next/link";

export default function Login() {
    return (
    <>
        <div className="hero bg-base-200 min-h-screen">
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <form>
                            <fieldset className="fieldset">
                                <label className="label">Correo electrónico</label>
                                <input type="email" className="input" placeholder="Email" />
                                <label className="label">Contraseña</label>
                                <input type="password" className="input" placeholder="Contraseña" />
                                <button className="btn btn-primary mt-4">Login</button>
                            </fieldset>
                        </form>
                        <div className="card-actions justify-center">
                        <Link href="/register" className="link link-secondary font-bold text-lg">Registrarse</Link>
                    </div>
                    </div>
                </div>
            </div>
    </>
    );
}