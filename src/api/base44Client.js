import { defaultProducts } from '../data/defaultProducts';

const createLocalStore = (entityName, initialData = []) => {
  const KEY = `naturals_${entityName}`;

  // Initialize with seed data if empty
  if (!localStorage.getItem(KEY) || localStorage.getItem(KEY) === '[]') {
    localStorage.setItem(KEY, JSON.stringify(initialData));
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

export const base44 = {
  entities: {
    Product:             createLocalStore('Product', defaultProducts),
    CartItem:            createLocalStore('CartItem'),
    WishlistItem:        createLocalStore('WishlistItem'),
    Order:               createLocalStore('Order'),
    Review:              createLocalStore('Review'),
    ContactMessage:      createLocalStore('ContactMessage'),
    NewsletterSubscriber:createLocalStore('NewsletterSubscriber'),
    SiteSetting:         createLocalStore('SiteSetting'),
  },
  integrations: {
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
};
