'use client';
import Navbar from "@/app/components/layouts/Navbar";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useState } from "react";

export default function NuevoAviso() {
  const db = getFirestore();

  const [sent, setSent] = useState(false);
  async function addAlert(dataDescription : string, dataCategory : string) {
    try {
      const docRef = await addDoc(collection(db, 'avisos'), {
        descripcion: dataDescription,
        nivelUrgencia: dataCategory,
        fechaCreacion: Math.floor(new Date().getTime() / 1000),
        sincronizado: true,
        urlFoto: null,
      });
      console.log("Aviso agregado con ID: ", docRef.id);
    } catch (error) {
      console.error("Error al agregar el aviso en la base de datos: ", error);
    }
  }

  const handleSubmit = async (formData: any) => {
    const dataDescription = formData.get('descripcion');
    const dataCategory = formData.get('options');
    addAlert(dataDescription, dataCategory);
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <main className="bg-base-100 container mx-auto mt-10">
        <h1 className="text-4xl font-bold mb-10">Creación de avisos</h1>
        <form action={handleSubmit} className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                Descripción del aviso
              </label>
              <textarea placeholder="Detalles del aviso" className="textarea textarea-primary" name="descripcion" onChange={() => {setSent(false)}}></textarea>
            </div>
            
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                Categoria del aviso
              </label>
              <div className="join mt-2">
                <input className="join-item btn btn-primary btn-outline" type="radio" name="options" aria-label="Leve" value='Leve'/>
                <input className="join-item btn btn-warning btn-outline" type="radio" name="options" aria-label="Moderado" value='Moderado'/>
                <input className="join-item btn btn-secondary btn-outline" type="radio" name="options" aria-label="Alto" value='Alto'/>
                <input className="join-item btn btn-error btn-outline" type="radio" name="options" aria-label="Grave" value='Grave'/>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <button className="btn btn-primary text-white mt-5" type="submit">
                Crear aviso
              </button>
            </div>
            {sent && (
              <div className="toast m-20">
                <div className="alert alert-success">
                  <span>Aviso creado exitosamente</span>
                </div>
              </div>
            )}
          </div>
        </form>
      </main>
    </>
  );
}
