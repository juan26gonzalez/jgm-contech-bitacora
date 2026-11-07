// Helper nativo IndexedDB para almacenamiento de evidencias fotográficas en alta capacidad (500MB+)
export function abrirDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open('JGM_ConTech_DB', 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('evidencias')) {
        db.createObjectStore('evidencias', { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => {
      console.warn('IndexedDB no disponible, usando fallback:', e);
      resolve(null);
    };
  });
}

export async function guardarEvidenciaEnDB(evidencia) {
  try {
    const db = await abrirDB();
    if (!db) return;
    const tx = db.transaction('evidencias', 'readwrite');
    const store = tx.objectStore('evidencias');
    store.put(evidencia);
  } catch (err) {
    console.warn('Error al guardar en IndexedDB:', err);
  }
}

export async function obtenerEvidenciasDeDB() {
  try {
    const db = await abrirDB();
    if (!db) return {};
    return new Promise((resolve) => {
      const tx = db.transaction('evidencias', 'readonly');
      const store = tx.objectStore('evidencias');
      const request = store.getAll();
      request.onsuccess = () => {
        const lista = request.result || [];
        const mapa = {};
        lista.forEach((item) => {
          if (item && item.id) {
            mapa[item.id] = item;
            mapa[String(item.id)] = item;
          }
        });
        resolve(mapa);
      };
      request.onerror = () => resolve({});
    });
  } catch (err) {
    return {};
  }
}
