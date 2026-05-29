'use client';
import Navbar from '@/app/components/layouts/Navbar';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { FormEvent, use, useEffect, useRef, useState } from 'react';
import { Storage, ID } from 'appwrite';
import { client } from '@/app/appwrite';
import { useRouter } from 'next/navigation';

type AvisoData = {
  descripcion: string;
  nivelUrgencia: string;
  urlAdjunto: string | null;
  nombreAdjunto: string | null;
  adjuntoId: string | null;
};

export default function EditarAviso({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = getFirestore();
  const envBucketId: string = process.env.NEXT_PUBLIC_BUCKET_ID ?? '';
  const storage = new Storage(client);
  const router = useRouter();

  const [aviso, setAviso] = useState<AvisoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [nuevoArchivo, setNuevoArchivo] = useState<File | null>(null);
  const [eliminarAdjunto, setEliminarAdjunto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchAviso() {
      try {
        const docRef = doc(db, 'avisos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAviso({
            descripcion: data.descripcion ?? '',
            nivelUrgencia: data.nivelUrgencia ?? '',
            urlAdjunto: data.urlAdjunto ?? null,
            nombreAdjunto: data.nombreAdjunto ?? null,
            adjuntoId: data.adjuntoId ?? null,
          });
        }
      } catch (error) {
        console.error('Error al obtener el aviso: ', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAviso();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!aviso) return;
    const formData = new FormData(event.currentTarget);
    const dataDescription = String(formData.get('descripcion') ?? '');
    const dataCategory = String(formData.get('options') ?? aviso.nivelUrgencia);
    setSaving(true);

    let urlAdjunto = aviso.urlAdjunto;
    let nombreAdjunto = aviso.nombreAdjunto;
    let adjuntoId = aviso.adjuntoId;
    let newUploadedFileId: string | null = null;

    try {
      if (nuevoArchivo) {
        const response = await storage.createFile({
          bucketId: envBucketId,
          fileId: ID.unique(),
          file: nuevoArchivo,
        });
        newUploadedFileId = response.$id;
        urlAdjunto = storage.getFileView(envBucketId, response.$id).toString();
        nombreAdjunto = nuevoArchivo.name;
        adjuntoId = response.$id;
        if (aviso.adjuntoId) {
          await storage.deleteFile(envBucketId, aviso.adjuntoId);
        }
      } else if (eliminarAdjunto && aviso.adjuntoId) {
        await storage.deleteFile(envBucketId, aviso.adjuntoId);
        urlAdjunto = null;
        nombreAdjunto = null;
        adjuntoId = null;
      }

      await updateDoc(doc(db, 'avisos', id), {
        descripcion: dataDescription,
        nivelUrgencia: dataCategory,
        urlAdjunto,
        nombreAdjunto,
        adjuntoId,
      });

      setSaved(true);
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      if (newUploadedFileId) {
        await storage.deleteFile(envBucketId, newUploadedFileId);
      }
      console.error('Error al actualizar el aviso: ', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <>
        <Navbar />
        <main className="bg-base-100 container mx-auto mt-10 flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </main>
      </>
    );

  if (!aviso)
    return (
      <>
        <Navbar />
        <main className="bg-base-100 container mx-auto mt-10">
          <p>Aviso no encontrado.</p>
        </main>
      </>
    );

  return (
    <>
      <Navbar />
      <main className="bg-base-100 container mx-auto mt-10">
        <h1 className="text-4xl font-bold mb-10">Editar aviso</h1>
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
                defaultValue={aviso.descripcion}
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
                  defaultChecked={aviso.nivelUrgencia === 'Leve'}
                />
                <input
                  className="join-item btn btn-warning btn-outline"
                  type="radio"
                  name="options"
                  aria-label="Moderado"
                  value="Moderado"
                  defaultChecked={aviso.nivelUrgencia === 'Moderado'}
                />
                <input
                  className="join-item btn btn-secondary btn-outline"
                  type="radio"
                  name="options"
                  aria-label="Alto"
                  value="Alto"
                  defaultChecked={aviso.nivelUrgencia === 'Alto'}
                />
                <input
                  className="join-item btn btn-error btn-outline"
                  type="radio"
                  name="options"
                  aria-label="Grave"
                  value="Grave"
                  defaultChecked={aviso.nivelUrgencia === 'Grave'}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Adjunto (opcional)
              </label>

              {aviso.adjuntoId && !eliminarAdjunto && !nuevoArchivo && (
                <div className="flex items-center gap-3 mb-3">
                  <a
                    href={aviso.urlAdjunto!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                  >
                    📎 {aviso.nombreAdjunto}
                  </a>
                  <button
                    type="button"
                    className="btn btn-sm btn-error btn-outline"
                    onClick={() => setEliminarAdjunto(true)}
                  >
                    Eliminar adjunto
                  </button>
                </div>
              )}

              {eliminarAdjunto && (
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-error">Se eliminará el adjunto al guardar</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => setEliminarAdjunto(false)}
                  >
                    Deshacer
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="file-input file-input-primary w-full max-w-xs"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setNuevoArchivo(f);
                  if (f) setEliminarAdjunto(false);
                }}
              />
              {nuevoArchivo && (
                <p className="text-sm mt-1 text-base-content/60">
                  {nuevoArchivo.name} ({(nuevoArchivo.size / 1024).toFixed(1)} KB)
                  {aviso.adjuntoId && ' — reemplazará el adjunto actual'}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 flex gap-3">
              {saving ? (
                <button className="btn btn-primary text-white mt-5" disabled>
                  <span className="loading loading-spinner text-secondary"></span>
                </button>
              ) : (
                <button className="btn btn-primary text-white mt-5" type="submit">
                  Guardar cambios
                </button>
              )}
              <button type="button" className="btn btn-ghost mt-5" onClick={() => router.back()}>
                Cancelar
              </button>
            </div>
            {saved && (
              <div className="toast m-20">
                <div className="alert alert-success">
                  <span>Aviso actualizado exitosamente</span>
                </div>
              </div>
            )}
          </div>
        </form>
      </main>
    </>
  );
}
