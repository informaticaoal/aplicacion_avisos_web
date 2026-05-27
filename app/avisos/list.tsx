import { collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PaperClipIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

function renderAdjunto(aviso: { id: string; [key: string]: any }) {
  if (!aviso.urlAdjunto) return null;
  const nombre: string = aviso.nombreAdjunto ?? 'Adjunto';

  return (
    <a
      href={aviso.urlAdjunto}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-sm bg-base-100 btn-outline mt-2 w-full justify-start"
    >
      <PaperClipIcon className="h-4 w-4" />
      <span className="truncate">{nombre}</span>
    </a>
  );
}

export default function List() {

    const db = getFirestore();
    const router = useRouter();
    const [avisos, setAvisos] = useState<Array<{id: string; [key: string]: any}>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [avisoAEliminar, setAvisoAEliminar] = useState<{id: string; [key: string]: any} | null>(null);
    const [eliminando, setEliminando] = useState(false);
    const avisosPerPage = 8;

    const indexOfLastAviso = currentPage * avisosPerPage;
    const indexOfFirstAviso = indexOfLastAviso - avisosPerPage;
    const currentAvisos = avisos.slice(indexOfFirstAviso, indexOfLastAviso);

    async function fetchAvisos() {
        try {
            const q = query(collection(db, "avisos"), orderBy("fechaCreacion", "desc"));
            const docRef = await getDocs(q);
            const collectedData = docRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAvisos(collectedData);
        } catch (error) {
            console.error("Error al obtener los avisos: ", error);
        }
    }

    async function deleteOldAvisos() {
        try {
            const docRef = await getDocs(collection(db, "avisos"));
            const now = new Date().getTime();
            const collectedData: Array<{id: string; [key: string]: any}> = docRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            collectedData.forEach(async (aviso) => {
                if (now - aviso.fechaCreacion >= 365 * 24 * 60 * 60 * 1000) { // Si el aviso tiene más de 1 año
                    await deleteDoc(doc(db, "avisos", aviso.id));
                    if (aviso.adjuntoId) {
                        await fetch('/api/appwrite/delete-file', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ fileId: aviso.adjuntoId }),
                        });
                    }
                }
            });
            setAvisos(collectedData.filter(aviso => now - aviso.fechaCreacion < 365 * 24 * 60 * 60 * 1000)); // Actualiza el estado para mostrar solo los avisos recientes
        } catch (error) {
            console.error("Error al eliminar los avisos antiguos: ", error);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        deleteOldAvisos();
        fetchAvisos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleDelete() {
        if (!avisoAEliminar) return;
        setEliminando(true);
        try {
            await deleteDoc(doc(db, "avisos", avisoAEliminar.id));
            if (avisoAEliminar.adjuntoId) {
                await fetch('/api/appwrite/delete-file', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileId: avisoAEliminar.adjuntoId }),
                });
            }
            await fetchAvisos();
        } catch (error) {
            console.error("Error al eliminar el aviso: ", error);
        } finally {
            setEliminando(false);
            setAvisoAEliminar(null);
            (document.getElementById('modal_confirmar_eliminar') as HTMLDialogElement)?.close();
        }
    }
  const totalPages = Math.ceil(avisos.length / avisosPerPage);

  return (
    <>
      <h1 className="text-3xl font-bold mb-5">Listado de Avisos</h1>
      <div className="grid grid-cols-2">
        {currentAvisos && currentAvisos.length > 0 ? currentAvisos.map(aviso => (
        <div className="card card-border bg-primary/7 w-100 my-2" key={aviso.id}>
            <div className="card-body">
                <h2 className="card-title">{aviso.descripcion}</h2>
                <p>Fecha de creación: {new Date(aviso.fechaCreacion).getDate()}/
                  {new Date(aviso.fechaCreacion).getMonth() + 1}/{new Date(aviso.fechaCreacion).getFullYear()} — 
                  {new Date(aviso.fechaCreacion).getHours() >= 10 ? new Date(aviso.fechaCreacion).getHours() : 
                  '0' + new Date(aviso.fechaCreacion).getHours()}:
                  {new Date(aviso.fechaCreacion).getMinutes().toString().padStart(2, '0')}</p>
                <div className="my-1">
                    {renderAdjunto(aviso)}
                </div>
                <div className="card-actions justify-between items-center mt-2">
                  <div>
                  {aviso.nivelUrgencia === "Leve" ? (
                    <button className="btn btn-sm btn-primary">Leve</button>  
                  ): aviso.nivelUrgencia === "Moderado" ? (
                    <button className="btn btn-sm btn-warning">Moderado</button>  
                  ) : aviso.nivelUrgencia === "Alto" ? (
                    <button className="btn btn-sm btn-secondary">Alto</button>
                  ) : (
                      <button className="btn btn-sm btn-error">Grave</button>
                  )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-sm btn-ghost text-info text-lg"
                      onClick={() => router.push(`/avisos/${aviso.id}/editar`)}
                      aria-label="Editar aviso"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="btn btn-sm btn-ghost text-error text-lg"
                      aria-label="Eliminar aviso"
                      onClick={() => {
                        setAvisoAEliminar(aviso);
                        (document.getElementById('modal_confirmar_eliminar') as HTMLDialogElement)?.showModal();
                      }}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
            </div>
        </div>
      ))
      : (<p>No hay avisos disponibles.</p>)}
      </div>
      <dialog id="modal_confirmar_eliminar" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirmar eliminación</h3>
          <p className="py-4">¿Estás seguro de que quieres eliminar este aviso? Esta acción no se puede deshacer.</p>
          <div className="modal-action">
            <button
              className="btn btn-error"
              onClick={handleDelete}
              disabled={eliminando}
            >
              {eliminando ? <span className="loading loading-spinner"></span> : 'Eliminar'}
            </button>
            <form method="dialog">
              <button className="btn btn-ghost" disabled={eliminando}>Cancelar</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>cerrar</button></form>
      </dialog>
      {totalPages > 1 && (
        <div className="join my-10 flex justify-center">
          <button
            className="join-item btn"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >«</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >{page}</button>
          ))}
          <button
            className="join-item btn"
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >»</button>
        </div>
      )}
    </>
  );
}