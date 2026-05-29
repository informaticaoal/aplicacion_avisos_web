'use client';
import Navbar from "@/app/components/layouts/Navbar";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { FormEvent, useRef, useState } from "react";
import { Storage, ID } from "appwrite";
import { client } from "@/app/appwrite";

export default function NuevoAviso() {
  const db = getFirestore();
  const envBucketId: string = process.env.NEXT_PUBLIC_BUCKET_ID ?? '';
  const storage = new Storage(client);

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function addAlert(dataDescription: string, dataCategory: string) {
    let urlAdjunto: string | null = null;
    let nombreAdjunto: string | null = null;
    let uploadedFileId: string | null = null;

    try {
      if (file) {
        const response = await storage.createFile({
          bucketId: envBucketId,
          fileId: ID.unique(),
          file,
        });
        uploadedFileId = response.$id;
        urlAdjunto = storage.getFileView(envBucketId, response.$id).toString();
        nombreAdjunto = file.name;
      }

      await addDoc(collection(db, "avisos"), {
        descripcion: dataDescription,
        nivelUrgencia: dataCategory,
        fechaCreacion: new Date().getTime(),
        sincronizado: true,
        urlAdjunto,
        nombreAdjunto,
        adjuntoId: uploadedFileId,
      });

      await fetch("/api/fcm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heading: "Nuevo aviso: " + dataCategory,
          content: dataDescription,
          urgency: dataCategory,
        }),
      });
    } catch (error) {
      if (uploadedFileId) {
        await storage.deleteFile(envBucketId, uploadedFileId);
      }
      console.error("Error al agregar el aviso o enviar la notificación: ", error);
      throw error;
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentForm = event.currentTarget;
    const formData = new FormData(currentForm);
    const dataDescription = String(formData.get("descripcion") ?? "");
    const dataCategory = String(formData.get("options") ?? "Normal");
    setSending(true);
    await addAlert(dataDescription, dataCategory);
    setSent(true);
    setSending(false);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    currentForm.reset();
  };

  return (
    <>
      <Navbar />
      <main className="bg-base-100 container mx-auto mt-10">
        <h1 className="text-4xl font-bold mb-10">Creación de avisos</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Descripción del aviso
              </label>
              <textarea
                rows={5}
                placeholder="Detalles del aviso"
                className="textarea textarea-primary"
                name="descripcion"
                onChange={() => {
                  setSent(false);
                }}
              ></textarea>
            </div>

            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                Categoria del aviso
              </label>
              <div className="join mt-2">
                <input
                  className="join-item btn btn-primary btn-outline"
                  type="radio"
                  name="options"
                  aria-label="Leve"
                  value="Leve"
                />
                <input
                  className="join-item btn btn-warning btn-outline"
                  type="radio"
                  name="options"
                  aria-label="Moderado"
                  value="Moderado"
                />
                <input
                  className="join-item btn btn-secondary btn-outline"
                  type="radio"
                  name="options"
                  aria-label="Alto"
                  value="Alto"
                />
                <input
                  className="join-item btn btn-error btn-outline"
                  type="radio"
                  name="options"
                  aria-label="Grave"
                  value="Grave"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Adjunto (opcional)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                className="file-input file-input-primary w-full max-w-xs"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  setSent(false);
                }}
              />
              {file && (
                <p className="text-sm mt-1 text-base-content/60">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              {sending ? (
                <button className="btn btn-primary text-white mt-5" disabled>
                  <span className="loading loading-spinner text-secondary"></span>
                </button>
              ) : (
                <button className="btn btn-primary text-white mt-5" type="submit">
                  Crear aviso
                </button>
              )}
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
