import { collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import { Storage } from "appwrite";
import { client } from "@/app/appwrite";
import { useEffect, useState } from "react";

function renderAdjunto(aviso: { id: string; [key: string]: any }) {
  if (!aviso.urlAdjunto) return null;
  const nombre: string = aviso.nombreAdjunto ?? 'Adjunto';

  return (
    <a
      href={aviso.urlAdjunto}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-sm btn-outline mt-2 w-full justify-start truncate"
    >
      📎 {nombre}
    </a>
  );
}

export default function List() {

    const db = getFirestore();
    const envBucketId: string = process.env.NEXT_PUBLIC_BUCKET_ID ?? '';
    const storage = new Storage(client);
    const [avisos, setAvisos] = useState<Array<{id: string; [key: string]: any}>>([]);
    const [currentPage, setCurrentPage] = useState(1);
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
                        await storage.deleteFile(envBucketId, aviso.adjuntoId);
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
  const totalPages = Math.ceil(avisos.length / avisosPerPage);

  return (
    <>
      <h1 className="text-3xl font-bold mb-5">Listado de Avisos</h1>
      <div className="grid grid-cols-2">
        {currentAvisos && currentAvisos.length > 0 ? currentAvisos.map(aviso => (
        <div className="card card-border bg-base-100 w-100 my-2" key={aviso.id}>
            <div className="card-body">
                <h2 className="card-title">{aviso.descripcion}</h2>
                <p>Fecha de creación: {new Date(aviso.fechaCreacion).getDate()}/{new Date(aviso.fechaCreacion).getMonth() + 1}/{new Date(aviso.fechaCreacion).getFullYear()} — {new Date(aviso.fechaCreacion).getHours() >= 10 ? new Date(aviso.fechaCreacion).getHours() : '0' + new Date(aviso.fechaCreacion).getHours()}:{new Date(aviso.fechaCreacion).getMinutes().toString().padStart(2, '0')}</p>
                <div className="card-actions justify-end">
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
                <div>
                    {renderAdjunto(aviso)}
                </div>
            </div>
        </div>
      ))
      : (<p>No hay avisos disponibles.</p>)}
      </div>
      {totalPages > 1 && (
        <div className="join mt-6 flex justify-center">
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