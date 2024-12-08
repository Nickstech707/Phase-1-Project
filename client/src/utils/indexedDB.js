const dbName = 'jobsDB';
const storeName = 'jobsStore';


export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 4);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (db.objectStoreNames.contains(storeName)) {
        db.deleteObjectStore(storeName);
      }
      db.createObjectStore(storeName, { keyPath: 'id' });
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};


export const saveToIndexedDB = async (data) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  
  return new Promise((resolve, reject) => {
    const request = store.put(data);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
};

export const loadAllFromIndexedDB = async () => {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
};

export const clearIndexedDB = async () => {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  
  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
};

export const saveDataInChunks = async (data, chunkSize = 100) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    await Promise.all(chunk.map(item => {
      return new Promise((resolve, reject) => {
        const request = store.put(item);
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
      });
    }));
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};




