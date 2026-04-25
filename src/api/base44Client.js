import { defaultProducts } from '../data/defaultProducts';
import { createFirebaseStore, firebaseIntegrations } from './firebaseClient';

// Change this to true to enable Cloud Database
const USE_FIREBASE = localStorage.getItem('naturals_use_firebase') === 'true';

const createLocalStore = (entityName, initialData = []) => {
  const KEY = `naturals_${entityName}`;
  // ... existing local store logic ...
  if (!localStorage.getItem(KEY) || localStorage.getItem(KEY) === '[]') {
    localStorage.setItem(KEY, JSON.stringify(initialData));
  } else if (entityName === 'Product') {
    try {
      let items = JSON.parse(localStorage.getItem(KEY));
      let changed = false;
      items = items.map(item => {
        const defaultItem = initialData.find(d => d.name === item.name);
        if (defaultItem && (item.image_url?.startsWith('data:') || !item.image_url)) {
          item.image_url = defaultItem.image_url;
          changed = true;
        }
        return item;
      });
      if (changed) localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) { console.error("Sync failed", e); }
  }

  const getAll = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  };
  const saveAll = (items) => localStorage.setItem(KEY, JSON.stringify(items));

  return {
    list: async (_sort, limit) => {
      let items = getAll();
      if (limit) items = items.slice(0, limit);
      return items;
    },
    filter: async (conditions = {}, _sort, limit) => {
      let items = getAll();
      items = items.filter(item =>
        Object.entries(conditions).every(([key, val]) => {
          if (val && typeof val === 'object' && val.$regex) {
            return new RegExp(val.$regex, val.$options || '').test(item[key] || '');
          }
          return item[key] === val;
        })
      );
      if (limit) items = items.slice(0, limit);
      return items;
    },
    create: async (data) => {
      const items = getAll();
      const newItem = {
        ...data,
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        created_date: new Date().toISOString(),
      };
      items.push(newItem);
      saveAll(items);
      return newItem;
    },
    update: async (id, data) => {
      const items = getAll();
      const idx = items.findIndex(i => i.id === id);
      if (idx >= 0) {
        items[idx] = { ...items[idx], ...data };
        saveAll(items);
        return items[idx];
      }
      return null;
    },
    delete: async (id) => {
      saveAll(getAll().filter(i => i.id !== id));
      return true;
    },
  };
};

const firebaseEntities = USE_FIREBASE ? {
  Product:             createFirebaseStore('Product'),
  CartItem:            createFirebaseStore('CartItem'),
  WishlistItem:        createFirebaseStore('WishlistItem'),
  Order:               createFirebaseStore('Order'),
  Review:              createFirebaseStore('Review'),
  ContactMessage:      createFirebaseStore('ContactMessage'),
  NewsletterSubscriber:createFirebaseStore('NewsletterSubscriber'),
  SiteSetting:         createFirebaseStore('SiteSetting'),
} : null;

export const base44 = {
  isCloud: USE_FIREBASE,
  entities: USE_FIREBASE ? firebaseEntities : {
    Product:             createLocalStore('Product', defaultProducts),
    CartItem:            createLocalStore('CartItem'),
    WishlistItem:        createLocalStore('WishlistItem'),
    Order:               createLocalStore('Order'),
    Review:              createLocalStore('Review'),
    ContactMessage:      createLocalStore('ContactMessage'),
    NewsletterSubscriber:createLocalStore('NewsletterSubscriber'),
    SiteSetting:         createLocalStore('SiteSetting'),
  },
  integrations: USE_FIREBASE ? firebaseIntegrations : {
    Core: {
      UploadFile: async ({ file }) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ file_url: reader.result });
          reader.onerror = () => reject(new Error('File read failed'));
          reader.readAsDataURL(file);
        });
      },
    },
  },
  auth: {
    me: async () => null,
    logout: () => {},
    redirectToLogin: () => {},
  },
  // Migration helper
  migration: {
    toggleCloud: (enable) => {
      localStorage.setItem('naturals_use_firebase', enable ? 'true' : 'false');
      window.location.reload();
    },
    migrateToCloud: async () => {
      if (!USE_FIREBASE) return { error: "Please enable Cloud Mode first." };
      
      const localStore = createLocalStore('Product', defaultProducts);
      const localProducts = await localStore.list();
      
      const cloudStore = createFirebaseStore('Product');
      await cloudStore.batchCreate(localProducts);
      
      return { success: true, count: localProducts.length };
    }
  }
};
