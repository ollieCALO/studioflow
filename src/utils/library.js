const LOCAL_KEY = 'studioflow_library';
const generateId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function getLocalLibrary() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); }
  catch { return []; }
}

export function saveLocalLibrary(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export function saveItem(item) {
  const library = getLocalLibrary();
  const newItem = { ...item, id: generateId(), savedAt: new Date().toISOString() };
  library.unshift(newItem);
  saveLocalLibrary(library);
  return newItem;
}

export function deleteItem(id) {
  saveLocalLibrary(getLocalLibrary().filter(i => i.id !== id));
}

export function generateShareUrl(item) {
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(item))));
  return `${window.location.origin}?share=${encoded}`;
}

export function getSharedItem() {
  try {
    const params = new URLSearchParams(window.location.search);
    const share = params.get('share');
    if (!share) return null;
    return JSON.parse(decodeURIComponent(escape(atob(share))));
  } catch { return null; }
}

export const ITEM_TYPES = {
  PALETTE: 'palette', MOODBOARD: 'moodboard', FEEDBACK: 'feedback', EXTRACTED: 'extracted',
};
