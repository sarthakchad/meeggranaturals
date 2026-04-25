import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, limit as firestoreLimit } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const createFirebaseStore = (entityName) => {
  const colRef = collection(db, entityName);

  return {
    list: async (_sort, lim) => {
      let q = query(colRef);
      if (lim) q = query(colRef, firestoreLimit(lim));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    filter: async (conditions = {}, _sort, lim) => {
      let q = colRef;
      Object.entries(conditions).forEach(([key, val]) => {
        if (val && typeof val === 'object' && val.$regex) {
          // Firestore doesn't support regex directly, we'll fetch and filter locally for search
        } else {
          q = query(q, where(key, "==", val));
        }
      });
      if (lim) q = query(q, firestoreLimit(lim));
      const snapshot = await getDocs(q);
      let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Secondary filter for regex if needed
      Object.entries(conditions).forEach(([key, val]) => {
        if (val && typeof val === 'object' && val.$regex) {
          const re = new RegExp(val.$regex, val.$options || '');
          results = results.filter(r => re.test(r[key] || ''));
        }
      });
      return results;
    },
    create: async (data) => {
      const docRef = await addDoc(colRef, {
        ...data,
        created_date: new Date().toISOString(),
      });
      return { id: docRef.id, ...data };
    },
    update: async (id, data) => {
      const docRef = doc(db, entityName, id);
      await updateDoc(docRef, data);
      return { id, ...data };
    },
    delete: async (id) => {
      const docRef = doc(db, entityName, id);
      await deleteDoc(docRef);
      return true;
    },
    batchCreate: async (items) => {
      // Helper for migration
      for (const item of items) {
        const { id, ...cleanItem } = item;
        await addDoc(colRef, { ...cleanItem });
      }
    }
  };
};

export const firebaseIntegrations = {
  Core: {
    UploadFile: async ({ file }) => {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const file_url = await getDownloadURL(snapshot.ref);
      return { file_url };
    }
  }
};
