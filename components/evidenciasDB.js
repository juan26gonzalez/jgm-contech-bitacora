// Helper nativo IndexedDB para almacenamiento local de evidencias y planos privados (500MB+)
export function abrirDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open('JGM_ConTech_DB', 2);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('evidencias')) {
        db.createObjectStore('evidencias', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('planos')) {
        db.createObjectStore('planos', { keyPath: 'id' });
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

export async function guardarPlanoLocalEnDB(plano) {
  try {
    const db = await abrirDB();
    if (!db) return false;
    return await new Promise((resolve) => {
      const tx = db.transaction('planos', 'readwrite');
      tx.objectStore('planos').put(plano);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('Error al guardar plano en IndexedDB:', err);
    return false;
  }
}

export async function obtenerPlanosLocalesDeDB() {
  try {
    const db = await abrirDB();
    if (!db) return [];
    return await new Promise((resolve) => {
      const tx = db.transaction('planos', 'readonly');
      const request = tx.objectStore('planos').getAll();
      request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function eliminarPlanoLocalDeDB(id) {
  try {
    const db = await abrirDB();
    if (!db) return false;
    return await new Promise((resolve) => {
      const tx = db.transaction('planos', 'readwrite');
      tx.objectStore('planos').delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}
