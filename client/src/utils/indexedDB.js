const dbName = 'jobsDB';
const storeName = 'jobsStore';

const openDB = () => {
  return new Promise((resolve, reject) => {
    console.log('Opening IndexedDB...');
    const request = indexedDB.open(dbName, 4);
    request.onupgradeneeded = (event) => {
      console.log('Upgrading IndexedDB...');
      const db = event.target.result;
      if (db.objectStoreNames.contains(storeName)) {
        db.deleteObjectStore(storeName);
      }
      db.createObjectStore(storeName, { keyPath: 'id' });
    };
    request.onsuccess = (event) => {
      console.log('IndexedDB opened successfully');
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };
  });
};

export const saveToIndexedDB = async (data) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  
  return new Promise((resolve, reject) => {
    const request = store.put(data);
    request.onsuccess = () => {
      console.log('Data saved successfully');
      resolve();
    };
    request.onerror = () => {
      console.error('Error saving data:', request.error);
      reject(request.error);
    };
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

export const loadAllFromIndexedDB = async () => {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  const request = store.getAll();
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      console.log('Data loaded successfully');
      resolve(request.result);
    };
    request.onerror = () => {
      console.error('Error loading data:', request.error);
      reject(request.error);
    };
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

export const clearIndexedDB = async () => {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  const request = store.clear();
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      console.log('IndexedDB cleared successfully');
      resolve();
    };
    request.onerror = () => {
      console.error('Error clearing IndexedDB:', request.error);
      reject(request.error);
    };
    transaction.oncomplete = () => {
      db.close();
    };
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
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }));
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      console.log('All data saved successfully');
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      console.error('Error saving data in chunks:', transaction.error);
      db.close();
      reject(transaction.error);
    };
  });
};







